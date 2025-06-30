"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import Link from "next/link";

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

interface SupportMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: string;
  attachments?: string[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: string;
  isTyping?: boolean;
}

const faqCategories = [
  {
    name: "Getting Started",
    icon: "🚀",
    faqs: [
      {
        question: "How do I create an account?",
        answer: "Click the 'Sign Up' button on the homepage, fill in your details, verify your email, and you're ready to start making payments!"
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept Mobile Money (MTN, Vodafone, AirtelTigo), Credit/Debit Cards, and Bank Transfers from major Ghanaian banks."
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes! We use bank-level encryption and security measures to protect your payment information. We never store your card details on our servers."
      }
    ]
  },
  {
    name: "Payments & Transactions",
    icon: "💳",
    faqs: [
      {
        question: "How long do payments take to process?",
        answer: "Most payments are processed instantly. Mobile Money and Card payments are usually immediate, while Bank Transfers may take 1-2 business days."
      },
      {
        question: "What if my payment fails?",
        answer: "If a payment fails, check your account balance and try again. If the issue persists, contact our support team and we'll help you resolve it."
      },
      {
        question: "Can I schedule recurring payments?",
        answer: "Yes! You can set up recurring payments for regular bills like electricity, water, and internet. Go to your dashboard and click 'Set Up Recurring Payment'."
      },
      {
        question: "How do I get a receipt?",
        answer: "Receipts are automatically generated for all successful payments. You can download them from the Receipts page or they'll be sent to your email."
      }
    ]
  },
  {
    name: "Account & Security",
    icon: "🔒",
    faqs: [
      {
        question: "How do I enable two-factor authentication?",
        answer: "Go to Security Settings, click 'Enable' next to Two-Factor Authentication, and follow the setup instructions with your authenticator app."
      },
      {
        question: "I forgot my password. What should I do?",
        answer: "Click 'Forgot Password' on the login page, enter your email, and follow the reset instructions sent to your email."
      },
      {
        question: "How do I update my profile information?",
        answer: "Go to your Profile page, click 'Edit Profile', make your changes, and save. You can update your name, email, phone number, and avatar."
      }
    ]
  },
  {
    name: "Troubleshooting",
    icon: "🔧",
    faqs: [
      {
        question: "The app is not loading properly",
        answer: "Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, contact our support team."
      },
      {
        question: "I'm not receiving email notifications",
        answer: "Check your spam folder and ensure your email address is correct in your profile. You can also enable SMS notifications as a backup."
      },
      {
        question: "My transaction shows as pending",
        answer: "Some transactions may take a few minutes to process. If it's been more than 30 minutes, contact our support team with your transaction ID."
      }
    ]
  }
];

const supportCategories = [
  { value: "payment_issue", label: "Payment Issue", icon: "💳" },
  { value: "account_access", label: "Account Access", icon: "🔐" },
  { value: "technical_support", label: "Technical Support", icon: "🔧" },
  { value: "billing_inquiry", label: "Billing Inquiry", icon: "📄" },
  { value: "feature_request", label: "Feature Request", icon: "💡" },
  { value: "general_inquiry", label: "General Inquiry", icon: "❓" }
];

const priorityLevels = [
  { value: "low", label: "Low", color: "text-green-600 bg-green-100" },
  { value: "medium", label: "Medium", color: "text-yellow-600 bg-yellow-100" },
  { value: "high", label: "High", color: "text-red-600 bg-red-100" }
];

