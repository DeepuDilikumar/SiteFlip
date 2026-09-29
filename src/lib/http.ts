import "server-only";
import { NextResponse } from "next/server";

export type ApiErrorCode = "UNAUTHORIZED" | "FORBIDDEN_PLAN" | "LIMIT_REACHED" | "NOT_FOUND" | "BAD_REQUEST" | "GENERATION_FAILED";

export interface ApiError {
  code: ApiErrorCode;
  error: string;
  retryable?: boolean;
}

export function apiError(status: number, body: ApiError): NextResponse<ApiError> {
  return NextResponse.json(body, { status });
}

export const unauthorized = () => apiError(401, { code: "UNAUTHORIZED", error: "Log in to continue." });
export const notFound = (what: string) => apiError(404, { code: "NOT_FOUND", error: `${what} not found.` });
export const proOnly = (feature: string) =>
  apiError(403, { code: "FORBIDDEN_PLAN", error: `${feature} is available on the Pro plan.` });
