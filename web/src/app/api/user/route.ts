import { NextRequest, NextResponse } from 'next/server';

const DEMO_API_KEY = 'demo-key-123';
const mockUser = {
  id: 'user1',
  name: 'Ama Boateng',
  email: 'ama@example.com',
  role: 'user',
};

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== DEMO_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(mockUser);
} 