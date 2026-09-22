import { useId, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function Labeled({ label, children, className, hint, htmlFor }: { label: string; children: ReactNode; className?: string; hint?: string; htmlFor?: string }) {
  return <div className={cn("grid gap-2", className)}>
    <label htmlFor={htmlFor} className="text-sm font-semibold text-foreground">{label}</label>
    {children}
    {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
  </div>;
}

export function TextField({ label, value, onChange, placeholder = "", type = "text", className }: { label: string; value: string; onChange: (next: string) => void; placeholder?: string; type?: string; className?: string }) {
  const id = useId();
  return <Labeled label={label} htmlFor={id} className={className ?? ""}>
    <Input id={id} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)}/>
  </Labeled>;
}

export function NumberField({ label, value, onChange, className }: { label: string; value: number; onChange: (next: number) => void; className?: string }) {
  const id = useId();
  return <Labeled label={label} htmlFor={id} className={className ?? ""}>
    <Input id={id} type="number" value={Number.isFinite(value) ? String(value) : "0"} onChange={(event) => onChange(Number(event.target.value || 0))}/>
  </Labeled>;
}

export function AreaField({ label, value, onChange, placeholder = "", className }: { label: string; value: string; onChange: (next: string) => void; placeholder?: string; className?: string }) {
  const id = useId();
  return <Labeled label={label} htmlFor={id} className={className ?? ""}>
    <Textarea id={id} rows={3} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)}/>
  </Labeled>;
}

export function SelectField({ label, value, onChange, options, placeholder = "Select", className }: { label: string; value: string; onChange: (next: string) => void; options: { value: string; label: string }[]; placeholder?: string; className?: string }) {
  return <Labeled label={label} className={className ?? ""}>
    <Select {...(value ? { value } : {})} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder={placeholder}/></SelectTrigger>
      <SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
    </Select>
  </Labeled>;
}

export function YesNo({ label, value, onChange }: { label: string; value: boolean; onChange: (next: boolean) => void }) {
  return <Labeled label={label}>
    <div className="inline-flex w-fit rounded-xl border border-border bg-card/70 p-1">
      {[["Yes", true], ["No", false]].map(([text, flag]) => <button key={String(text)} type="button" onClick={() => onChange(flag as boolean)} className={cn("rounded-lg px-4 py-1.5 text-sm font-semibold transition", value === flag ? "brand-gradient text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}>{text as string}</button>)}
    </div>
  </Labeled>;
}

export function SummaryRow({ label, value, strong, tone }: { label: string; value: string; strong?: boolean; tone?: "danger" | "success" }) {
  return <div className={cn("flex items-center justify-between py-2", strong && "border-t border-border pt-3 text-base font-bold")}>
    <span className={cn("text-sm text-muted-foreground", strong && "text-sm font-semibold text-foreground")}>{label}</span>
    <span className={cn("font-semibold", tone === "danger" && "text-destructive", tone === "success" && "text-success")}>{value}</span>
  </div>;
}
