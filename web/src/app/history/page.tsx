"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import Link from "next/link";

// Enhanced transaction data structure
const mockTransactions = [
  { 
    id: "TXN12345678", 
    service: "Electricity", 
    amount: 150.00, 
    status: "success", 
    date: "2024-06-25", 
    time: "14:30", 
    provider: "ECG",
    paymentMethod: "Mobile Money",
    mobileNumber: "0241234567",
    reference: "ECG-2024-001",
    description: "Monthly electricity bill payment"
  },
  { 
    id: "TXN12345677", 
    service: "Airtime", 
    amount: 20.00, 
    status: "success", 
    date: "2024-06-24", 
    time: "09:15", 
    provider: "MTN",
    paymentMethod: "Card",
    cardLast4: "1234",
    reference: "MTN-AIR-001",
    description: "Airtime top-up"
  },
  { 
    id: "TXN12345676", 
    service: "Water", 
    amount: 85.50, 
    status: "failed", 
    date: "2024-06-23", 
    time: "16:45", 
    provider: "GWCL",
    paymentMethod: "Bank Transfer",
    bankName: "GCB Bank",
    accountLast4: "5678",
    reference: "GWCL-2024-002",
    description: "Water bill payment",
    failureReason: "Insufficient funds"
  },
  { 
    id: "TXN12345675", 
    service: "Data Bundles", 
    amount: 50.00, 
    status: "success", 
    date: "2024-06-22", 
    time: "11:20", 
    provider: "AirtelTigo",
    paymentMethod: "Mobile Money",
    mobileNumber: "0271234567",
    reference: "AIRTEL-DATA-001",
    description: "5GB data bundle purchase"
  },
  { 
    id: "TXN12345674", 
    service: "Cable TV", 
    amount: 200.00, 
    status: "success", 
    date: "2024-06-21", 
    time: "13:10", 
    provider: "DStv",
    paymentMethod: "Card",
    cardLast4: "5678",
    reference: "DSTV-2024-003",
    description: "DStv Premium package renewal"
  },
  { 
    id: "TXN12345673", 
    service: "Education", 
    amount: 500.00, 
    status: "success", 
    date: "2024-06-20", 
    time: "10:30", 
    provider: "University of Ghana",
    paymentMethod: "Bank Transfer",
    bankName: "Ecobank",
    accountLast4: "9012",
    reference: "UG-FEES-2024-001",
    description: "Semester fees payment"
  },
  { 
    id: "TXN12345672", 
    service: "Insurance", 
    amount: 1200.00, 
    status: "success", 
    date: "2024-06-19", 
    time: "15:45", 
    provider: "SIC Insurance",
    paymentMethod: "Card",
    cardLast4: "3456",
    reference: "SIC-INS-2024-001",
    description: "Auto insurance premium"
  },
  { 
    id: "TXN12345671", 
    service: "Plane Ticket Booking", 
    amount: 600.00, 
    status: "success", 
    date: "2024-06-18", 
    time: "08:20", 
    provider: "Africa World Airlines",
    paymentMethod: "Mobile Money",
    mobileNumber: "0241234567",
    reference: "AWA-TKT-2024-001",
    description: "Accra to Kumasi flight ticket"
  }
];

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

const statusColors = {
  success: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" },
  failed: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  pending: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" }
};

