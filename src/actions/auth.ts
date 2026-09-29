"use server";

import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { users } from "@/lib/db";
import { currentPeriod } from "@/lib/entitlements";
import { endSession, startSession } from "@/lib/auth/session";

export type AuthFormState = {
  errors?: Partial<Record<"name" | "email" | "password" | "form", string>>;
  values?: { name?: string; email?: string };
};

const SignupSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(80, "Keep it under 80 characters."),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(8, "Use at least 8 characters."),
});

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address.")),
  password: z.string().min(1, "Enter your password."),
});

/** Only allow redirects back into the app, never to another origin. */
function safeNext(value: FormDataEntryValue | null, fallback: string): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

function fieldErrors(error: z.ZodError): AuthFormState["errors"] {
  const errors: AuthFormState["errors"] = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof NonNullable<AuthFormState["errors"]>;
    errors[key] ??= issue.message;
  }
  return errors;
}

export async function signup(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = SignupSchema.safeParse(Object.fromEntries(formData));
  const values = { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? "") };
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const { name, email, password } = parsed.data;
  if (await users.findByEmail(email)) {
    return { errors: { email: "An account with this email already exists. Log in instead." }, values };
  }

  const user = await users.create({
    id: `usr_${randomUUID().replaceAll("-", "").slice(0, 16)}`,
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    plan: "free",
    usagePeriod: currentPeriod(),
    generationsThisPeriod: 0,
    createdAt: new Date().toISOString(),
  });

  await startSession(user.id);
  redirect("/dashboard");
}

export async function login(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = LoginSchema.safeParse(Object.fromEntries(formData));
  const values = { email: String(formData.get("email") ?? "") };
  if (!parsed.success) return { errors: fieldErrors(parsed.error), values };

  const user = await users.findByEmail(parsed.data.email);
  const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !valid) {
    return { errors: { form: "That email and password don't match an account." }, values };
  }

  await startSession(user.id);
  redirect(safeNext(formData.get("next"), "/dashboard"));
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/");
}
