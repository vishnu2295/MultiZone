import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { ApiError } from "./apiService";

export function apiErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof ApiError) {
    return NextResponse.json(error.data ?? { error: error.message }, { status: error.status });
  }
  logger.error(fallbackMessage, { error });
  return NextResponse.json({ error: fallbackMessage }, { status: 500 });
}
