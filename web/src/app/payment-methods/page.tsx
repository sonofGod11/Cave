"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import Link from "next/link";

interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'card' | 'bank';
  name: string;
  isDefault: boolean;
  lastUsed?: string;
  createdAt: string;
  details: {
    // Mobile Money
    network?: string;
    phoneNumber?: string;
    // Card
    cardNumber?: string;
    cardType?: string;
    expiryDate?: string;
    cardholderName?: string;
    // Bank
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
}

const mobileMoneyProviders = [
  { id: "mtn", name: "MTN Mobile Money", icon: "🟡", number: "024, 054, 055, 059" },
  { id: "vodafone", name: "Vodafone Cash", icon: "🔴", number: "050, 020" },
  { id: "airteltigo", name: "AirtelTigo Money", icon: "🔵", number: "027, 057, 026, 056" }
];

const banks = [
  { code: "GCB", name: "Ghana Commercial Bank" },
  { code: "ECOBANK", name: "Ecobank Ghana" },
  { code: "UBA", name: "United Bank for Africa" },
  { code: "STANBIC", name: "Stanbic Bank Ghana" },
  { code: "CAL", name: "CAL Bank" },
  { code: "FIDELITY", name: "Fidelity Bank Ghana" }
];

const cardTypes = [
  { type: "visa", name: "Visa", pattern: /^4/ },
  { type: "mastercard", name: "Mastercard", pattern: /^5[1-5]/ },
  { type: "amex", name: "American Express", pattern: /^3[47]/ },
  { type: "discover", name: "Discover", pattern: /^6/ }
];

