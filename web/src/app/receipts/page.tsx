"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import Link from "next/link";

// Download receipt function
const downloadReceipt = (receipt: any) => {
  const receiptContent = `
CAVE PAYMENT RECEIPT
===========================================

Transaction ID: ${receipt.transactionId}
Date: ${receipt.date}
Time: ${receipt.time}
Reference: ${receipt.reference}

CUSTOMER DETAILS:
Name: ${receipt.customerName}
Email: ${receipt.customerEmail}

PAYMENT DETAILS:
Service: ${receipt.service}
Provider: ${receipt.provider}
Amount: ₵${receipt.amount.toFixed(2)}
Status: ${receipt.status.toUpperCase()}

===========================================
Thank you for using Cave!
For support, contact: support@cave.com
  `.trim();

  const blob = new Blob([receiptContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${receipt.transactionId}-${receipt.date}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Download all receipts as ZIP
const downloadAllReceipts = (receipts: any[]) => {
  const receiptContent = receipts.map(receipt => `
CAVE PAYMENT RECEIPT
===========================================

Transaction ID: ${receipt.transactionId}
Date: ${receipt.date}
Time: ${receipt.time}
Reference: ${receipt.reference}

CUSTOMER DETAILS:
Name: ${receipt.customerName}
Email: ${receipt.customerEmail}

PAYMENT DETAILS:
Service: ${receipt.service}
Provider: ${receipt.provider}
Amount: ₵${receipt.amount.toFixed(2)}
Status: ${receipt.status.toUpperCase()}

===========================================
Thank you for using Cave!
For support, contact: support@cave.com
  `).join('\n\n' + '='.repeat(50) + '\n\n');

  const blob = new Blob([receiptContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `all-receipts-${new Date().toISOString().split('T')[0]}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const serviceIcons = {
  "Electricity": "⚡",
  "Water": "💧",
  "Internet": "🌐",
  "Airtime": "📱",
  "Data Bundles": "📶",
  "Education": "🎓",
  "Cable TV": "📺",
  "Tickets": "🎫",
  "Plane Ticket Booking": "✈️",
  "Insurance": "🛡️"
};

export default function Receipts() {
  const { user, loading } = useAuth();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [service, setService] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load receipts from localStorage
  useEffect(() => {
    const storedReceipts = JSON.parse(localStorage.getItem('cave_receipts') || '[]');
    setReceipts(storedReceipts);
  }, []);

  // Filter receipts
  const filtered = receipts.filter(receipt => {
    const matchesSearch = 
      receipt.service.toLowerCase().includes(search.toLowerCase()) ||
      receipt.provider.toLowerCase().includes(search.toLowerCase()) ||
      receipt.transactionId.toLowerCase().includes(search.toLowerCase());
    const matchesService = service ? receipt.service === service : true;
    const matchesDateFrom = dateFrom ? receipt.date >= dateFrom : true;
    const matchesDateTo = dateTo ? receipt.date <= dateTo : true;
    return matchesSearch && matchesService && matchesDateFrom && matchesDateTo;
  });

  // Get unique services for filter
  const uniqueServices = [...new Set(receipts.map(r => r.service))];

  // Analytics
  const totalReceipts = receipts.length;
  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);
  const averageAmount = totalReceipts > 0 ? totalAmount / totalReceipts : 0;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Not signed in.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/40 to-orange-100/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Payment Receipts</h1>
              <p className="text-gray-600 mt-1">View and download your payment receipts</p>
            </div>
            <Link 
              href="/dashboard" 
              className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-blue-700 transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Receipts</div>
                <div className="text-2xl font-bold text-gray-800">{totalReceipts}</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-blue-600">📄</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                <div className="text-2xl font-bold text-gray-800">₵{totalAmount.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-green-600">💰</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Average Amount</div>
                <div className="text-2xl font-bold text-gray-800">₵{averageAmount.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-purple-600">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4 items-end justify-between mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  placeholder="Search receipts..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 w-64"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Service</label>
                <select
                  value={service}
                  onChange={e => setService(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 w-48"
                >
                  <option value="">All Services</option>
                  {uniqueServices.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => downloadAllReceipts(filtered)}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
              >
                Download All
              </button>
              <button
                onClick={() => {
                  setSearch("");
                  setService("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600">
            Showing {filtered.length} of {totalReceipts} receipts
          </div>
        </div>

        {/* Receipts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-12">
              <div className="text-4xl mb-2">📄</div>
              <div>No receipts found</div>
              <div className="text-sm">Your payment receipts will appear here</div>
            </div>
          ) : (
            filtered.map(receipt => (
              <div key={receipt.transactionId} className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{serviceIcons[receipt.service as keyof typeof serviceIcons]}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{receipt.service}</div>
                      <div className="text-sm text-gray-500">{receipt.provider}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">{receipt.date}</div>
                    <div className="text-xs text-gray-500">{receipt.time}</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-gray-900">₵{receipt.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="text-gray-900 font-mono text-xs">{receipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="text-gray-900 font-mono text-xs">{receipt.reference}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadReceipt(receipt)}
                      className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-all"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReceipt(receipt);
                        setShowDetails(true);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition-all"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Receipt Details Modal */}
      {showDetails && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Receipt Details</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">{serviceIcons[selectedReceipt.service as keyof typeof serviceIcons]}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedReceipt.service}</h3>
                  <p className="text-gray-600">{selectedReceipt.provider}</p>
                </div>
              </div>

              {/* Receipt Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Transaction ID</label>
                    <div className="text-gray-900 font-mono">{selectedReceipt.transactionId}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Reference</label>
                    <div className="text-gray-900 font-mono">{selectedReceipt.reference}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Amount</label>
                    <div className="text-2xl font-bold text-gray-900">₵{selectedReceipt.amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Date & Time</label>
                    <div className="text-gray-900">{selectedReceipt.date} at {selectedReceipt.time}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Customer Name</label>
                    <div className="text-gray-900">{selectedReceipt.customerName}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Customer Email</label>
                    <div className="text-gray-900">{selectedReceipt.customerEmail}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Service</label>
                    <div className="text-gray-900">{selectedReceipt.service}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Provider</label>
                    <div className="text-gray-900">{selectedReceipt.provider}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => downloadReceipt(selectedReceipt)}
                  className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                >
                  Download Receipt
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
