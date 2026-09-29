import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-5";

/** Server-side fallbacks re-run a declined request on another model automatically. */
export const FALLBACK_BETA = "server-side-fallback-2026-07-01";

let client: Anthropic | null = null;

/** True when Claude credentials are configured; otherwise we use offline copy. */
export function hasClaudeCredentials(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

export function claude(): Anthropic {
  client ??= new Anthropic({ timeout: 120_000, maxRetries: 2 });
  return client;
}

/** A generation failure that's safe to show the operator, with a retry hint. */
export class GenerationError extends Error {
  constructor(
    readonly userMessage: string,
    readonly retryable: boolean,
    options?: ErrorOptions,
  ) {
    super(userMessage, options);
    this.name = "GenerationError";
  }
}

/** Maps SDK errors to operator-facing messages. Most specific first. */
export function toGenerationError(error: unknown): GenerationError {
  if (error instanceof GenerationError) return error;
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    return new GenerationError("The AI service rejected our credentials. Check ANTHROPIC_API_KEY.", false, { cause: error });
  }
  if (error instanceof Anthropic.RateLimitError) {
    return new GenerationError("The AI service is busy right now. Give it a few seconds and try again.", true, { cause: error });
  }
  if (error instanceof Anthropic.BadRequestError) {
    return new GenerationError("The AI service couldn't process this request.", false, { cause: error });
  }
  if (error instanceof Anthropic.APIConnectionTimeoutError || error instanceof Anthropic.APIConnectionError) {
    return new GenerationError("We couldn't reach the AI service. Check your connection and try again.", true, { cause: error });
  }
  if (error instanceof Anthropic.APIError) {
    return new GenerationError("The AI service had a problem generating this. Try again.", true, { cause: error });
  }
  return new GenerationError("Something went wrong while generating. Try again.", true, { cause: error });
}
