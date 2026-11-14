// Demo / synthetic data. Not from any real bank. All figures derive from analyzeLoan().
import { amortization, analyzeLoan, inr, inrLakh, type LoanInput } from "./finance";

export const DEMO_LOAN: LoanInput = {
  principal: 100000,
  annualRate: 14.5,
  tenureMonths: 24,
  processingFee: 2500,
  gstRate: 18,
  prepaymentPct: 2,
  latePaymentFee: 500,
};

export const DEMO_RESULT = analyzeLoan(DEMO_LOAN);

export const DEMO_DOCUMENT = {
  fileName: "Personal_Loan_Offer_Demo.pdf",
  lender: "Example Finance Ltd. (fictional)",
  product: "Personal Loan Offer",
  pages: 4,
  issued: "12 Nov 2026",
};

export type Level = "good" | "warn" | "risk";

export const IMPORTANT_TERMS = [
  {
    label: "Interest Rate",
    value: `${DEMO_LOAN.annualRate}% p.a.`,
    explain: "The annual interest charged on the outstanding loan amount.",
    detail: "Reducing balance — interest is charged only on what you still owe each month.",
  },
  {
    label: "Processing Fee",
    value: inr(DEMO_LOAN.processingFee),
    explain: "A fee charged by the lender for processing your loan application.",
    detail: `Plus 18% GST (${inr(DEMO_RESULT.gstOnFee)}). Usually deducted from the amount you receive.`,
  },
  {
    label: "Prepayment Charge",
    value: `${DEMO_LOAN.prepaymentPct}%`,
    explain: "A possible charge if you repay the loan early.",
    detail: "Applied on the outstanding principal you prepay. Check if it waives after 12 EMIs.",
  },
  {
    label: "Late Payment Charge",
    value: inr(DEMO_LOAN.latePaymentFee ?? 0),
    explain: "A penalty that may apply if an EMI is paid late.",
    detail: "Charged per missed EMI. Late payments may also affect your credit history.",
  },
];

export const HIDDEN_COSTS: { label: string; value: string; level: Level; why: string }[] = [
  {
    label: "Processing Fee",
    value: inr(DEMO_LOAN.processingFee),
    level: "warn",
    why: "Paid upfront — you may receive less than ₹1,00,000 in your account.",
  },
  {
    label: "GST on Processing Fee",
    value: inr(DEMO_RESULT.gstOnFee),
    level: "warn",
    why: "Tax added on top of the fee. Often missed when comparing offers.",
  },
  {
    label: "Prepayment Penalty",
    value: `${DEMO_LOAN.prepaymentPct}% of outstanding`,
    level: "risk",
    why: "Closing early to save interest will cost extra. Limits your flexibility.",
  },
  {
    label: "Late Payment Fee",
    value: `${inr(DEMO_LOAN.latePaymentFee ?? 0)} / EMI`,
    level: "warn",
    why: "Adds up quickly if you miss more than one EMI. Set up auto-debit.",
  },
  {
    label: "Annual Maintenance Fee",
    value: "Not detected",
    level: "good",
    why: "No yearly account or maintenance charge found in this document.",
  },
];

export const RISK = {
  score: 72,
  label: "Moderate Review",
  breakdown: [
    { label: "Interest cost", level: "Medium" as const, value: 60 },
    { label: "Fees", level: "Medium" as const, value: 55 },
    { label: "Penalty conditions", level: "High" as const, value: 80 },
    { label: "Repayment burden", level: "Low" as const, value: 25 },
  ],
};

export const VERDICT = {
  status: "REVIEW BEFORE ACCEPTING",
  summary:
    "The loan appears manageable, but the processing fee and total repayment cost should be reviewed before acceptance.",
  reasons: [
    `The interest rate of ${DEMO_LOAN.annualRate}% is within the typical personal-loan range, but not the lowest available.`,
    `Fees of ${inr(DEMO_RESULT.totalFees)} (fee + GST) add ${((DEMO_RESULT.totalFees / DEMO_LOAN.principal) * 100).toFixed(1)}% to your cost upfront.`,
    `A ${DEMO_LOAN.prepaymentPct}% prepayment charge reduces the benefit of closing the loan early.`,
    `The EMI of ${inr(DEMO_RESULT.emi)} is manageable for a monthly income above roughly ₹16,000 (EMI under 30% of income).`,
  ],
};

export function explanation(simple: boolean): string[] {
  const r = DEMO_RESULT;
  if (simple) {
    return [
      `The bank is lending you ${inr(DEMO_LOAN.principal)}. You have to give it back, plus a little extra.`,
      `Every month for 2 years, you pay about ${inr(r.emi)}. That monthly payment is called an EMI.`,
      `The "extra" you pay is interest — about ${inr(r.totalInterest)} — think of it as the rent for borrowing money.`,
      `You also pay a one-time fee of ${inr(r.totalFees)} just to get the loan.`,
      `So in total, about ${inrLakh(r.totalCost)} leaves your pocket. If you want to close the loan early, you'll pay a small penalty.`,
    ];
  }
  return [
    `You are borrowing ${inr(DEMO_LOAN.principal)}.`,
    `Your monthly EMI is approximately ${inr(r.emi)}.`,
    `Over ${DEMO_LOAN.tenureMonths} months, you may repay around ${inrLakh(r.totalCost)} including interest (${inr(r.totalInterest)}) and fees (${inr(r.totalFees)}).`,
    "The biggest things to check before accepting are the processing fee and prepayment conditions.",
  ];
}

