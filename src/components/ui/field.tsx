import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClasses =
  "h-11 w-full rounded-lg bg-surface px-3.5 text-[15px] text-ink shadow-card outline-none " +
  "placeholder:text-ink-3 transition-shadow duration-150 " +
  "hover:shadow-[0_0_0_1px_var(--color-line-strong)] " +
  "focus:shadow-[0_0_0_1px_var(--color-accent),0_0_0_4px_var(--color-accent-soft)] " +
  "aria-invalid:shadow-[0_0_0_1px_var(--color-danger)]";

type FieldProps = ComponentProps<"input"> & {
  label: string;
  hint?: ReactNode;
  error?: string;
};

/** A labelled input with helper text and an inline, announced error. */
export function Field({ label, hint, error, id, name, className, ...props }: FieldProps) {
  const inputId = id ?? name;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div className={cn("grid gap-1.5", className)}>
      <label htmlFor={inputId} className="text-[13px] font-medium text-ink">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={inputClasses}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-[13px] text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-[13px] text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
