"use client";
import { useState, useEffect } from "react";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from "../AuthProvider";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const stats = [
  { label: "Users", value: 1240, icon: "👤", color: "bg-green-500/90 text-white" },
  { label: "Transactions", value: 5320, icon: "💳", color: "bg-green-400/90 text-white" },
  { label: "Revenue", value: "₵25,000.00", icon: "💰", color: "bg-green-300/90 text-green-900" },
  { label: "Services", value: 12, icon: "🧾", color: "bg-green-200/90 text-green-900" },
];

const nav = [
  { label: "Dashboard", key: "dashboard", permission: "dashboard" },
  { label: "Users", key: "users", permission: "users" },
  { label: "Transactions", key: "transactions", permission: "transactions" },
  { label: "Services", key: "services", permission: "services" },
  { label: "Service Analytics", key: "service-analytics", permission: "analytics" },
  { label: "Audit Logs", key: "audit-logs", permission: "audit" },
  { label: "Role Management", key: "roles", permission: "roles" },
  { label: "Support", key: "support", permission: "support" },
  { label: "Settings", key: "settings", permission: "settings" },
  { label: "Real-Time Monitoring", key: "realtime", permission: "realtime" },
];

const mockServices = [
  { id: 1, name: "Electricity", category: "Utility", status: "Active", price: 10, commission: 1, helpUrl: "https://help.cave.com/electricity" },
  { id: 2, name: "Water", category: "Utility", status: "Active", price: 8, commission: 0.8, helpUrl: "https://help.cave.com/water" },
  { id: 3, name: "Airtime", category: "Telecom", status: "Active", price: 5, commission: 0.5, helpUrl: "https://help.cave.com/airtime" },
  { id: 4, name: "Cable TV", category: "Entertainment", status: "Suspended", price: 20, commission: 2, helpUrl: "https://help.cave.com/cabletv" },
  { id: 5, name: "Internet", category: "Telecom", status: "Active", price: 15, commission: 1.5, helpUrl: "https://help.cave.com/internet" },
  { id: 6, name: "Data Bundles", category: "Telecom", status: "Active", price: 12, commission: 1.2, helpUrl: "https://help.cave.com/databundles" },
  { id: 7, name: "Education Fees", category: "Education", status: "Active", price: 50, commission: 5, helpUrl: "https://help.cave.com/education" },
  { id: 8, name: "Tickets", category: "Events", status: "Active", price: 30, commission: 3, helpUrl: "https://help.cave.com/tickets" },
  { id: 9, name: "Insurance", category: "Finance", status: "Suspended", price: 25, commission: 2.5, helpUrl: "https://help.cave.com/insurance" },
];

// Mock chart data
const userGrowthData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Users",
      data: [200, 400, 700, 900, 1100, 1200, 1240],
      borderColor: "#22c55e",
      backgroundColor: "rgba(34,197,94,0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};
const agentPerformanceData = {
  labels: ["Agent A", "Agent B", "Agent C", "Agent D", "Agent E"],
  datasets: [
    {
      label: "Transactions",
      data: [120, 90, 60, 40, 30],
      backgroundColor: ["#22c55e", "#4ade80", "#bbf7d0", "#a7f3d0", "#6ee7b7"],
    },
  ],
};
const transactionTrendsData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Transactions",
      data: [300, 400, 350, 500, 600, 700, 650],
      borderColor: "#22c55e",
      backgroundColor: "rgba(34,197,94,0.1)",
      tension: 0.4,
      fill: true,
    },
  ],
};

// Mock analytics data for services
const serviceAnalytics = [
  { name: "Electricity", transactions: 320, revenue: 12000 },
  { name: "Water", transactions: 210, revenue: 8000 },
  { name: "Airtime", transactions: 500, revenue: 15000 },
  { name: "Cable TV", transactions: 120, revenue: 4000 },
  { name: "Internet", transactions: 340, revenue: 11000 },
  { name: "Data Bundles", transactions: 290, revenue: 9000 },
  { name: "Education Fees", transactions: 60, revenue: 3000 },
  { name: "Tickets", transactions: 45, revenue: 2000 },
  { name: "Insurance", transactions: 20, revenue: 1000 },
];

const mockAuditLogs = [
  { id: 1, admin: "Kwame Mensah", action: "Login", detail: "Logged in", date: "2024-06-25 09:00" },
  { id: 2, admin: "Kwame Mensah", action: "Edit Service", detail: "Edited Electricity", date: "2024-06-25 09:10" },
  { id: 3, admin: "Ama Boateng", action: "Send Announcement", detail: "Broadcasted promo", date: "2024-06-25 09:15" },
  { id: 4, admin: "Kwame Mensah", action: "Suspend User", detail: "Suspended Yaw Sarpong", date: "2024-06-25 09:20" },
  { id: 5, admin: "Ama Boateng", action: "Add Service", detail: "Added Insurance", date: "2024-06-25 09:30" },
];

const defaultRoles = [
  { name: "admin", permissions: ["dashboard", "users", "transactions", "services", "analytics", "audit", "roles", "support", "settings", "realtime"] },
  { name: "support", permissions: ["dashboard", "users", "transactions", "services", "support"] },
  { name: "user", permissions: ["dashboard"] },
];

const mockTickets = [
  { id: 1, user: "Ama Boateng", subject: "Can't pay bill", status: "Open", assigned: "Kwame Mensah", messages: [
    { from: "user", text: "I can't pay my electricity bill.", time: "2024-06-25 09:00" },
    { from: "admin", text: "Can you try again and send a screenshot?", time: "2024-06-25 09:05" },
  ] },
  { id: 2, user: "Yaw Sarpong", subject: "App not loading", status: "Pending", assigned: "Ama Boateng", messages: [
    { from: "user", text: "The app is stuck on loading.", time: "2024-06-24 18:00" },
  ] },
  { id: 3, user: "Kwame Mensah", subject: "Refund request", status: "Resolved", assigned: "Ama Boateng", messages: [
    { from: "user", text: "I need a refund for a failed transaction.", time: "2024-06-23 10:00" },
    { from: "admin", text: "Refund processed. Please check your account.", time: "2024-06-23 10:10" },
  ] },
];

const defaultSettings = {
  branding: { name: "Cave", logo: "", color: "#3B82F6" },
  contact: { email: "support@cave.com", phone: "+233 123 456 789", address: "Accra, Ghana" },
  payment: { gateway: "MockPay", apiKey: "", endpoint: "" },
  features: { support: true, analytics: true, audit: true },
};

