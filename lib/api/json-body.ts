import { NextResponse } from 'next/server'

export type JsonBodyResult =
  { ok: true; data: unknown } | { ok: false; response: NextResponse }

// `req.json()` throws on an empty or malformed body; unguarded in a route
// handler that surfaces as a 500. An unparseable body is a client error —
// 400, the same as a body that parses but fails schema validation.
export async function readJsonBody(req: Request): Promise<JsonBodyResult> {
  try {
    return { ok: true, data: await req.json() }
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 },
      ),
    }
  }
}
