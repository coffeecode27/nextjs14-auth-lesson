import { CurrentRole } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

// api route juga bagian dari server side
export async function GET() {
  const role = await CurrentRole();
  if (role === UserRole.ADMIN) {
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 403 });
}