export default function PaymentMethods() {
  const { user, loading } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<PaymentMethod | null>(null);
  const [methodType, setMethodType] = useState<'mobile_money' | 'card' | 'bank'>('mobile_money');
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load payment methods from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cave_payment_methods') || '[]');
    setPaymentMethods(stored);
  }, []);

  // Save payment methods to localStorage
  const savePaymentMethods = (methods: PaymentMethod[]) => {
    localStorage.setItem('cave_payment_methods', JSON.stringify(methods));
    setPaymentMethods(methods);
  };

  // Format card number for display
  const formatCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const masked = cleaned.slice(-4).padStart(cleaned.length, '*');
    return masked.replace(/(.{4})/g, '$1 ').trim();
  };

  // Get card type from number
  const getCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const cardType = cardTypes.find(ct => ct.pattern.test(cleaned));
    return cardType?.type || 'unknown';
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Payment method name is required';
    }

    if (methodType === 'mobile_money') {
      if (!formData.network) {
        newErrors.network = 'Network is required';
      }
      if (!formData.phoneNumber?.trim()) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^0[2-5][0-9]{8}$/.test(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Please enter a valid Ghanaian phone number';
      }
    }

    if (methodType === 'card') {
      if (!formData.cardNumber?.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
        newErrors.cardNumber = 'Please enter a valid card number';
      }
      if (!formData.cardholderName?.trim()) {
        newErrors.cardholderName = 'Cardholder name is required';
      }
      if (!formData.expiryDate?.trim()) {
        newErrors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
      }
    }

    if (methodType === 'bank') {
      if (!formData.bankName) {
        newErrors.bankName = 'Bank is required';
      }
      if (!formData.accountNumber?.trim()) {
        newErrors.accountNumber = 'Account number is required';
      }
      if (!formData.accountName?.trim()) {
        newErrors.accountName = 'Account name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newMethod: PaymentMethod = {
      id: editingMethod?.id || `pm_${Date.now()}`,
      type: methodType,
      name: formData.name,
      isDefault: editingMethod?.isDefault || paymentMethods.length === 0,
      createdAt: editingMethod?.createdAt || new Date().toISOString(),
      details: { ...formData }
    };

    let updatedMethods: PaymentMethod[];

    if (editingMethod) {
      // Update existing method
      updatedMethods = paymentMethods.map(pm => 
        pm.id === editingMethod.id ? newMethod : pm
      );
    } else {
      // Add new method
      if (newMethod.isDefault) {
        // Remove default from other methods
        updatedMethods = paymentMethods.map(pm => ({ ...pm, isDefault: false }));
      } else {
        updatedMethods = [...paymentMethods];
      }
      updatedMethods.push(newMethod);
    }

    savePaymentMethods(updatedMethods);
    setShowAddModal(false);
    setEditingMethod(null);
    setFormData({});
    setErrors({});
  };

  // Set default payment method
  const setDefaultMethod = (methodId: string) => {
    const updatedMethods = paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === methodId
    }));
    savePaymentMethods(updatedMethods);
  };

  // Delete payment method
  const deletePaymentMethod = (methodId: string) => {
    const updatedMethods = paymentMethods.filter(pm => pm.id !== methodId);
    
    // If we deleted the default method and there are other methods, set the first one as default
    if (updatedMethods.length > 0 && !updatedMethods.some(pm => pm.isDefault)) {
      updatedMethods[0].isDefault = true;
    }
    
    savePaymentMethods(updatedMethods);
    setShowDeleteModal(null);
  };

  // Edit payment method
  const editPaymentMethod = (method: PaymentMethod) => {
    setEditingMethod(method);
    setMethodType(method.type);
    setFormData({ ...method.details, name: method.name });
    setShowAddModal(true);
  };

  // Format card number input
  const formatCardNumberInput = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date input
  const formatExpiryInput = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
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
              <h1 className="text-3xl font-bold text-gray-800">Payment Methods</h1>
              <p className="text-gray-600 mt-1">Manage your saved payment methods</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-blue-700 transition-all"
              >
                Add Payment Method
              </button>
              <Link 
                href="/dashboard" 
                className="px-6 py-2 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Payment Methods Grid */}
        {paymentMethods.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💳</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Payment Methods</h2>
            <p className="text-gray-600 mb-6">Add your first payment method to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-8 py-3 rounded-lg bg-[var(--color-primary)] text-white font-semibold hover:bg-blue-700 transition-all"
            >
              Add Payment Method
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-2xl shadow p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      method.type === 'mobile_money' ? 'bg-green-100' :
                      method.type === 'card' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      <span className="text-2xl">
                        {method.type === 'mobile_money' ? '📱' :
                         method.type === 'card' ? '💳' : '🏦'}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{method.name}</div>
                      <div className="text-sm text-gray-500">
                        {method.type === 'mobile_money' ? 'Mobile Money' :
                         method.type === 'card' ? 'Credit/Debit Card' : 'Bank Transfer'}
                      </div>
                    </div>
                  </div>
                  {method.isDefault && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Default
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {method.type === 'mobile_money' && (
                    <>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Network:</span> {method.details.network}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Phone:</span> {method.details.phoneNumber}
                      </div>
                    </>
                  )}
                  {method.type === 'card' && (
                    <>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Card:</span> {formatCardNumber(method.details.cardNumber || '')}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Name:</span> {method.details.cardholderName}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Expires:</span> {method.details.expiryDate}
                      </div>
                    </>
                  )}
                  {method.type === 'bank' && (
                    <>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Bank:</span> {method.details.bankName}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Account:</span> {method.details.accountNumber}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Name:</span> {method.details.accountName}
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  {!method.isDefault && (
                    <button
                      onClick={() => setDefaultMethod(method.id)}
                      className="flex-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 text-sm hover:bg-blue-200 transition-all"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => editPaymentMethod(method)}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(method)}
                    className="flex-1 px-3 py-2 rounded-lg bg-red-100 text-red-700 text-sm hover:bg-red-200 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMethod(null);
                  setFormData({});
                  setErrors({});
                }}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Method Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., My MTN Mobile Money"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
              </div>

              {/* Method Type Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method Type *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { type: 'mobile_money', name: 'Mobile Money', icon: '📱' },
                    { type: 'card', name: 'Credit/Debit Card', icon: '💳' },
                    { type: 'bank', name: 'Bank Transfer', icon: '🏦' }
                  ].map((option) => (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => setMethodType(option.type as any)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        methodType === option.type
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{option.icon}</span>
                        <span className="font-semibold text-gray-800">{option.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Money Fields */}
              {methodType === 'mobile_money' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Network *</label>
                    <select
                      value={formData.network || ''}
                      onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="">Select Network</option>
                      {mobileMoneyProviders.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                    {errors.network && <div className="text-red-500 text-sm mt-1">{errors.network}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber || ''}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="0241234567"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    {errors.phoneNumber && <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>}
                  </div>
                </div>
              )}

              {/* Card Fields */}
              {methodType === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number *</label>
                    <input
                      type="text"
                      value={formData.cardNumber || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        cardNumber: formatCardNumberInput(e.target.value),
                        cardType: getCardType(e.target.value)
                      })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                    {errors.cardNumber && <div className="text-red-500 text-sm mt-1">{errors.cardNumber}</div>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name *</label>
                      <input
                        type="text"
                        value={formData.cardholderName || ''}
                        onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      {errors.cardholderName && <div className="text-red-500 text-sm mt-1">{errors.cardholderName}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                      <input
                        type="text"
                        value={formData.expiryDate || ''}
                        onChange={(e) => setFormData({ ...formData, expiryDate: formatExpiryInput(e.target.value) })}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      {errors.expiryDate && <div className="text-red-500 text-sm mt-1">{errors.expiryDate}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Fields */}
              {methodType === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bank *</label>
                    <select
                      value={formData.bankName || ''}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                      <option value="">Select Bank</option>
                      {banks.map(bank => (
                        <option key={bank.code} value={bank.name}>{bank.name}</option>
                      ))}
                    </select>
                    {errors.bankName && <div className="text-red-500 text-sm mt-1">{errors.bankName}</div>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number *</label>
                      <input
                        type="text"
                        value={formData.accountNumber || ''}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        placeholder="1234567890"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      {errors.accountNumber && <div className="text-red-500 text-sm mt-1">{errors.accountNumber}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name *</label>
                      <input
                        type="text"
                        value={formData.accountName || ''}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        placeholder="Account holder name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      />
                      {errors.accountName && <div className="text-red-500 text-sm mt-1">{errors.accountName}</div>}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                >
                  {editingMethod ? 'Update Payment Method' : 'Add Payment Method'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMethod(null);
                    setFormData({});
                    setErrors({});
                  }}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Payment Method</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{showDeleteModal.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => deletePaymentMethod(showDeleteModal.id)}
                  className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(null)}
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