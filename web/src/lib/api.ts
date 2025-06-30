export type ApiResponse<T> = { success: boolean; data?: T; error?: string };

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Unknown error' };
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// Example: Get user profile
export async function getUserProfile() {
  return apiFetch<{ name: string; email: string; phone: string }>(
    '/api/user/profile' // Replace with real endpoint
  );
}

// Example: Pay a bill
export async function payBill(payload: { service: string; amount: number; account: string }) {
  return apiFetch<{ reference: string }>(
    '/api/bills/pay', // Replace with real endpoint
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
}

// Example: Get transaction history
export async function getTransactionHistory() {
  return apiFetch<Array<{ id: number; type: string; amount: string; date: string; status: string }>>(
    '/api/history' // Replace with real endpoint
  );
} 