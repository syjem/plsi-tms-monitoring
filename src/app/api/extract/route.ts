import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  return NextResponse.json({ success: true, data: formData });
}
