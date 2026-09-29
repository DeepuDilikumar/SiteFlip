import type { MotionKit } from "../types";
import { ClientParallax, ClientReveal } from "./client";

/**
 * Assembled on the server: exports of a "use client" module are opaque
 * references there, so the kit object itself can't live in that module.
 */
export const liveKit: MotionKit = { Reveal: ClientReveal, Parallax: ClientParallax };
