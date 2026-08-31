import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-device";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 px-5 py-24 sm:px-8 lg:px-12 lg:py-36", className)}
    >
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function SectionHeading({
  meta,
  title,
  subtitle,
}: {
  meta: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="max-w-3xl">
      <p className="mono-label flex items-center gap-3">
        <span className="inline-block h-px w-8 bg-primary" />
        {meta}
      </p>
      <h2 className="mt-5 text-3xl font-semibold leading-[1.1] text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </Reveal>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </span>
  );
}

type BtnProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 font-mono text-[11px] uppercase tracking-[0.16em] transition-all duration-300";

export function ActionButton({ children, variant = "primary", className, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={cn(
        base,
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:brightness-110"
          : "border border-border-strong bg-transparent text-foreground hover:border-primary hover:text-primary",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ActionLink({
  children,
  href,
  variant = "ghost",
  className,
  external = true,
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        base,
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:brightness-110"
          : "border border-border-strong text-foreground hover:border-primary hover:text-primary",
        className,
      )}
    >
      {children}
    </a>
  );
}
