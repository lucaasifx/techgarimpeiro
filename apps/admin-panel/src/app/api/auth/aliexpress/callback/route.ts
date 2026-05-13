import { NextResponse } from 'next/server';

// AliExpress Open Platform OAuth callback.
// For affiliate API usage this endpoint is never called,
// but the platform requires a valid HTTPS URL during app registration.
export async function GET() {
  return NextResponse.json({ ok: true });
}
