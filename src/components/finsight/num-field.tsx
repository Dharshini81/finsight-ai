import { Label } from "@/components/ui/label";

export function NumField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1.5 flex h-11 items-center rounded-xl border border-input bg-background px-3 focus-within:border-signal focus-within:ring-2 focus-within:ring-ring/30">
        {prefix && <span className="mr-1.5 text-sm font-semibold text-muted-foreground">{prefix}</span>}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="num w-full bg-transparent text-sm font-semibold outline-none"
        />
        {suffix && <span className="ml-1.5 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}
