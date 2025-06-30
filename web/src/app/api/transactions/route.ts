import { NextRequest, NextResponse } from 'next/server';

const mockTransactions = [
  { id: 'TXN1', service: 'Electricity', amount: 100, status: 'success', date: '2024-06-25', provider: 'ECG' },
  { id: 'TXN2', service: 'Airtime', amount: 20, status: 'success', date: '2024-06-24', provider: 'MTN' },
];

const DEMO_API_KEY = 'demo-key-123';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== DEMO_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(mockTransactions);
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== DEMO_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  const newTxn = { id: 'TXN' + (mockTransactions.length + 1), ...data };
  mockTransactions.push(newTxn);
  return NextResponse.json(newTxn, { status: 201 });
} 