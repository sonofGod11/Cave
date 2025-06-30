import { NextResponse } from 'next/server';

let DEMO_API_KEY = 'demo-key-123';

export async function GET() {
  return NextResponse.json({ apiKey: DEMO_API_KEY });
}

export async function POST() {
  DEMO_API_KEY = 'demo-key-' + Math.floor(Math.random() * 1000000);
  return NextResponse.json({ apiKey: DEMO_API_KEY });
} 