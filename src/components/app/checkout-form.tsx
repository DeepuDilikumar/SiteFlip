"use client";

import { useActionState } from "react";
import { LockSimple } from "@phosphor-icons/react/ssr";
import { checkout, type CheckoutState } from "@/actions/billing";
import { Button } from "@/components/ui/button";

export function CheckoutForm({ price }: { price: number }) {
  const [state, action, pending] = useActionState<CheckoutState>(checkout, {});
  return (
    <form action={action}>
      {state.error ? (
        <p role="alert" className="mb-4 rounded-lg bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" loading={pending} className="w-full">
        {pending ? null : <LockSimple size={16} aria-hidden="true" />}
        Confirm upgrade · ${price}/month
      </Button>
    </form>
  );
}