function downloadCSV(data: any[]) {
  const headers = ["Date", "Time", "Service", "Provider", "Amount", "Payment Method", "Status", "Reference", "Description"];
  const rows = data.map(tx => [
    tx.date, 
    tx.time, 
    tx.service, 
    tx.provider, 
    `₵${tx.amount.toFixed(2)}`, 
    tx.paymentMethod, 
    tx.status, 
    tx.reference, 
    tx.description
  ]);
  let csv = headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Download receipt function
const downloadReceipt = (transactionId: string) => {
  const receipts = JSON.parse(localStorage.getItem('cave_receipts') || '[]');
  const receipt = receipts.find((r: any) => r.transactionId === transactionId);
  
  if (!receipt) {
    alert('Receipt not found');
    return;
  }

  // Generate PDF-like receipt content
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

  // Create and download file
  const blob = new Blob([receiptContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipt-${receipt.transactionId}-${receipt.date}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function History() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [service, setService] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Analytics calculations
  const totalTransactions = transactions.length;
  const successfulTransactions = transactions.filter(t => t.status === 'success').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;
  const totalAmount = transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const averageAmount = successfulTransactions > 0 ? totalAmount / successfulTransactions : 0;

  // Filter transactions
  const filtered = transactions.filter(tx => {
    const matchesSearch = 
      tx.service.toLowerCase().includes(search.toLowerCase()) ||
      tx.provider.toLowerCase().includes(search.toLowerCase()) ||
      tx.reference.toLowerCase().includes(search.toLowerCase()) ||
      tx.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status ? tx.status === status : true;
    const matchesService = service ? tx.service === service : true;
    const matchesPaymentMethod = paymentMethod ? tx.paymentMethod === paymentMethod : true;
    const matchesDateFrom = dateFrom ? tx.date >= dateFrom : true;
    const matchesDateTo = dateTo ? tx.date <= dateTo : true;
    return matchesSearch && matchesStatus && matchesService && matchesPaymentMethod && matchesDateFrom && matchesDateTo;
  });

  // Get unique services and payment methods for filters
  const uniqueServices = [...new Set(transactions.map(t => t.service))];
  const uniquePaymentMethods = [...new Set(transactions.map(t => t.paymentMethod))];

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
              <h1 className="text-3xl font-bold text-gray-800">Transaction History</h1>
              <p className="text-gray-600 mt-1">View and manage your payment history</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Transactions</div>
                <div className="text-2xl font-bold text-gray-800">{totalTransactions}</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-blue-600">📊</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Successful Payments</div>
                <div className="text-2xl font-bold text-green-600">{successfulTransactions}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-green-600">✓</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-gray-800">₵{totalAmount.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-purple-600">💰</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Average Amount</div>
                <div className="text-2xl font-bold text-gray-800">₵{averageAmount.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-orange-600">📈</span>
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
                  placeholder="Search transactions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 w-64"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 w-40"
                >
                  <option value="">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="pending">Pending</option>
                </select>
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
                <label className="text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 w-48"
                >
                  <option value="">All Methods</option>
                  {uniquePaymentMethods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => downloadCSV(filtered)}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
              >
                Download CSV
              </button>
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-l-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-[var(--color-primary)] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📋
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-r-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-[var(--color-primary)] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📊
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
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
            <button
              onClick={() => {
                setSearch("");
                setStatus("");
                setService("");
                setPaymentMethod("");
                setDateFrom("");
                setDateTo("");
              }}
              className="px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600">
            Showing {filtered.length} of {totalTransactions} transactions
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Transactions List/Grid */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Provider</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center text-gray-400 py-12">
                        <div className="text-4xl mb-2">📊</div>
                        <div>No transactions found</div>
                        <div className="text-sm">Try adjusting your filters</div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(tx => (
                      <tr key={tx.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{tx.date}</div>
                          <div className="text-xs text-gray-500">{tx.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{serviceIcons[tx.service as keyof typeof serviceIcons]}</span>
                            <span className="font-medium text-gray-900">{tx.service}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{tx.provider}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-gray-900">₵{tx.amount.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{tx.paymentMethod}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[tx.status as keyof typeof statusColors].bg} ${statusColors[tx.status as keyof typeof statusColors].text}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{tx.reference}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedTransaction(tx);
                              setShowDetails(true);
                            }}
                            className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition-all"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-12">
                <div className="text-4xl mb-2">📊</div>
                <div>No transactions found</div>
                <div className="text-sm">Try adjusting your filters</div>
              </div>
            ) : (
              filtered.map(tx => (
                <div key={tx.id} className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">{serviceIcons[tx.service as keyof typeof serviceIcons]}</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{tx.service}</div>
                        <div className="text-sm text-gray-500">{tx.provider}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[tx.status as keyof typeof statusColors].bg} ${statusColors[tx.status as keyof typeof statusColors].text}`}>
                      {tx.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-gray-900">₵{tx.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="text-gray-900">{tx.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900">{tx.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="text-gray-900">{tx.time}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs text-gray-500 mb-2">Reference: {tx.reference}</div>
                    <button
                      onClick={() => {
                        setSelectedTransaction(tx);
                        setShowDetails(true);
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition-all"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Transaction Details</h2>
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
                  <span className="text-3xl">{serviceIcons[selectedTransaction.service as keyof typeof serviceIcons]}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedTransaction.service}</h3>
                  <p className="text-gray-600">{selectedTransaction.provider}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold mt-2 inline-block ${statusColors[selectedTransaction.status as keyof typeof statusColors].bg} ${statusColors[selectedTransaction.status as keyof typeof statusColors].text}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Transaction ID</label>
                    <div className="text-gray-900 font-mono">{selectedTransaction.id}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Reference</label>
                    <div className="text-gray-900 font-mono">{selectedTransaction.reference}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Amount</label>
                    <div className="text-2xl font-bold text-gray-900">₵{selectedTransaction.amount.toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Date & Time</label>
                    <div className="text-gray-900">{selectedTransaction.date} at {selectedTransaction.time}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Payment Method</label>
                    <div className="text-gray-900">{selectedTransaction.paymentMethod}</div>
                  </div>
                  {selectedTransaction.mobileNumber && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Mobile Number</label>
                      <div className="text-gray-900">{selectedTransaction.mobileNumber}</div>
                    </div>
                  )}
                  {selectedTransaction.cardLast4 && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Card Number</label>
                      <div className="text-gray-900">**** **** **** {selectedTransaction.cardLast4}</div>
                    </div>
                  )}
                  {selectedTransaction.bankName && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Bank</label>
                      <div className="text-gray-900">{selectedTransaction.bankName}</div>
                    </div>
                  )}
                  {selectedTransaction.accountLast4 && (
                    <div>
                      <label className="text-sm font-semibold text-gray-600">Account Number</label>
                      <div className="text-gray-900">****{selectedTransaction.accountLast4}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-600">Description</label>
                <div className="text-gray-900">{selectedTransaction.description}</div>
              </div>

              {/* Failure Reason */}
              {selectedTransaction.failureReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <label className="text-sm font-semibold text-red-600">Failure Reason</label>
                  <div className="text-red-700">{selectedTransaction.failureReason}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    downloadReceipt(selectedTransaction.id);
                  }}
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