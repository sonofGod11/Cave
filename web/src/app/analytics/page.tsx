"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import Link from "next/link";

// Mock chart data - in production this would come from your backend
const generateChartData = (transactions: any[]) => {
  const now = new Date();
  const months: string[] = [];
  const spendingData: number[] = [];
  const serviceData: Record<string, number> = {};
  const providerData: Record<string, number> = {};
  const successRate: { success: number, failed: number } = { success: 0, failed: 0 };
  const paymentMethodData: Record<string, number> = {};

  // Generate last 6 months data
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    months.push(monthName);
    
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === date.getFullYear();
    });
    
    const monthTotal = monthTransactions.reduce((sum, t) => sum + (t.status === 'success' ? t.amount : 0), 0);
    spendingData.push(monthTotal);
  }

  // Service breakdown
  transactions.forEach(t => {
    if (t.status === 'success') {
      serviceData[t.service] = (serviceData[t.service] || 0) + t.amount;
      providerData[t.provider] = (providerData[t.provider] || 0) + t.amount;
    }
    successRate[t.status as keyof typeof successRate]++;
  });

  return {
    months,
    spendingData,
    serviceData,
    providerData,
    successRate,
    paymentMethodData
  };
};

// Chart component for spending trends
function SpendingChart({ data }: { data: { months: string[], spendingData: number[] } }) {
  const maxSpending = Math.max(...data.spendingData);
  
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Spending Trends (Last 6 Months)</h3>
      <div className="flex items-end justify-between h-48 gap-2">
        {data.spendingData.map((amount, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-xs text-gray-500 mb-1">₵{amount.toFixed(0)}</div>
            <div 
              className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400"
              style={{ 
                height: `${maxSpending > 0 ? (amount / maxSpending) * 100 : 0}%`,
                minHeight: amount > 0 ? '4px' : '0'
              }}
            ></div>
            <div className="text-xs text-gray-600 mt-2 font-medium">{data.months[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pie chart component for service breakdown
function ServiceBreakdownChart({ data }: { data: Record<string, number> }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];
  
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Spending by Service</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([service, amount], index) => {
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          return (
            <div key={service} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="font-medium text-gray-700">{service}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">₵{amount.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Success rate chart
function SuccessRateChart({ data }: { data: { success: number, failed: number } }) {
  const total = data.success + data.failed;
  const successPercentage = total > 0 ? (data.success / total) * 100 : 0;
  const failedPercentage = total > 0 ? (data.failed / total) * 100 : 0;
  
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Success Rate</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="font-medium text-gray-700">Successful</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-green-600">{data.success}</div>
            <div className="text-xs text-gray-500">{successPercentage.toFixed(1)}%</div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="font-medium text-gray-700">Failed</span>
          </div>
          <div className="text-right">
            <div className="font-bold text-red-600">{data.failed}</div>
            <div className="text-xs text-gray-500">{failedPercentage.toFixed(1)}%</div>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${successPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

// Provider breakdown chart
function ProviderBreakdownChart({ data }: { data: Record<string, number> }) {
  const sortedProviders = Object.entries(data).sort(([,a], [,b]) => b - a).slice(0, 5);
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Top Providers</h3>
      <div className="space-y-3">
        {sortedProviders.map(([provider, amount], index) => {
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          return (
            <div key={provider} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  {index + 1}
                </div>
                <span className="font-medium text-gray-700">{provider}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-800">₵{amount.toFixed(2)}</div>
                <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [scheduledPayments, setScheduledPayments] = useState<any[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedService, setSelectedService] = useState('');
  const [chartData, setChartData] = useState<any>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');

  // Load data from localStorage
  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('cave_transactions') || '[]');
    const storedScheduled = JSON.parse(localStorage.getItem('cave_scheduled_payments') || '[]');
    const storedRecurring = JSON.parse(localStorage.getItem('cave_recurring_payments') || '[]');
    
    setTransactions(storedTransactions);
    setScheduledPayments(storedScheduled);
    setRecurringPayments(storedRecurring);
  }, []);

  // Generate chart data when transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      setChartData(generateChartData(transactions));
    }
  }, [transactions]);

  // Filter transactions based on selected criteria
  const filteredTransactions = transactions.filter(t => {
    if (selectedService && t.service !== selectedService) return false;
    return true;
  });

  // Calculate analytics
  const totalSpent = filteredTransactions
    .filter(t => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalTransactions = filteredTransactions.length;
  const successfulTransactions = filteredTransactions.filter(t => t.status === 'success').length;
  const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;
  
  const averageAmount = successfulTransactions > 0 ? totalSpent / successfulTransactions : 0;
  
  const upcomingScheduled = scheduledPayments.filter(p => 
    p.status === 'scheduled' && new Date(p.scheduledDate) > new Date()
  ).length;
  
  const activeRecurring = recurringPayments.filter(p => p.status === 'active').length;

  // Export functionality
  const exportData = (format: string) => {
    const data = {
      transactions: filteredTransactions,
      scheduledPayments,
      recurringPayments,
      analytics: {
        totalSpent,
        totalTransactions,
        successRate,
        averageAmount,
        upcomingScheduled,
        activeRecurring
      },
      chartData
    };

    if (format === 'csv') {
      // Generate CSV
      const csvContent = generateCSV(data);
      downloadFile(csvContent, 'cave-analytics.csv', 'text/csv');
    } else if (format === 'json') {
      // Generate JSON
      const jsonContent = JSON.stringify(data, null, 2);
      downloadFile(jsonContent, 'cave-analytics.json', 'application/json');
    }
    
    setShowExportModal(false);
  };

  const generateCSV = (data: any) => {
    const headers = ['Date', 'Service', 'Provider', 'Amount', 'Status', 'Transaction ID'];
    const rows = data.transactions.map((t: any) => [
      t.date,
      t.service,
      t.provider,
      t.amount,
      t.status,
      t.id
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

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
              <h1 className="text-3xl font-bold text-gray-800">Analytics & Reports</h1>
              <p className="text-gray-600 mt-1">Track your payment patterns and spending habits</p>
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
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap gap-4 items-end justify-between">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900"
                >
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900"
                >
                  <option value="">All Services</option>
                  {[...new Set(transactions.map(t => t.service))].map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setTimeRange('6months');
                  setSelectedService('');
                }}
                className="px-4 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
              >
                Reset Filters
              </button>
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
            >
              Export Data
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-gray-800">₵{totalSpent.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-green-600">💰</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Success Rate</div>
                <div className="text-2xl font-bold text-gray-800">{successRate.toFixed(1)}%</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-blue-600">📊</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Avg. Amount</div>
                <div className="text-2xl font-bold text-gray-800">₵{averageAmount.toFixed(2)}</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-purple-600">📈</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Transactions</div>
                <div className="text-2xl font-bold text-gray-800">{totalTransactions}</div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-xl text-orange-600">📋</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {chartData && <SpendingChart data={chartData} />}
          {chartData && <SuccessRateChart data={chartData.successRate} />}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {chartData && <ServiceBreakdownChart data={chartData.serviceData} />}
          {chartData && <ProviderBreakdownChart data={chartData.providerData} />}
        </div>

        {/* Scheduled & Recurring Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Scheduled Payments</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Upcoming Payments</span>
                <span className="font-bold text-blue-600">{upcomingScheduled}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Scheduled</span>
                <span className="font-bold text-gray-800">{scheduledPayments.length}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Recurring Payments</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Recurring</span>
                <span className="font-bold text-green-600">{activeRecurring}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Recurring</span>
                <span className="font-bold text-gray-800">{recurringPayments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
            <Link href="/history" className="text-sm text-[var(--color-primary)] hover:underline font-semibold">View All</Link>
          </div>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <div>No transactions found</div>
              <div className="text-sm">Your payment activity will appear here</div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-lg ${transaction.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.status === 'success' ? '✓' : '✕'}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{transaction.service}</div>
                      <div className="text-sm text-gray-500">{transaction.provider} • {transaction.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.status === 'success' ? '+' : ''}₵{transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">{transaction.id}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Export Analytics Data</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Export Format</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="font-medium text-gray-800">CSV File</span>
                    <span className="text-sm text-gray-500">(Excel compatible)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      value="json"
                      checked={exportFormat === 'json'}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="font-medium text-gray-800">JSON File</span>
                    <span className="text-sm text-gray-500">(Raw data)</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Export Includes:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Transaction history</li>
                  <li>• Scheduled payments</li>
                  <li>• Recurring payments</li>
                  <li>• Analytics summary</li>
                  <li>• Chart data</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => exportData(exportFormat)}
                  className="flex-1 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                >
                  Export Data
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 