import { NextResponse } from "next/server";
import { hasEnoughCredits } from "./credits-service";
import type { CreditAction } from "./credits";
import { getCreditCost } from "./credits";

export function insufficientCreditsResponse(action: CreditAction): NextResponse {
  const cost = getCreditCost(action);
  return NextResponse.json(
    {
      error: "credits_exceeded",
      message: `Not enough credits. This action requires ${cost} credits.`,
    },
    { status: 403 }
  );
}

export async function requireCredits(
  userId: string,
  action: CreditAction
): Promise<NextResponse | null> {
  const hasCredits = await hasEnoughCredits(userId, action);
  if (!hasCredits) {
    return insufficientCreditsResponse(action);
  }
  return null;
}