export default function Support() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'faq' | 'chat' | 'tickets' | 'contact'>('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // Load tickets from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cave_support_tickets') || '[]');
    setTickets(stored);
  }, []);

  // Save tickets to localStorage
  const saveTickets = (newTickets: SupportTicket[]) => {
    localStorage.setItem('cave_support_tickets', JSON.stringify(newTickets));
    setTickets(newTickets);
  };

  // Toggle FAQ expansion
  const toggleFaq = (question: string) => {
    const newExpanded = new Set(expandedFaqs);
    if (newExpanded.has(question)) {
      newExpanded.delete(question);
    } else {
      newExpanded.add(question);
    }
    setExpandedFaqs(newExpanded);
  };

  // Filter FAQs based on search and category
  const filteredFaqs = faqCategories
    .filter(category => !selectedCategory || category.name === selectedCategory)
    .map(category => ({
      ...category,
      faqs: category.faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(category => category.faqs.length > 0);

  // Create new support ticket
  const createTicket = () => {
    if (!ticketForm.subject || !ticketForm.description || !ticketForm.category) {
      alert('Please fill in all required fields');
      return;
    }

    const newTicket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      subject: ticketForm.subject,
      description: ticketForm.description,
      category: ticketForm.category,
      priority: ticketForm.priority as 'low' | 'medium' | 'high',
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        id: `msg_${Date.now()}`,
        sender: 'user',
        message: ticketForm.description,
        timestamp: new Date().toISOString()
      }]
    };

    const updatedTickets = [newTicket, ...tickets];
    saveTickets(updatedTickets);
    setShowTicketModal(false);
    setTicketForm({ subject: '', description: '', category: '', priority: 'medium' });
    setActiveTab('tickets');
  };

  // Add message to ticket
  const addTicketMessage = (ticketId: string, message: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          updatedAt: new Date().toISOString(),
          messages: [
            ...ticket.messages,
            {
              id: `msg_${Date.now()}`,
              sender: 'user' as const,
              message,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return ticket;
    });
    saveTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === ticketId) || null);
  };

  // Send chat message
  const sendChatMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `chat_${Date.now()}`,
      sender: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate agent response
    setIsAgentTyping(true);
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: `chat_${Date.now() + 1}`,
        sender: 'agent',
        message: "Thank you for your message. Our support team will get back to you shortly. In the meantime, you can check our FAQ section for quick answers to common questions.",
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, agentMessage]);
      setIsAgentTyping(false);
    }, 2000);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
              <h1 className="text-3xl font-bold text-gray-800">Customer Support</h1>
              <p className="text-gray-600 mt-1">We're here to help you with any questions or issues</p>
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
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 text-center">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3">Speak with our support team</p>
            <a href="tel:+233244123456" className="text-blue-600 font-semibold hover:text-blue-700">
              +233 24 412 3456
            </a>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 text-center">
            <div className="text-4xl mb-3">✉️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-3">Send us a detailed message</p>
            <a href="mailto:support@cave.com" className="text-blue-600 font-semibold hover:text-blue-700">
              support@cave.com
            </a>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-gray-100 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-3">Chat with us in real-time</p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="text-blue-600 font-semibold hover:text-blue-700"
            >
              Start Chat
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow mb-8 border border-gray-100">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'faq', label: 'FAQ', icon: '❓' },
              { id: 'tickets', label: 'Support Tickets', icon: '🎫' },
              { id: 'contact', label: 'Contact Us', icon: '📞' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search FAQ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="">All Categories</option>
                    {faqCategories.map(category => (
                      <option key={category.name} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <div>No FAQ found matching your search</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredFaqs.map(category => (
                      <div key={category.name} className="border border-gray-200 rounded-lg">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <h3 className="text-lg font-bold text-gray-800">
                            <span className="mr-2">{category.icon}</span>
                            {category.name}
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                          {category.faqs.map(faq => (
                            <div key={faq.question} className="px-6 py-4">
                              <button
                                onClick={() => toggleFaq(faq.question)}
                                className="w-full text-left flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                              >
                                <span className="font-semibold text-gray-800">{faq.question}</span>
                                <span className="text-gray-400 text-xl">
                                  {expandedFaqs.has(faq.question) ? '−' : '+'}
                                </span>
                              </button>
                              {expandedFaqs.has(faq.question) && (
                                <div className="mt-3 pl-2 text-gray-600">
                                  {faq.answer}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Support Tickets Tab */}
            {activeTab === 'tickets' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Support Tickets</h2>
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                  >
                    Create New Ticket
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-2">🎫</div>
                    <div>No support tickets yet</div>
                    <div className="text-sm">Create a ticket to get help with your issue</div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map(ticket => (
                      <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-800">{ticket.subject}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              priorityLevels.find(p => p.value === ticket.priority)?.color
                            }`}>
                              {priorityLevels.find(p => p.value === ticket.priority)?.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{ticket.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Contact Us Tab */}
            {activeTab === 'contact' && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">📞 Phone Support</h3>
                    <p className="text-gray-600 mb-2">Available Monday - Friday, 8:00 AM - 6:00 PM GMT</p>
                    <a href="tel:+233244123456" className="text-blue-600 font-semibold hover:text-blue-700">
                      +233 24 412 3456
                    </a>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">✉️ Email Support</h3>
                    <p className="text-gray-600 mb-2">We typically respond within 24 hours</p>
                    <a href="mailto:support@cave.com" className="text-blue-600 font-semibold hover:text-blue-700">
                      support@cave.com
                    </a>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">💬 Live Chat</h3>
                    <p className="text-gray-600 mb-2">Available 24/7 for instant support</p>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Start Live Chat
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">📍 Office Address</h3>
                    <p className="text-gray-600">
                      Cave Payments Ltd.<br />
                      123 Accra Street<br />
                      Accra, Ghana<br />
                      P.O. Box 12345
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Create Support Ticket</h2>
              <button
                onClick={() => setShowTicketModal(false)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); createTicket(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  <option value="">Select Category</option>
                  {supportCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.icon} {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <select
                  value={ticketForm.priority}
                  onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {priorityLevels.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                <textarea
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Please provide detailed information about your issue..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                >
                  Create Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Ticket: {selectedTicket.subject}</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Status: <span className={`font-semibold ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status.replace('_', ' ')}
                </span></span>
                <span>Priority: <span className={`font-semibold ${
                  priorityLevels.find(p => p.value === selectedTicket.priority)?.color
                }`}>
                  {priorityLevels.find(p => p.value === selectedTicket.priority)?.label}
                </span></span>
                <span>Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Messages</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTicket.messages.map(message => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p>{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Add Message</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        addTicketMessage(selectedTicket.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input.value.trim()) {
                        addTicketMessage(selectedTicket.id, input.value);
                        input.value = '';
                      }
                    }}
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-96 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Live Chat</h3>
              <p className="text-sm text-blue-100">We're here to help!</p>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white hover:text-blue-100"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">👋</div>
                <div>Welcome to Cave Support!</div>
                <div className="text-sm">How can we help you today?</div>
              </div>
            ) : (
              chatMessages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))
            )}
            {isAgentTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                  <p className="text-sm">Agent is typing...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    sendChatMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={sendChatMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
