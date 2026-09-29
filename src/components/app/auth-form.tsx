"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup, type AuthFormState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

type Mode = "signup" | "login";

const COPY: Record<Mode, { title: string; subtitle: string; submit: string; switchText: string; switchLink: string; switchHref: string }> = {
  signup: {
    title: "Create your account",
    subtitle: "Your first site is on us. No card required.",
    submit: "Create account",
    switchText: "Already have an account?",
    switchLink: "Log in",
    switchHref: "/login",
  },
  login: {
    title: "Welcome back",
    subtitle: "Log in to pick up where you left off.",
    submit: "Log in",
    switchText: "New to SiteFlip?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
};

export function AuthForm({ mode, next }: { mode: Mode; next?: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(mode === "signup" ? signup : login, {});
  const copy = COPY[mode];
  const errors = state.errors ?? {};

  return (
    <div>
      <h1 className="font-display text-4xl tracking-tight">{copy.title}</h1>
      <p className="mt-2 text-[15px] text-ink-2">{copy.subtitle}</p>

      <form action={action} className="mt-8 grid gap-4" noValidate>
        {next ? <input type="hidden" name="next" value={next} /> : null}
        {errors.form ? (
          <p role="alert" className="rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
            {errors.form}
          </p>
        ) : null}
        {mode === "signup" ? (
          <Field
            label="Name"
            name="name"
            autoComplete="name"
            defaultValue={state.values?.name}
            error={errors.name}
            required
          />
        ) : null}
        <Field
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          defaultValue={state.values?.email}
          error={errors.email}
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          hint={mode === "signup" ? "At least 8 characters." : undefined}
          error={errors.password}
          required
        />
        <Button type="submit" size="lg" loading={pending} className="mt-2 w-full">
          {copy.submit}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-3">
        {copy.switchText}{" "}
        <Link
          href={next ? `${copy.switchHref}?next=${encodeURIComponent(next)}` : copy.switchHref}
          className="font-medium text-ink underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-ink"
        >
          {copy.switchLink}
        </Link>
      </p>
    </div>
  );
}