export const SUGGESTED_QUESTIONS = [
  "How much will I actually repay?",
  "What is the most expensive part of this loan?",
  "What happens if I repay early?",
  "Are there any hidden charges?",
  "Explain this loan in simple words.",
  "Should I compare this with another offer?",
];

/** Predefined, document-grounded answers for the prototype chat. */
export function answerQuestion(q: string): string {
  const s = q.toLowerCase();
  const r = DEMO_RESULT;
  if (/(repay early|prepay|foreclos|close early|early)/.test(s)) {
    const outstanding12 = amortization(DEMO_LOAN.principal, DEMO_LOAN.annualRate, DEMO_LOAN.tenureMonths)[11].balance;
    const penalty = outstanding12 * ((DEMO_LOAN.prepaymentPct ?? 0) / 100);
    const interestSaved = r.emi * 12 - outstanding12;
    return `If you repay early, a ${DEMO_LOAN.prepaymentPct}% prepayment charge applies on the outstanding principal. For example, closing after 12 EMIs (≈ ${inr(outstanding12)} outstanding) would cost about ${inr(penalty)} as a penalty — but you'd still save roughly ${inr(interestSaved - penalty)} in future interest after the penalty. Ask the lender whether the charge is waived after a lock-in period.`;
  }
  if (/(hidden|charges|extra|fee)/.test(s)) {
    return `I found 4 cost items worth noticing:\n• Processing fee — ${inr(DEMO_LOAN.processingFee)}\n• GST on fee — ${inr(r.gstOnFee)}\n• Prepayment penalty — ${DEMO_LOAN.prepaymentPct}%\n• Late payment fee — ${inr(DEMO_LOAN.latePaymentFee ?? 0)} per EMI\nGood news: no annual maintenance fee was detected.`;
  }
  if (/(expensive|biggest|most cost)/.test(s)) {
    return `Interest is the most expensive part: about ${inr(r.totalInterest)} over 24 months. That's ${((r.totalInterest / r.costOfBorrowing) * 100).toFixed(0)}% of your total borrowing cost. Fees add another ${inr(r.totalFees)}. A rate 1% lower would save you roughly ${inr(r.totalRepayment - analyzeLoan({ ...DEMO_LOAN, annualRate: DEMO_LOAN.annualRate - 1 }).totalRepayment)}.`;
  }
  if (/(compare|another offer|other offer|better)/.test(s)) {
    return `Yes — it's worth comparing. Your offer's total cost of borrowing is ${inr(r.costOfBorrowing)} (${r.effectiveCostPct.toFixed(1)}% of the loan). Look for offers with a lower rate, a smaller processing fee, or no prepayment charge. You can use the Compare tool to see two offers side by side.`;
  }
  if (/(simple|explain|understand|mean)/.test(s)) {
    return `In simple words: you borrow ${inr(DEMO_LOAN.principal)} and pay ${inr(r.emi)} every month for 2 years. Including interest and fees, about ${inrLakh(r.totalCost)} leaves your account in total. It's a fair offer, but check the fees and early-closure penalty first.`;
  }
  if (/(repay|total|pay back|how much|cost)/.test(s)) {
    return `You will repay about ${inr(r.totalRepayment)} through 24 EMIs of ${inr(r.emi)}. Adding the processing fee and GST (${inr(r.totalFees)}), your total outflow is about ${inr(r.totalCost)} — that's ${inr(r.costOfBorrowing)} more than you borrowed.`;
  }
  if (/(emi|monthly)/.test(s)) {
    return `Your monthly EMI is ${inr(r.emi)} for ${DEMO_LOAN.tenureMonths} months. Early EMIs are mostly interest; later EMIs mostly repay principal.`;
  }
  if (/(late|miss)/.test(s)) {
    return `Missing an EMI costs ${inr(DEMO_LOAN.latePaymentFee ?? 0)} per instance, and may be reported to credit bureaus. Setting up auto-debit is the simplest way to avoid this.`;
  }
  if (/(should i|accept|good|safe)/.test(s)) {
    return `FinSight's verdict is "Review before accepting". The EMI looks manageable, but negotiate the processing fee and ask about the prepayment charge. This is informational analysis, not financial advice.`;
  }
  return `Based on this document: ${inr(DEMO_LOAN.principal)} at ${DEMO_LOAN.annualRate}% for ${DEMO_LOAN.tenureMonths} months, EMI ${inr(r.emi)}, total outflow ${inr(r.totalCost)}. Try asking about repayment, fees, prepayment or comparing offers.`;
}

export const GLOSSARY = [
  { term: "EMI", meaning: "Equated Monthly Instalment — the fixed amount you pay every month until the loan is repaid." },
  { term: "Principal", meaning: "The original amount you borrow, before any interest or fees." },
  { term: "Reducing balance rate", meaning: "Interest is calculated only on the amount you still owe, so it falls each month." },
  { term: "Flat rate", meaning: "Interest is charged on the full original amount for the whole tenure — usually costlier than it looks." },
  { term: "Processing fee", meaning: "A one-time charge to process your loan. Often deducted from the disbursed amount." },
  { term: "Prepayment / Foreclosure", meaning: "Paying back part or all of the loan before the tenure ends. May attract a penalty." },
  { term: "APR", meaning: "Annual Percentage Rate — the yearly cost including interest and most fees. Better for comparing offers." },
  { term: "Tenure", meaning: "The length of time you have to repay the loan, usually in months." },
  { term: "Credit score", meaning: "A number that reflects how reliably you've repaid credit. Late EMIs can lower it." },
  { term: "Minimum amount due", meaning: "On a credit card, the smallest payment to avoid a late fee — interest still applies to the rest." },
];
