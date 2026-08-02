import { NextResponse } from "next/server";

/** Public self-registration is disabled. Admins add users under Admin → Users. */
export async function POST() {
  return NextResponse.json(
    { error: "Public registration is disabled. Please contact Pakhuis Tiles." },
    { status: 403 },
  );
}
