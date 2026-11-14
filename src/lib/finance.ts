// Pure financial math used across FinSight. Keep this side-effect free so it can be tested
// and later swapped for a backend calculation engine.

export interface LoanInput {
  principal: number;
  annualRate: number; // percent, e.g. 14.5
  tenureMonths: number;
  processingFee: number;
  gstRate?: number; // percent applied on processing fee, default 18
  prepaymentPct?: number;
  latePaymentFee?: number;
}

export interface LoanResult {
  emi: number;
  totalRepayment: number; // sum of all EMIs
  totalInterest: number;
  gstOnFee: number;
  totalFees: number; // processing fee + GST
  totalCost: number; // total repayment + fees (everything you pay)
  costOfBorrowing: number; // interest + fees
  effectiveCostPct: number; // cost of borrowing as % of principal
}

export function calculateEmi(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export function analyzeLoan(input: LoanInput): LoanResult {
  const emi = calculateEmi(input.principal, input.annualRate, input.tenureMonths);
  const totalRepayment = emi * input.tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - input.principal);
  const gstOnFee = input.processingFee * ((input.gstRate ?? 18) / 100);
  const totalFees = input.processingFee + gstOnFee;
  const totalCost = totalRepayment + totalFees;
  const costOfBorrowing = totalInterest + totalFees;
  return {
    emi,
    totalRepayment,
    totalInterest,
    gstOnFee,
    totalFees,
    totalCost,
    costOfBorrowing,
    effectiveCostPct: input.principal > 0 ? (costOfBorrowing / input.principal) * 100 : 0,
  };
}

export interface ScheduleRow {
  month: number;
  principalPaid: number;
  interestPaid: number;
  balance: number;
}

export function amortization(principal: number, annualRate: number, months: number): ScheduleRow[] {
  const emi = calculateEmi(principal, annualRate, months);
  const r = annualRate / 12 / 100;
  let balance = principal;
  const rows: ScheduleRow[] = [];
  for (let m = 1; m <= months; m++) {
    const interestPaid = balance * r;
    const principalPaid = emi - interestPaid;
    balance = Math.max(0, balance - principalPaid);
    rows.push({ month: m, principalPaid, interestPaid, balance });
  }
  return rows;
}

/** Indian-grouped rupee string, e.g. 115799 -> "₹1,15,799". */
export function inr(value: number, opts: { decimals?: number } = {}): string {
  const d = opts.decimals ?? 0;
  return (
    "₹" +
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d }).format(
      d === 0 ? Math.round(value) : value,
    )
  );
}

/** Short lakh form, e.g. 118749 -> "₹1.19 lakh". */
export function inrLakh(value: number): string {
  return `₹${(value / 100000).toFixed(2)} lakh`;
}

export interface Offer extends LoanInput {
  name: string;
}

export interface Comparison {
  a: LoanResult;
  b: LoanResult;
  winner: "A" | "B" | "tie";
  savings: number; // difference in total outflow
  reasons: string[];
}

/** Recommends the offer with the lower total outflow (EMIs + fees). */
export function compareOffers(offerA: Offer, offerB: Offer): Comparison {
  const a = analyzeLoan(offerA);
  const b = analyzeLoan(offerB);
  const diff = a.totalCost - b.totalCost;
  const winner = Math.abs(diff) < 1 ? "tie" : diff > 0 ? "B" : "A";
  const [win, lose, wr, lr] = winner === "A" ? [offerA, offerB, a, b] : [offerB, offerA, b, a];
  const reasons: string[] = [];
  if (winner !== "tie") {
    if (win.annualRate < lose.annualRate)
      reasons.push(`Lower interest rate (${win.annualRate}% vs ${lose.annualRate}%) saves ${inr(lr.totalInterest - wr.totalInterest)} in interest.`);
    if (wr.totalFees < lr.totalFees)
      reasons.push(`Lower upfront fees: ${inr(wr.totalFees)} vs ${inr(lr.totalFees)} including GST.`);
    if ((win.prepaymentPct ?? 0) < (lose.prepaymentPct ?? 0))
      reasons.push(`Smaller prepayment charge (${win.prepaymentPct ?? 0}% vs ${lose.prepaymentPct ?? 0}%) gives more flexibility to close early.`);
    if ((win.latePaymentFee ?? 0) < (lose.latePaymentFee ?? 0))
      reasons.push(`Lower late payment fee (${inr(win.latePaymentFee ?? 0)} vs ${inr(lose.latePaymentFee ?? 0)}).`);
    if (wr.emi > lr.emi) reasons.push(`Note: its EMI is ${inr(wr.emi - lr.emi)} higher per month — make sure it fits your budget.`);
  }
  return { a, b, winner, savings: Math.abs(diff), reasons };
}
