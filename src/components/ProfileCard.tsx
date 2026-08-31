import { PERSON } from "@/data/portfolio";

export function ProfileCard() {
  return (
    <div className="panel elevated relative overflow-hidden p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full"
        style={{ background: "var(--shadow-glow)" }}
      />
      <div className="flex items-center justify-between">
        <span className="mono-label">Digital Identity</span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Active
        </span>
      </div>

      <div className="mt-8 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/40 bg-primary/10 font-display text-base font-semibold text-primary">
          SMA
        </div>
        <div>
          <h3 className="text-xl font-semibold uppercase tracking-tight text-foreground">
            {PERSON.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{PERSON.program}</p>
          <p className="text-sm text-muted-foreground">{PERSON.college}</p>
        </div>
      </div>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
        <div className="bg-surface p-4">
          <dt className="mono-label">Current Status</dt>
          <dd className="mt-2 text-sm text-foreground">{PERSON.year} Student</dd>
        </div>
        <div className="bg-surface p-4">
          <dt className="mono-label">Focus</dt>
          <dd className="mt-2 text-sm text-foreground">{PERSON.focus}</dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>ID // SMA-CSML</span>
        <span>BUILD 2026</span>
      </div>
    </div>
  );
}