const initialRealtimeStats = {
  transactions: 5230,
  usersOnline: 87,
  systemHealth: "Good",
};
const initialActivityFeed = [
  { type: "transaction", text: "New transaction: ₵100 paid for Electricity", time: "Just now" },
  { type: "login", text: "Admin Kwame Mensah logged in", time: "1 min ago" },
  { type: "support", text: "New support ticket from Ama Boateng", time: "3 min ago" },
];
const initialAlerts = [
  { type: "error", text: "Payment gateway timeout detected!", time: "2 min ago" },
  { type: "suspicious", text: "Suspicious login attempt from new device", time: "5 min ago" },
];

// Move serviceIcons definition above its first use
const serviceIcons: Record<string, string> = {
  "Electricity": "⚡",
  "Water": "💧",
  "Airtime": "📱",
  "Cable TV": "📺",
  "Internet": "🌐",
  "Data Bundles": "📶",
  "Education Fees": "🎓",
  "Tickets": "🎫",
  "Insurance": "🛡️",
};

export default function AdminPanel() {
  const { user, role, loading, signOut } = useAuth();
  const router = useRouter();

  // All hooks must be declared before any return
  const [section, setSection] = useState("dashboard");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", status: "Active", role: "user" });
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceSearch, setServiceSearch] = useState("");
  const [editService, setEditService] = useState<typeof mockServices[0] | null>(null);
  const [editServiceForm, setEditServiceForm] = useState({ name: "", category: "", status: "Active", price: 0, commission: 0, helpUrl: "" });
  const [showAddService, setShowAddService] = useState(false);
  const [addServiceForm, setAddServiceForm] = useState({ name: "", category: "", status: "Active", price: 0, commission: 0, helpUrl: "" });
  const [serviceError, setServiceError] = useState("");
  const [announcementTarget, setAnnouncementTarget] = useState("all");
  const [announcementSchedule, setAnnouncementSchedule] = useState("");
  const [announcements, setAnnouncements] = useState([
    { message: "Welcome to Cave!", date: "2024-06-01", target: "all", scheduled: "", delivered: 1200, read: 900 },
  ]);
  const [announcementMsg, setAnnouncementMsg] = useState("");
  const [announcementSuccess, setAnnouncementSuccess] = useState("");
  const [transactionFilters, setTransactionFilters] = useState({ user: "", service: "", date: "", status: "" });
  const [auditFilters, setAuditFilters] = useState({ admin: "", action: "", date: "" });
  const [roles, setRoles] = useState(defaultRoles);
  const [newRole, setNewRole] = useState({ name: "", permissions: [] as string[] });
  const [editRoleIdx, setEditRoleIdx] = useState<number | null>(null);
  const allPermissions = [
    { key: "dashboard", label: "Dashboard" },
    { key: "users", label: "User Management" },
    { key: "transactions", label: "Transaction Management" },
    { key: "services", label: "Service Management" },
    { key: "analytics", label: "Service Analytics" },
    { key: "audit", label: "Audit Logs" },
    { key: "roles", label: "Role Management" },
  ];
  // Determine current user's permissions (mocked: use role from context)
  const currentRole = role || "admin";
  const currentPermissions = roles.find(r => r.name === currentRole)?.permissions || [];

  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  const filteredTransactions = transactions.filter((t: any) =>
    (transactionFilters.user === "" || t.user.toLowerCase().includes(transactionFilters.user.toLowerCase())) &&
    (transactionFilters.service === "" || t.service === transactionFilters.service) &&
    (transactionFilters.date === "" || t.date === transactionFilters.date) &&
    (transactionFilters.status === "" || t.status === transactionFilters.status)
  );
  const filteredAuditLogs = mockAuditLogs.filter(l =>
    (auditFilters.admin === "" || l.admin.toLowerCase().includes(auditFilters.admin.toLowerCase())) &&
    (auditFilters.action === "" || l.action === auditFilters.action) &&
    (auditFilters.date === "" || l.date.startsWith(auditFilters.date))
  );

  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [ticketReply, setTicketReply] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [ticketAssign, setTicketAssign] = useState("");

  const [settings, setSettings] = useState(defaultSettings);
  const [settingsMsg, setSettingsMsg] = useState("");

  const [realtimeStats, setRealtimeStats] = useState(initialRealtimeStats);
  const [activityFeed, setActivityFeed] = useState(initialActivityFeed);
  const [alerts, setAlerts] = useState(initialAlerts);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [loadingBroadcast, setLoadingBroadcast] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/admin/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeStats(s => ({
        ...s,
        transactions: s.transactions + Math.floor(Math.random() * 5),
        usersOnline: Math.max(0, s.usersOnline + (Math.random() > 0.5 ? 1 : -1)),
        systemHealth: Math.random() > 0.98 ? "Degraded" : "Good",
      }));
      setActivityFeed(f => {
        const newItem = Math.random() > 0.7 ? { type: "transaction", text: `New transaction: ₵${Math.floor(Math.random()*200+10)} paid for ${["Water","Airtime","Internet"][Math.floor(Math.random()*3)]}`, time: "Just now" } : null;
        return (newItem ? [newItem, ...f] : f).slice(0, 10);
      });
      setAlerts(a => {
        const newErrors = [];
        if (Math.random() > 0.95) newErrors.push({ type: "error", text: "System error detected!", time: "Just now" });
        if (Math.random() > 0.97) newErrors.push({ type: "suspicious", text: "Suspicious activity detected!", time: "Just now" });
        return [...newErrors, ...a].slice(0, 5);
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "services"));
    const unsub = onSnapshot(q, (snapshot) => {
      setServices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoadingServices(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoadingUsers(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "transactions"));
    const unsub = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoadingTransactions(false);
    });
    return () => unsub();
  }, []);

  // Debug output
  console.log("user:", user, "role:", role);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  if (!user && !loading) {
    // Let useEffect handle the redirect, show nothing
    return null;
  }

  if (user && role !== "admin") {
    const handleLoginAgain = async () => {
      if (signOut) await signOut();
      router.replace('/admin/signin');
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow p-10 border border-red-200 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
          <button
            onClick={handleLoginAgain}
            className="px-6 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const handleEdit = (user: any) => {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, phone: user.phone, status: user.status, role: user.role });
  };
  const handleEditSave = async () => {
    if (!editUser) return;
    const ref = doc(db, "users", String(editUser.id));
    await updateDoc(ref, editForm);
    setEditUser(null);
  };
  const handleSuspendActivate = () => {
    setEditForm(f => ({ ...f, status: f.status === "Active" ? "Suspended" : "Active" }));
  };
  const handleRoleChange = (role: string) => {
    setEditForm(f => ({ ...f, role }));
  };
  const handleResetPassword = () => {
    alert(`Password reset email sent to ${editForm.email} (mock)`);
  };
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "users", String(id)));
  };

  const handleEditService = (service: typeof mockServices[0]) => {
    setEditService(service);
    setEditServiceForm({ name: service.name, category: service.category, status: service.status, price: service.price, commission: service.commission, helpUrl: service.helpUrl });
  };
  const handleEditServiceSave = async () => {
    if (!editService) return;
    const ref = doc(db, "services", String(editService.id));
    await updateDoc(ref, editServiceForm);
    setEditService(null);
  };
  const handleDeleteService = async (id: string) => {
    await deleteDoc(doc(db, "services", String(id)));
  };
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addServiceForm.name || !addServiceForm.category) return setServiceError("All fields are required.");
    await addDoc(collection(db, "services"), addServiceForm);
    setShowAddService(false);
    setAddServiceForm({ name: "", category: "", status: "Active", price: 0, commission: 0, helpUrl: "" });
    setServiceError("");
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementMsg.trim()) return;
    
    setLoadingBroadcast(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAnnouncement = {
        message: announcementMsg,
        date: new Date().toISOString().slice(0, 10),
        target: announcementTarget,
        scheduled: announcementSchedule || "",
        delivered: Math.floor(Math.random() * 1000) + 500,
        read: Math.floor(Math.random() * 800) + 200,
      };
      setAnnouncements([newAnnouncement, ...announcements]);
      setAnnouncementMsg("");
      setAnnouncementSuccess("Announcement sent successfully!");
      setTimeout(() => setAnnouncementSuccess(""), 3000);
    } catch (error) {
      console.error("Failed to send announcement:", error);
      setAnnouncementSuccess("Failed to send announcement. Please try again.");
    } finally {
      setLoadingBroadcast(false);
    }
  };

  function exportTransactionsToCSV() {
    const header = "ID,User,Service,Date,Amount,Status\n";
    const rows = filteredTransactions.map((t: any) => `${t.id},${t.user},${t.service},${t.date},${t.amount},${t.status}`).join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleRefund = async (id: string) => {
    await updateDoc(doc(db, "transactions", String(id)), { status: "Refunded" });
    alert(`Transaction ${id} refunded (mock)`);
  };
  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, "transactions", String(id)), { status: "Success" });
    alert(`Transaction ${id} approved (mock)`);
  };
  const handleFlag = async (id: string) => {
    await updateDoc(doc(db, "transactions", String(id)), { status: "Flagged" });
    alert(`Transaction ${id} flagged as suspicious (mock)`);
  };
  const handleDeleteTransaction = async (id: string) => {
    await deleteDoc(doc(db, "transactions", String(id)));
  };
  const handleAddTransaction = async (transaction: any) => {
    await addDoc(collection(db, "transactions"), transaction);
  };

  function getActionBadge(action: string) {
    switch (action) {
      case "Login": return <span className="inline-flex items-center px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-bold"><span className="mr-1">🔑</span>Login</span>;
      case "Edit Service": return <span className="inline-flex items-center px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-bold"><span className="mr-1">🛠️</span>Edit Service</span>;
      case "Send Announcement": return <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold"><span className="mr-1">📢</span>Announcement</span>;
      case "Suspend User": return <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold"><span className="mr-1">⛔</span>Suspend</span>;
      case "Add Service": return <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold"><span className="mr-1">➕</span>Add Service</span>;
      default: return <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold">{action}</span>;
    }
  }
  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  function formatDate(dateStr: string) {
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  const handleAddUser = async (user: any) => {
    await addDoc(collection(db, "users"), user);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16"/>
              </svg>
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Cave Admin</h1>
                <p className="text-xs text-gray-500">Administration Panel</p>
              </div>
            </div>
          </div>
          
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span>Welcome,</span>
              <span className="font-medium text-gray-900">{user?.email || 'Admin'}</span>
            </div>
            <button
              onClick={signOut}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed md:static z-40 top-0 left-0 h-full w-72 bg-white/90 backdrop-blur-md border-r border-gray-200/50 shadow-lg transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
          style={{ minHeight: 'calc(100vh - 64px)' }}
          aria-label="Sidebar"
        >
          <div className="p-6">
            {/* Close button for mobile */}
            <div className="flex items-center justify-between mb-8 md:hidden">
              <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
              <button
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Close sidebar"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {nav.filter(n => currentPermissions.includes(n.permission)).map((n, index) => (
                <button
                  key={n.key}
                  onClick={() => { setSection(n.key); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group
                    ${section === n.key 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-5 h-5 flex items-center justify-center rounded-lg transition-colors
                    ${section === n.key ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/>
                    </svg>
                  </div>
                  <span className="font-medium">{n.label}</span>
                  {section === n.key && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                <p>Current Role: <span className="font-medium text-gray-700 capitalize">{currentRole}</span></p>
                <p className="mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen">
          <div className="p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {section === "dashboard" && "Dashboard"}
                      {section === "users" && "User Management"}
                      {section === "transactions" && "Transaction Management"}
                      {section === "services" && "Service Management"}
                      {section === "analytics" && "Service Analytics"}
                      {section === "audit" && "Audit Logs"}
                      {section === "roles" && "Role Management"}
                      {section === "support" && "Support Tickets"}
                      {section === "realtime" && "Real-Time Monitoring"}
                      {section === "settings" && "Platform Settings"}
                    </h1>
                    <p className="text-gray-600">
                      {section === "dashboard" && "Overview of your platform's performance and key metrics"}
                      {section === "users" && "Manage user accounts, permissions, and profiles"}
                      {section === "transactions" && "Monitor and manage all platform transactions"}
                      {section === "services" && "Configure and manage available services"}
                      {section === "analytics" && "Detailed analytics and performance insights"}
                      {section === "audit" && "Track all administrative actions and changes"}
                      {section === "roles" && "Define and manage user roles and permissions"}
                      {section === "support" && "Handle customer support tickets and inquiries"}
                      {section === "realtime" && "Live monitoring of system activity and health"}
                      {section === "settings" && "Configure platform settings and preferences"}
                    </p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="hidden md:flex items-center gap-3">
                    <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 4v16m8-8H4"/>
                      </svg>
                      Quick Action
                    </button>
                    <button className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 5v14m7-7H5"/>
                      </svg>
                      New Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl">
                <div className="p-6 md:p-8">
                  {/* Section Content */}
                  {section === "dashboard" && (
                    <>
                      <h1 className="text-3xl font-bold text-green-700 mb-8 animate-fade-in">Admin Dashboard</h1>
                      
                      {/* Stats Cards with Loading Skeletons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        {loadingStats ? (
                          // Loading skeletons
                          Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-white/50 border-2 border-green-100 animate-pulse">
                              <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
                              <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                              <div className="w-16 h-6 bg-gray-200 rounded"></div>
                            </div>
                          ))
                        ) : (
                          stats.map((s, index) => (
                            <div 
                              key={s.label} 
                              className={`flex flex-col items-center p-6 rounded-2xl shadow-lg ${s.color} border-2 border-green-100 hover:scale-105 transition-all duration-300 cursor-pointer transform hover:shadow-xl`}
                              style={{ animationDelay: `${index * 100}ms` }}
                              role="button"
                              tabIndex={0}
                              aria-label={`${s.label}: ${s.value}`}
                              onKeyDown={(e) => e.key === 'Enter' && console.log(`Clicked ${s.label}`)}
                            >
                              <span className="text-4xl mb-2 animate-bounce">{s.icon}</span>
                              <span className="font-bold text-lg text-center">{s.label}</span>
                              <span className="text-2xl font-extrabold mt-2">{s.value}</span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Analytics Charts with Loading States */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow duration-300">
                          <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                            </svg>
                            User Growth
                          </h3>
                          {loadingCharts ? (
                            <div className="h-48 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                              <div className="text-gray-400">Loading chart...</div>
                            </div>
                          ) : (
                            <Line data={userGrowthData} options={{ plugins: { legend: { display: false } } }} height={200} />
                          )}
                        </div>
                        
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-shadow duration-300">
                          <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            Agent Performance
                          </h3>
                          {loadingCharts ? (
                            <div className="h-48 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                              <div className="text-gray-400">Loading chart...</div>
                            </div>
                          ) : (
                            <Bar data={agentPerformanceData} options={{ plugins: { legend: { display: false } } }} height={200} />
                          )}
                        </div>
                      </div>

                      {/* Transaction Trends */}
                      <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 mb-12 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                          </svg>
                          Transaction Trends (This Week)
                        </h3>
                        {loadingCharts ? (
                          <div className="h-48 bg-gray-100 rounded animate-pulse flex items-center justify-center">
                            <div className="text-gray-400">Loading chart...</div>
                          </div>
                        ) : (
                          <Line data={transactionTrendsData} options={{ plugins: { legend: { display: false } } }} height={200} />
                        )}
                      </div>

                      {/* Broadcast Announcements with Enhanced UX */}
                      <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100 mb-12 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                          </svg>
                          Broadcast Announcements
                        </h3>
                        <form className="flex flex-col gap-4 mb-6" onSubmit={handleBroadcast}>
                          <div className="relative">
                            <textarea
                              value={announcementMsg}
                              onChange={e => setAnnouncementMsg(e.target.value)}
                              placeholder="Type your announcement or promo message..."
                              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 resize-none"
                              rows={3}
                              aria-label="Announcement message"
                              required
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                              {announcementMsg.length}/500
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 items-center">
                            <select 
                              value={announcementTarget} 
                              onChange={e => setAnnouncementTarget(e.target.value)} 
                              className="px-4 py-2 rounded-lg border border-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                              aria-label="Target audience"
                            >
                              <option value="all">All Users</option>
                              <option value="user">Users</option>
                              <option value="admin">Admins</option>
                              <option value="support">Support</option>
                            </select>
                            
                            <input 
                              type="datetime-local" 
                              value={announcementSchedule} 
                              onChange={e => setAnnouncementSchedule(e.target.value)} 
                              className="px-4 py-2 rounded-lg border border-blue-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200" 
                              aria-label="Schedule announcement"
                            />
                            
                            <span className="text-xs text-gray-500">(Schedule is mock only)</span>
                          </div>
                          
                          <button 
                            type="submit" 
                            className="px-6 py-3 rounded-lg font-bold bg-green-600 text-white shadow hover:bg-green-700 transition-all duration-200 w-fit transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                            disabled={!announcementMsg.trim()}
                            aria-label="Send announcement"
                          >
                            {loadingBroadcast ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Broadcasting...
                              </div>
                            ) : (
                              'Broadcast'
                            )}
                          </button>
                          
                          {announcementSuccess && (
                            <div className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-lg p-3 animate-fade-in">
                              {announcementSuccess}
                            </div>
                          )}
                        </form>
                        
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                            Past Announcements
                          </h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                            {announcements.length === 0 ? (
                              <div className="text-gray-400 text-center py-4">No announcements yet.</div>
                            ) : (
                              announcements.map((a, i) => (
                                <div key={i} className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-gray-800 hover:bg-green-100 transition-colors duration-200">
                                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                    <span className="font-medium">{a.message}</span>
                                    <div className="flex flex-col text-xs text-gray-500 space-y-1">
                                      <span>{a.date}{a.scheduled && ` (Scheduled: ${a.scheduled})`}</span>
                                      <span>Target: {a.target}</span>
                                      <span className="text-blue-700">Delivered: {a.delivered} | Read: {a.read}</span>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-gray-600 text-center py-8">
                        <p className="text-lg">Select a section from the sidebar to manage users, transactions, or services.</p>
                        <p className="text-sm mt-2">All data is synchronized in real-time with your Firebase backend.</p>
                      </div>
                    </>
                  )}
                  {section === "users" && (
                    <div className="space-y-6">
                      {/* Header with Search and Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                          <p className="text-gray-600 mt-1">Manage user accounts, permissions, and profiles</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                            <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 5v14m7-7H5"/>
                            </svg>
                            Add User
                          </button>
                          <button className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400">
                            <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            Export
                          </button>
                        </div>
                      </div>

                      {/* Enhanced Search Bar */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                          </svg>
                        </div>
                        <input
                          type="text"
                          placeholder="Search users by name, email, or phone..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                        />
                        {search && (
                          <button
                            onClick={() => setSearch("")}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm opacity-90">Total Users</p>
                              <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm opacity-90">Active Users</p>
                              <p className="text-2xl font-bold">{users.filter(u => u.status === "Active").length}</p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm opacity-90">Suspended</p>
                              <p className="text-2xl font-bold">{users.filter(u => u.status === "Suspended").length}</p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm opacity-90">Admins</p>
                              <p className="text-2xl font-bold">{users.filter(u => u.role === "admin").length}</p>
                            </div>
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">User Management</h2>

                      {/* Enhanced Table */}
                      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {loadingUsers ? (
                          <div className="p-8 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                              <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </div>
                            <p className="text-gray-500">Loading users...</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((u: any) => (
                                  <tr key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                          {getInitials(u.name)}
                                        </div>
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                          <div className="text-sm text-gray-500">ID: {u.id}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">{u.email}</div>
                                      <div className="text-sm text-gray-500">{u.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        u.status === "Active" 
                                          ? "bg-green-100 text-green-800" 
                                          : "bg-red-100 text-red-800"
                                      }`}>
                                        <span className={`w-2 h-2 rounded-full mr-1.5 ${
                                          u.status === "Active" ? "bg-green-400" : "bg-red-400"
                                        }`}></span>
                                        {u.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        u.role === "admin" 
                                          ? "bg-purple-100 text-purple-800" 
                                          : u.role === "support"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}>
                                        {u.role}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                      <div className="flex items-center gap-2">
                                        <button 
                                          onClick={() => handleEdit(u)} 
                                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        >
                                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                          </svg>
                                          Edit
                                        </button>
                                        <button 
                                          onClick={() => handleDelete(u.id)} 
                                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                        >
                                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                          </svg>
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {/* Enhanced User Edit Modal */}
                      {editUser && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Edit User Profile</h3>
                                <button 
                                  onClick={() => setEditUser(null)} 
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                              {/* User Avatar and Basic Info */}
                              <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                  {getInitials(editForm.name)}
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900">{editForm.name}</h4>
                                  <p className="text-sm text-gray-500">User ID: {editUser.id}</p>
                                </div>
                              </div>

                              {/* Form Fields */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                  <input 
                                    name="name" 
                                    value={editForm.name} 
                                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter full name"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                  <input 
                                    name="email" 
                                    value={editForm.email} 
                                    onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter email address"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                  <input 
                                    name="phone" 
                                    value={editForm.phone} 
                                    onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter phone number"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                  <select 
                                    name="status" 
                                    value={editForm.status} 
                                    onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))} 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  >
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                  <select 
                                    name="role" 
                                    value={editForm.role} 
                                    onChange={e => handleRoleChange(e.target.value)} 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="support">Support</option>
                                  </select>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                <button 
                                  onClick={handleSuspendActivate} 
                                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    editForm.status === "Active" 
                                      ? "bg-red-500 hover:bg-red-600 text-white" 
                                      : "bg-green-500 hover:bg-green-600 text-white"
                                  }`}
                                >
                                  {editForm.status === "Active" ? "Suspend User" : "Activate User"}
                                </button>
                                <button 
                                  onClick={handleResetPassword} 
                                  className="px-4 py-2 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
                                >
                                  Reset Password
                                </button>
                                <button 
                                  onClick={handleEditSave} 
                                  className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                                >
                                  Save Changes
                                </button>
                                <button 
                                  onClick={() => handleDelete(editUser.id)} 
                                  className="px-4 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                                >
                                  Delete User
                                </button>
                              </div>

                              {/* User Activity Section */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-semibold text-gray-900 mb-3">User Activity</h5>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Last Login:</span>
                                    <span className="font-medium">{editUser.lastLogin}</span>
                                  </div>
                                  <div className="text-sm text-gray-600 mb-2">Recent Activity:</div>
                                  <ul className="space-y-1">
                                    {editUser.activity.map((a: string, i: number) => (
                                      <li key={i} className="text-sm text-gray-700 flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                        {a}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {section === "transactions" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Transaction Management</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <input type="text" placeholder="User" value={transactionFilters.user} onChange={e => setTransactionFilters(f => ({ ...f, user: e.target.value }))} className="px-2 py-1 rounded border border-blue-200 text-gray-900 placeholder-gray-500" />
                        <select value={transactionFilters.service} onChange={e => setTransactionFilters(f => ({ ...f, service: e.target.value }))} className="px-2 py-1 rounded border border-blue-200 text-gray-900">
                          <option value="">All Services</option>
                          {services.map((s: any) => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                        <input type="date" value={transactionFilters.date} onChange={e => setTransactionFilters(f => ({ ...f, date: e.target.value }))} className="px-2 py-1 rounded border border-blue-200 text-gray-900" />
                        <select value={transactionFilters.status} onChange={e => setTransactionFilters(f => ({ ...f, status: e.target.value }))} className="px-2 py-1 rounded border border-blue-200 text-gray-900">
                          <option value="">All Statuses</option>
                          <option value="Success">Success</option>
                          <option value="Pending">Pending</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                          <option value="Flagged">Flagged</option>
                        </select>
                        <button onClick={exportTransactionsToCSV} className="ml-auto px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition-all">Export CSV</button>
                      </div>
                      <div className="overflow-x-auto">
                        {loadingTransactions ? (
                          <div className="text-center text-gray-500 py-8">Loading transactions...</div>
                        ) : (
                        <table className="w-full text-left bg-white/80 rounded-xl shadow">
                          <thead>
                            <tr className="text-gray-700 font-semibold">
                              <th className="py-2 px-3">ID</th>
                              <th className="py-2 px-3">User</th>
                              <th className="py-2 px-3">Service</th>
                              <th className="py-2 px-3">Date</th>
                              <th className="py-2 px-3">Amount</th>
                              <th className="py-2 px-3">Status</th>
                              <th className="py-2 px-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredTransactions.map((t: any) => (
                              <tr key={t.id} className="border-t border-gray-200">
                                <td className="py-2 px-3">{t.id}</td>
                                <td className="py-2 px-3">{t.user}</td>
                                <td className="py-2 px-3">{t.service}</td>
                                <td className="py-2 px-3">{t.date}</td>
                                <td className="py-2 px-3">₵{t.amount}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === "Success" ? "bg-green-100 text-green-700" : t.status === "Pending" ? "bg-yellow-100 text-yellow-700" : t.status === "Refunded" ? "bg-blue-100 text-blue-700" : t.status === "Flagged" ? "bg-yellow-200 text-yellow-800" : "bg-red-100 text-red-700"}`}>{t.status}</span>
                                </td>
                                <td className="py-2 px-3 flex gap-2">
                                  <button onClick={() => handleRefund(t.id)} className="px-2 py-1 rounded bg-blue-500 text-white text-xs font-bold hover:bg-blue-700">Refund</button>
                                  <button onClick={() => handleApprove(t.id)} className="px-2 py-1 rounded bg-green-500 text-white text-xs font-bold hover:bg-green-700">Approve</button>
                                  <button onClick={() => handleFlag(t.id)} className="px-2 py-1 rounded bg-yellow-500 text-white text-xs font-bold hover:bg-yellow-600">Flag</button>
                                  <button onClick={() => handleDeleteTransaction(t.id)} className="px-2 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-700">Delete</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        )}
                      </div>
                    </div>
                  )}
                  {section === "services" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Service Management</h2>
                      <input
                        type="text"
                        placeholder="Search by name or category"
                        value={serviceSearch}
                        onChange={e => setServiceSearch(e.target.value)}
                        className="mb-4 px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] w-full max-w-md text-gray-900 placeholder-gray-500"
                      />
                      <div className="flex justify-end mb-4">
                        <button onClick={() => setShowAddService(true)} className="px-4 py-2 rounded-lg font-semibold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all">Add Service</button>
                      </div>
                      <div className="overflow-x-auto">
                        {loadingServices ? (
                          <div className="text-center text-gray-500 py-8">Loading services...</div>
                        ) : (
                        <table className="w-full text-left bg-white/80 rounded-xl shadow">
                          <thead>
                            <tr className="text-gray-700 font-semibold">
                              <th className="py-2 px-3">Icon</th>
                              <th className="py-2 px-3">Name</th>
                              <th className="py-2 px-3">Category</th>
                              <th className="py-2 px-3">Status</th>
                              <th className="py-2 px-3">Price</th>
                              <th className="py-2 px-3">Commission</th>
                              <th className="py-2 px-3">Help</th>
                              <th className="py-2 px-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredServices.map(s => (
                              <tr key={s.id} className="border-t border-gray-200">
                                <td className="py-2 px-3 text-2xl">{serviceIcons[s.name] || "🛠️"}</td>
                                <td className="py-2 px-3">{s.name}</td>
                                <td className="py-2 px-3">{s.category}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{s.status}</span>
                                  <button onClick={async () => await updateDoc(doc(db, "services", String(s.id)), { status: s.status === "Active" ? "Suspended" : "Active" })} className={`ml-2 px-2 py-1 rounded text-xs font-bold ${s.status === "Active" ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"} text-white transition-all`}>
                                    {s.status === "Active" ? "Suspend" : "Activate"}
                                  </button>
                                </td>
                                <td className="py-2 px-3">₵{s.price}</td>
                                <td className="py-2 px-3">₵{s.commission}</td>
                                <td className="py-2 px-3">
                                  <a href={s.helpUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Help</a>
                                </td>
                                <td className="py-2 px-3 flex gap-2">
                                  <button onClick={() => handleEditService(s)} className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-bold hover:bg-blue-700">Edit</button>
                                  <button onClick={() => handleDeleteService(s.id)} className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-700">Delete</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        )}
                      </div>
                      {editService && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                            <button onClick={() => setEditService(null)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
                            <h3 className="text-xl font-bold mb-4 text-[var(--color-primary)]">Edit Service</h3>
                            <div className="flex flex-col gap-4">
                              <input name="name" value={editServiceForm.name} onChange={e => setEditServiceForm(f => ({ ...f, name: e.target.value }))} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              <input name="category" value={editServiceForm.category} onChange={e => setEditServiceForm(f => ({ ...f, category: e.target.value }))} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              <select name="status" value={editServiceForm.status} onChange={e => setEditServiceForm(f => ({ ...f, status: e.target.value }))} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900">
                                <option>Active</option>
                                <option>Suspended</option>
                              </select>
                              <input name="price" type="number" value={editServiceForm.price} onChange={e => setEditServiceForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="Price" className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              <input name="commission" type="number" value={editServiceForm.commission} onChange={e => setEditServiceForm(f => ({ ...f, commission: Number(e.target.value) }))} placeholder="Commission" className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              <input name="helpUrl" value={editServiceForm.helpUrl} onChange={e => setEditServiceForm(f => ({ ...f, helpUrl: e.target.value }))} placeholder="Help URL" className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              <button onClick={handleEditServiceSave} className="px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all">Save</button>
                            </div>
                          </div>
                        </div>
                      )}
                      {showAddService && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                            <button onClick={() => setShowAddService(false)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
                            <h3 className="text-xl font-bold mb-4 text-[var(--color-primary)]">Add Service</h3>
                            <form className="flex flex-col gap-4" onSubmit={handleAddService}>
                              <input name="name" value={addServiceForm.name} onChange={e => setAddServiceForm(f => ({ ...f, name: e.target.value }))} placeholder="Service Name" className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              <input name="category" value={addServiceForm.category} onChange={e => setAddServiceForm(f => ({ ...f, category: e.target.value }))} placeholder="Category" className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              <select name="status" value={addServiceForm.status} onChange={e => setAddServiceForm(f => ({ ...f, status: e.target.value }))} className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900">
                                <option>Active</option>
                                <option>Suspended</option>
                              </select>
                              <input name="price" type="number" value={addServiceForm.price} onChange={e => setAddServiceForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="Price" className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              <input name="commission" type="number" value={addServiceForm.commission} onChange={e => setAddServiceForm(f => ({ ...f, commission: Number(e.target.value) }))} placeholder="Commission" className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              <input name="helpUrl" value={addServiceForm.helpUrl} onChange={e => setAddServiceForm(f => ({ ...f, helpUrl: e.target.value }))} placeholder="Help URL" className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500" />
                              {serviceError && <div className="text-red-500 text-sm text-center">{serviceError}</div>}
                              <button type="submit" className="px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all">Add</button>
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {section === "service-analytics" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Service Analytics</h2>
                      <div className="mb-8">
                        <table className="w-full text-left bg-white/80 rounded-xl shadow">
                          <thead>
                            <tr className="text-gray-700 font-semibold">
                              <th className="py-2 px-3">Service</th>
                              <th className="py-2 px-3">Transactions</th>
                              <th className="py-2 px-3">Revenue (₵)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {serviceAnalytics.map(s => (
                              <tr key={s.name} className="border-t border-gray-200">
                                <td className="py-2 px-3">{s.name}</td>
                                <td className="py-2 px-3">{s.transactions}</td>
                                <td className="py-2 px-3">₵{s.revenue.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-white rounded-2xl shadow p-6 border border-green-100">
                        <h3 className="text-lg font-bold text-green-700 mb-4">Transactions per Service</h3>
                        <Bar
                          data={{
                            labels: serviceAnalytics.map(s => s.name),
                            datasets: [
                              {
                                label: "Transactions",
                                data: serviceAnalytics.map(s => s.transactions),
                                backgroundColor: "#3B82F6",
                              },
                            ],
                          }}
                          options={{ plugins: { legend: { display: false } } }}
                          height={300}
                        />
                      </div>
                    </div>
                  )}
                  {section === "audit-logs" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Audit Logs</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <input type="text" placeholder="Admin" value={auditFilters.admin} onChange={e => setAuditFilters(f => ({ ...f, admin: e.target.value }))} className="px-2 py-1 rounded border border-blue-200 text-gray-900 placeholder-gray-500" />
                        <select value={auditFilters.action} onChange={e => setAuditFilters(f => ({ ...f, action: e.target.value }))} className="px-2 py-1 rounded border border-blue-200 text-gray-900">
                          <option value="">All Actions</option>
                          <option value="Login">Login</option>
                          <option value="Edit Service">Edit Service</option>
                          <option value="Send Announcement">Send Announcement</option>
                          <option value="Suspend User">Suspend User</option>
                          <option value="Add Service">Add Service</option>
                        </select>
                        <input type="date" value={auditFilters.date} onChange={e => setAuditFilters(f => ({ ...f, date: e.target.value }))} className="px-2 py-1 rounded border border-blue-200 text-gray-900" />
                        <button onClick={() => setAuditFilters({ admin: "", action: "", date: "" })} className="px-3 py-1 rounded bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300">Clear</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left bg-white/80 rounded-xl shadow">
                          <thead>
                            <tr className="text-gray-700 font-semibold">
                              <th className="py-2 px-3">Admin</th>
                              <th className="py-2 px-3">Action</th>
                              <th className="py-2 px-3">Detail</th>
                              <th className="py-2 px-3">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAuditLogs.length === 0 ? (
                              <tr><td colSpan={4} className="text-center text-gray-400 py-4">No logs found.</td></tr>
                            ) : filteredAuditLogs.map(l => (
                              <tr key={l.id} className="border-t border-gray-200 hover:bg-blue-50 transition-colors">
                                <td className="py-2 px-3 flex items-center gap-2">
                                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-bold">{getInitials(l.admin)}</span>
                                  <span>{l.admin}</span>
                                </td>
                                <td className="py-2 px-3">{getActionBadge(l.action)}</td>
                                <td className="py-2 px-3">{l.detail}</td>
                                <td className="py-2 px-3">{formatDate(l.date)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {section === "roles" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Role Management</h2>
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Create New Role</h3>
                        <input type="text" placeholder="Role name" value={newRole.name} onChange={e => setNewRole(r => ({ ...r, name: e.target.value }))} className="px-2 py-1 rounded border border-blue-200 text-gray-900 placeholder-gray-500 mr-2" />
                        <span className="font-semibold mr-2">Permissions:</span>
                        {allPermissions.map(p => (
                          <label key={p.key} className="mr-2">
                            <input type="checkbox" checked={newRole.permissions.includes(p.key)} onChange={e => setNewRole(r => ({ ...r, permissions: e.target.checked ? [...r.permissions, p.key] : r.permissions.filter(pk => pk !== p.key) }))} /> {p.label}
                          </label>
                        ))}
                        <button onClick={() => { if (newRole.name && newRole.permissions.length) { setRoles([...roles, { ...newRole, name: newRole.name.toLowerCase() }]); setNewRole({ name: "", permissions: [] }); } }} className="ml-2 px-3 py-1 rounded bg-green-600 text-white font-bold hover:bg-green-700">Add Role</button>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left bg-white/80 rounded-xl shadow">
                          <thead>
                            <tr className="text-gray-700 font-semibold">
                              <th className="py-2 px-3">Role</th>
                              <th className="py-2 px-3">Permissions</th>
                              <th className="py-2 px-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {roles.map((r, idx) => (
                              <tr key={r.name} className="border-t border-gray-200">
                                <td className="py-2 px-3 font-bold capitalize">{r.name}</td>
                                <td className="py-2 px-3">
                                  {r.permissions.map(pk => allPermissions.find(p => p.key === pk)?.label).join(", ")}
                                </td>
                                <td className="py-2 px-3 flex gap-2">
                                  <button onClick={() => setEditRoleIdx(idx)} className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-bold hover:bg-blue-700">Edit</button>
                                  <button onClick={() => setRoles(roles.filter((_, i) => i !== idx))} className="px-3 py-1 rounded bg-red-500 text-white text-xs font-bold hover:bg-red-700">Delete</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {editRoleIdx !== null && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                            <button onClick={() => setEditRoleIdx(null)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
                            <h3 className="text-xl font-bold mb-4 text-[var(--color-primary)]">Edit Role</h3>
                            <div className="flex flex-col gap-4">
                              <input type="text" value={roles[editRoleIdx].name} disabled className="px-4 py-3 rounded-lg bg-gray-100 border border-blue-200 text-gray-900 font-bold" />
                              <div className="flex flex-wrap gap-2">
                                {allPermissions.map(p => (
                                  <label key={p.key} className="mr-2">
                                    <input type="checkbox" checked={roles[editRoleIdx].permissions.includes(p.key)} onChange={e => setRoles(rs => rs.map((r, i) => i === editRoleIdx ? { ...r, permissions: e.target.checked ? [...r.permissions, p.key] : r.permissions.filter(pk => pk !== p.key) } : r))} /> {p.label}
                                  </label>
                                ))}
                              </div>
                              <button onClick={() => setEditRoleIdx(null)} className="px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all">Save</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {section === "support" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Support Tickets</h2>
                      <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left bg-white/80 rounded-xl shadow">
                          <thead>
                            <tr className="text-gray-700 font-semibold">
                              <th className="py-2 px-3">User</th>
                              <th className="py-2 px-3">Subject</th>
                              <th className="py-2 px-3">Status</th>
                              <th className="py-2 px-3">Assigned</th>
                              <th className="py-2 px-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tickets.map(t => (
                              <tr key={t.id} className="border-t border-gray-200">
                                <td className="py-2 px-3">{t.user}</td>
                                <td className="py-2 px-3">{t.subject}</td>
                                <td className="py-2 px-3">
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.status === "Open" ? "bg-green-100 text-green-700" : t.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"}`}>{t.status}</span>
                                </td>
                                <td className="py-2 px-3">{t.assigned}</td>
                                <td className="py-2 px-3">
                                  <button onClick={() => { setSelectedTicket(t); setTicketStatus(t.status); setTicketAssign(t.assigned); }} className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-bold hover:bg-blue-700">View</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {selectedTicket && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
                            <button onClick={() => setSelectedTicket(null)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
                            <h3 className="text-xl font-bold mb-2 text-[var(--color-primary)]">Ticket: {selectedTicket.subject}</h3>
                            <div className="mb-2 text-sm text-gray-600">From: {selectedTicket.user}</div>
                            <div className="mb-4 text-sm text-gray-600">Assigned: {ticketAssign}</div>
                            <div className="mb-4 text-sm text-gray-600">Status: {ticketStatus}</div>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                              {selectedTicket.messages.map((m, i) => (
                                <div key={i} className={`mb-2 flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}>
                                  <div className={`px-3 py-2 rounded-lg ${m.from === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-800"} max-w-xs`}>{m.text}
                                    <div className="text-xs text-gray-400 mt-1">{formatDate(m.time)}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <form onSubmit={e => { e.preventDefault(); if (ticketReply.trim()) { setTickets(ts => ts.map(t => t.id === selectedTicket.id ? { ...t, messages: [...t.messages, { from: "admin", text: ticketReply, time: new Date().toISOString().slice(0, 16).replace('T', ' ') }] } : t)); setTicketReply(""); } }} className="flex gap-2 mb-4">
                              <input value={ticketReply} onChange={e => setTicketReply(e.target.value)} placeholder="Type a reply..." className="flex-1 px-3 py-2 rounded-lg border border-blue-200 text-gray-900" />
                              <button type="submit" className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700">Send</button>
                            </form>
                            <div className="flex gap-2 mb-2">
                              <select value={ticketStatus} onChange={e => { setTicketStatus(e.target.value); setTickets(ts => ts.map(t => t.id === selectedTicket.id ? { ...t, status: e.target.value } : t)); }} className="px-2 py-1 rounded border border-blue-200 text-gray-900">
                                <option>Open</option>
                                <option>Pending</option>
                                <option>Resolved</option>
                              </select>
                              <select value={ticketAssign} onChange={e => { setTicketAssign(e.target.value); setTickets(ts => ts.map(t => t.id === selectedTicket.id ? { ...t, assigned: e.target.value } : t)); }} className="px-2 py-1 rounded border border-blue-200 text-gray-900">
                                {users.filter((u: any) => u.role === "admin" || u.role === "support").map((u: any) => <option key={u.name} value={u.name}>{u.name}</option>)}
                              </select>
                              <button onClick={() => setSelectedTicket(null)} className="px-3 py-1 rounded bg-gray-400 text-white text-xs font-bold hover:bg-gray-600">Close</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {section === "realtime" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Real-Time Monitoring</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col items-center">
                          <span className="text-4xl mb-2">💸</span>
                          <span className="font-bold text-lg">Transactions</span>
                          <span className="text-2xl font-extrabold mt-2">{realtimeStats.transactions.toLocaleString()}</span>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col items-center">
                          <span className="text-4xl mb-2">🟢</span>
                          <span className="font-bold text-lg">Users Online</span>
                          <span className="text-2xl font-extrabold mt-2">{realtimeStats.usersOnline}</span>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100 flex flex-col items-center">
                          <span className="text-4xl mb-2">{realtimeStats.systemHealth === "Good" ? "✅" : "⚠️"}</span>
                          <span className="font-bold text-lg">System Health</span>
                          <span className={`text-2xl font-extrabold mt-2 ${realtimeStats.systemHealth === "Good" ? "text-green-600" : "text-red-600"}`}>{realtimeStats.systemHealth}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100">
                          <h3 className="text-lg font-bold text-blue-700 mb-4">Live Activity Feed</h3>
                          <ul className="space-y-2 max-h-64 overflow-y-auto">
                            {activityFeed.map((a, i) => (
                              <li key={i} className="flex items-center gap-2 text-gray-800">
                                <span className="text-xl">{a.type === "transaction" ? "💸" : a.type === "login" ? "🔑" : "🛟"}</span>
                                <span>{a.text}</span>
                                <span className="text-xs text-gray-400 ml-auto">{a.time}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white rounded-2xl shadow p-6 border border-blue-100">
                          <h3 className="text-lg font-bold text-red-700 mb-4">Alerts</h3>
                          <ul className="space-y-2 max-h-64 overflow-y-auto">
                            {alerts.map((a, i) => (
                              <li key={i} className={`flex items-center gap-2 ${a.type === "error" ? "text-red-700" : "text-yellow-700"}`}>
                                <span className="text-xl">{a.type === "error" ? "❌" : "⚠️"}</span>
                                <span>{a.text}</span>
                                <span className="text-xs text-gray-400 ml-auto">{a.time}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  {section === "settings" && (
                    <div>
                      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">Platform Settings</h2>
                      <form className="flex flex-col gap-6 max-w-2xl" onSubmit={e => { e.preventDefault(); setSettingsMsg("Settings saved! (Mock)"); setTimeout(() => setSettingsMsg(""), 2000); }}>
                        <div>
                          <h3 className="font-semibold mb-2">Branding</h3>
                          <input type="text" value={settings.branding.name} onChange={e => setSettings(s => ({ ...s, branding: { ...s.branding, name: e.target.value } }))} placeholder="Platform Name" className="px-3 py-2 rounded border border-blue-200 text-gray-900 mr-2" />
                          <input type="text" value={settings.branding.logo} onChange={e => setSettings(s => ({ ...s, branding: { ...s.branding, logo: e.target.value } }))} placeholder="Logo URL" className="px-3 py-2 rounded border border-blue-200 text-gray-900 mr-2" />
                          <input type="color" value={settings.branding.color} onChange={e => setSettings(s => ({ ...s, branding: { ...s.branding, color: e.target.value } }))} className="w-10 h-10 align-middle" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Contact Info</h3>
                          <input type="email" value={settings.contact.email} onChange={e => setSettings(s => ({ ...s, contact: { ...s.contact, email: e.target.value } }))} placeholder="Support Email" className="px-3 py-2 rounded border border-blue-200 text-gray-900 mr-2" />
                          <input type="text" value={settings.contact.phone} onChange={e => setSettings(s => ({ ...s, contact: { ...s.contact, phone: e.target.value } }))} placeholder="Phone" className="px-3 py-2 rounded border border-blue-200 text-gray-900 mr-2" />
                          <input type="text" value={settings.contact.address} onChange={e => setSettings(s => ({ ...s, contact: { ...s.contact, address: e.target.value } }))} placeholder="Address" className="px-3 py-2 rounded border border-blue-200 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Payment Gateway</h3>
                          <input type="text" value={settings.payment.gateway} onChange={e => setSettings(s => ({ ...s, payment: { ...s.payment, gateway: e.target.value } }))} placeholder="Gateway Name" className="px-3 py-2 rounded border border-blue-200 text-gray-900 mr-2" />
                          <input type="text" value={settings.payment.apiKey} onChange={e => setSettings(s => ({ ...s, payment: { ...s.payment, apiKey: e.target.value } }))} placeholder="API Key" className="px-3 py-2 rounded border border-blue-200 text-gray-900 mr-2" />
                          <input type="text" value={settings.payment.endpoint} onChange={e => setSettings(s => ({ ...s, payment: { ...s.payment, endpoint: e.target.value } }))} placeholder="API Endpoint" className="px-3 py-2 rounded border border-blue-200 text-gray-900" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Features</h3>
                          <label className="mr-4"><input type="checkbox" checked={settings.features.support} onChange={e => setSettings(s => ({ ...s, features: { ...s.features, support: e.target.checked } }))} /> Support</label>
                          <label className="mr-4"><input type="checkbox" checked={settings.features.analytics} onChange={e => setSettings(s => ({ ...s, features: { ...s.features, analytics: e.target.checked } }))} /> Analytics</label>
                          <label className="mr-4"><input type="checkbox" checked={settings.features.audit} onChange={e => setSettings(s => ({ ...s, features: { ...s.features, audit: e.target.checked } }))} /> Audit Logs</label>
                        </div>
                        <button type="submit" className="px-6 py-3 rounded-lg font-bold bg-[var(--color-primary)] text-white shadow hover:bg-blue-700 transition-all w-fit">Save Settings</button>
                        {settingsMsg && <div className="text-green-600 text-sm text-center">{settingsMsg}</div>}
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}