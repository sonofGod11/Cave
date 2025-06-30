"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";

const mockUser = {
  name: "Ama Boateng",
  email: "ama@example.com",
};

const services = [
  { name: "Electricity", color: "bg-yellow-300", icon: "⚡" },
  { name: "Water", color: "bg-blue-300", icon: "💧" },
  { name: "Internet", color: "bg-indigo-300", icon: "🌐" },
  { name: "Airtime", color: "bg-green-300", icon: "📱" },
  { name: "Data Bundles", color: "bg-pink-300", icon: "📶" },
  { name: "Education", color: "bg-orange-300", icon: "🎓" },
  { name: "Cable TV", color: "bg-purple-300", icon: "📺" },
  { name: "Tickets", color: "bg-red-300", icon: "🎫" },
  { name: "Plane Ticket Booking", color: "bg-sky-300", icon: "✈️" },
  { name: "Insurance", color: "bg-amber-300", icon: "🛡️" },
];

const initialNotifications = [
  { id: 1, message: "Your electricity bill payment was successful.", date: "2024-06-25", type: "success", read: false },
  { id: 2, message: "Airtime top-up completed.", date: "2024-06-24", type: "success", read: false },
  { id: 3, message: "Failed payment for water bill.", date: "2024-06-23", type: "error", read: false },
  { id: 4, message: "Promo: Get 10% off your next payment!", date: "2024-06-22", type: "promo", read: false },
];

const mockTransactions = [
  { id: "TXN12345678", service: "Electricity", amount: 150.00, status: "success", date: "2024-06-25", time: "14:30", provider: "ECG" },
  { id: "TXN12345677", service: "Airtime", amount: 20.00, status: "success", date: "2024-06-24", time: "09:15", provider: "MTN" },
  { id: "TXN12345676", service: "Water", amount: 85.50, status: "failed", date: "2024-06-23", time: "16:45", provider: "GWCL" },
  { id: "TXN12345675", service: "Data Bundles", amount: 50.00, status: "success", date: "2024-06-22", time: "11:20", provider: "AirtelTigo" },
  { id: "TXN12345674", service: "Cable TV", amount: 200.00, status: "success", date: "2024-06-21", time: "13:10", provider: "DStv" },
];

const referralCode = "CAVE1234";
const referredFriends = [
  { name: "Kwame Mensah", reward: "₵5.00" },
  { name: "Ama Sarpong", reward: "₵5.00" },
];

function BillModal({ service, onClose, onTransactionSuccess, user }: { 
  service: typeof services[0] | null, 
  onClose: () => void,
  onTransactionSuccess: (service: string, amount: number, status: 'success' | 'failed', provider?: string) => void,
  user: any
}) {
  if (!service) return null;
  // All hooks must be declared at the top level, unconditionally
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [customer, setCustomer] = useState("");
  const [method, setMethod] = useState("Mobile Money");
  const [network, setNetwork] = useState("MTN");
  const [educationService, setEducationService] = useState("School Fees");
  const [institution, setInstitution] = useState("");
  const [cableProvider, setCableProvider] = useState("");
  const [dstvPackage, setDstvPackage] = useState("");
  const [ticketEvent, setTicketEvent] = useState("");
  const [airline, setAirline] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyHolder, setPolicyHolder] = useState("");
  const [insurancePhone, setInsurancePhone] = useState("");
  const [coverageAmount, setCoverageAmount] = useState("");
  const [policyDuration, setPolicyDuration] = useState("1 Year");
  const [step, setStep] = useState<'form' | 'confirm' | 'processing' | 'success' | 'error'>('form');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  
  // Enhanced payment method states
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountName, setAccountName] = useState("");
  const airportOptions = [
    "Accra (ACC)",
    "Kumasi (KMS)",
    "Tamale (TML)",
    "Takoradi (TKD)",
    "Sunyani (NYI)",
    "London (LHR)",
    "Dubai (DXB)",
    "Amsterdam (AMS)",
    "Istanbul (IST)",
    "New York (JFK)",
    "Other"
  ];

  const ghanaTertiaryInstitutions = [
    "University of Ghana",
    "KNUST",
    "University of Cape Coast (UCC)",
    "University of Education, Winneba (UEW)",
    "University of Professional Studies, Accra (UPSA)",
    "University for Development Studies (UDS)",
    "Ashesi University",
    "Central University",
    "GIMPA",
    "Valley View University",
    "University of Mines and Technology (UMaT)",
    "Accra Technical University",
    "Koforidua Technical University",
    "Ho Technical University",
    "Takoradi Technical University",
    "Other"
  ];

  const cableProviders = [
    "DStv",
    "GOtv",
    "StarTimes",
    "Other"
  ];

  const dstvPackages = [
    "Access",
    "Family",
    "Compact",
    "Compact Plus",
    "Premium",
    "Asia",
    "Yanga",
    "Padi",
    "Confam",
    "Other"
  ];

  const ghanaEvents = [
    "Afrochella",
    "Chalewote Festival",
    "VGMA",
    "Ghana Party in the Park",
    "December in GH",
    "Accra Fashion Week",
    "Other"
  ];

  const airlines = [
    "Africa World Airlines",
    "PassionAir",
    "Emirates",
    "KLM",
    "British Airways",
    "Qatar Airways",
    "Turkish Airlines",
    "Other"
  ];

  const insuranceTypes = [
    "Health Insurance",
    "Auto Insurance", 
    "Life Insurance",
    "Property Insurance",
    "Travel Insurance"
  ];

  const insuranceProviders = [
    "SIC Insurance",
    "Vanguard Assurance",
    "Enterprise Insurance",
    "Star Assurance",
    "Allianz Insurance",
    "Prudential Insurance",
    "Other"
  ];

  const policyDurations = [
    "1 Month",
    "3 Months", 
    "6 Months",
    "1 Year",
    "2 Years",
    "5 Years"
  ];

  const paymentMethods = [
    { id: "mobile_money", name: "Mobile Money", icon: "📱", description: "Pay with MTN, Vodafone, or AirtelTigo" },
    { id: "card", name: "Credit/Debit Card", icon: "💳", description: "Visa, Mastercard, or local cards" },
    { id: "bank", name: "Bank Transfer", icon: "🏦", description: "Direct bank transfer" },
    { id: "crypto", name: "Crypto", icon: "🪙", description: "Pay with Bitcoin, Ethereum, USDT, XRP, and more (Demo)" },
  ];

  const mobileMoneyProviders = [
    { id: "mtn", name: "MTN Mobile Money", icon: "🟡", number: "024, 054, 055, 059" },
    { id: "vodafone", name: "Vodafone Cash", icon: "🔴", number: "050, 020" },
    { id: "airteltigo", name: "AirtelTigo Money", icon: "🔵", number: "027, 057, 026, 056" }
  ];

  const banks = [
    { code: "001", name: "Ghana Commercial Bank (GCB)" },
    { code: "002", name: "Agricultural Development Bank (ADB)" },
    { code: "003", name: "National Investment Bank (NIB)" },
    { code: "004", name: "Bank of Ghana (BOG)" },
    { code: "005", name: "Standard Chartered Bank Ghana" },
    { code: "006", name: "Barclays Bank Ghana" },
    { code: "007", name: "Ecobank Ghana" },
    { code: "008", name: "Zenith Bank Ghana" },
    { code: "009", name: "United Bank for Africa (UBA)" },
    { code: "010", name: "Fidelity Bank Ghana" }
  ];

  // Crypto payment state
  const [cryptoCoin, setCryptoCoin] = useState("BTC");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [cryptoStatus, setCryptoStatus] = useState<'pending'|'confirmed'>('pending');
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const cryptoCoins = [
    { symbol: "BTC", name: "Bitcoin", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", qr: "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
    { symbol: "ETH", name: "Ethereum", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", qr: "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=ethereum:0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
    { symbol: "USDT", name: "Tether (ERC20)", address: "0xdac17f958d2ee523a2206206994597c13d831ec7", qr: "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=ethereum:0xdac17f958d2ee523a2206206994597c13d831ec7" },
    { symbol: "XRP", name: "Ripple", address: "rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv", qr: "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=ripple:rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv" },
    { symbol: "DOGE", name: "Dogecoin", address: "D8B2vF7Qw2v7Qw2v7Qw2v7Qw2v7Qw2v7Qw", qr: "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=dogecoin:D8B2vF7Qw2v7Qw2v7Qw2v7Qw2v7Qw2v7Qw" },
  ];

  // Fetch real-time conversion
  useEffect(() => {
    if (method === "Crypto" && amount && cryptoCoin) {
      setCryptoLoading(true);
      fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoCoin.toLowerCase()}&vs_currencies=ghs`)
        .then(res => res.json())
        .then(data => {
          const price = data[cryptoCoin.toLowerCase()]?.ghs;
          if (price) {
            setCryptoAmount((parseFloat(amount) / price).toFixed(8));
            const coin = cryptoCoins.find(c => c.symbol === cryptoCoin);
            setCryptoAddress(coin ? coin.address : "");
          }
        })
        .finally(() => setCryptoLoading(false));
    }
  }, [method, amount, cryptoCoin]);

  // Auto-calculate ticket price for Plane Ticket Booking
  useEffect(() => {
    if (service && service.name === 'Plane Ticket Booking') {
      const ghanaAirports = [
        "Accra (ACC)",
        "Kumasi (KMS)",
        "Tamale (TML)",
        "Takoradi (TKD)",
        "Sunyani (NYI)"
      ];
      if (
        airline && departure && destination && travelDate &&
        departure !== destination &&
        departure !== '' && destination !== '' &&
        departure !== 'Other' && destination !== 'Other'
      ) {
        // Local flights
        if (ghanaAirports.includes(departure) && ghanaAirports.includes(destination)) {
          // Accra ↔ Kumasi, Tamale, Takoradi, Sunyani
          if (
            (departure === "Accra (ACC)" && ["Kumasi (KMS)", "Tamale (TML)", "Takoradi (TKD)", "Sunyani (NYI)"].includes(destination)) ||
            (destination === "Accra (ACC)" && ["Kumasi (KMS)", "Tamale (TML)", "Takoradi (TKD)", "Sunyani (NYI)"].includes(departure))
          ) {
            setAmount("600");
          }
          // Kumasi ↔ Tamale, Takoradi, Sunyani
          else if (
            (departure === "Kumasi (KMS)" && ["Tamale (TML)", "Takoradi (TKD)", "Sunyani (NYI)"].includes(destination)) ||
            (destination === "Kumasi (KMS)" && ["Tamale (TML)", "Takoradi (TKD)", "Sunyani (NYI)"].includes(departure))
          ) {
            setAmount("700");
          }
          // Any other Ghana-to-Ghana
          else {
            setAmount("800");
          }
        } else {
          // International flights
          // Accra ↔ London
          if (
            (departure === "Accra (ACC)" && destination === "London (LHR)") ||
            (destination === "Accra (ACC)" && departure === "London (LHR)")
          ) {
            setAmount("4000");
          }
          // Accra ↔ Dubai
          else if (
            (departure === "Accra (ACC)" && destination === "Dubai (DXB)") ||
            (destination === "Accra (ACC)" && departure === "Dubai (DXB)")
          ) {
            setAmount("3800");
          }
          // Accra ↔ Amsterdam
          else if (
            (departure === "Accra (ACC)" && destination === "Amsterdam (AMS)") ||
            (destination === "Accra (ACC)" && departure === "Amsterdam (AMS)")
          ) {
            setAmount("3700");
          }
          // Accra ↔ Istanbul
          else if (
            (departure === "Accra (ACC)" && destination === "Istanbul (IST)") ||
            (destination === "Accra (ACC)" && departure === "Istanbul (IST)")
          ) {
            setAmount("3600");
          }
          // Accra ↔ New York
          else if (
            (departure === "Accra (ACC)" && destination === "New York (JFK)") ||
            (destination === "Accra (ACC)" && departure === "New York (JFK)")
          ) {
            setAmount("5000");
          }
          // Any other international
          else {
            setAmount("3500");
          }
        }
      } else if (departure === 'Other' || destination === 'Other') {
        setAmount("");
      }
    }
  }, [airline, departure, destination, travelDate, service]);

  // Auto-calculate insurance premium
  useEffect(() => {
    if (service && service.name === 'Insurance') {
      if (insuranceType && coverageAmount && policyDuration) {
        const coverage = parseFloat(coverageAmount);
        if (!isNaN(coverage) && coverage > 0) {
          let baseRate = 0;
          let durationMultiplier = 1;
          
          // Base rates by insurance type
          switch (insuranceType) {
            case "Health Insurance":
              baseRate = 0.05; // 5% of coverage
              break;
            case "Auto Insurance":
              baseRate = 0.08; // 8% of coverage
              break;
            case "Life Insurance":
              baseRate = 0.03; // 3% of coverage
              break;
            case "Property Insurance":
              baseRate = 0.06; // 6% of coverage
              break;
            case "Travel Insurance":
              baseRate = 0.04; // 4% of coverage
              break;
            default:
              baseRate = 0.05;
          }
          
          // Duration multipliers
          switch (policyDuration) {
            case "1 Month":
              durationMultiplier = 0.1;
              break;
            case "3 Months":
              durationMultiplier = 0.25;
              break;
            case "6 Months":
              durationMultiplier = 0.5;
              break;
            case "1 Year":
              durationMultiplier = 1;
              break;
            case "2 Years":
              durationMultiplier = 1.8;
              break;
            case "5 Years":
              durationMultiplier = 4;
              break;
            default:
              durationMultiplier = 1;
          }
          
          const premium = Math.round(coverage * baseRate * durationMultiplier);
          setAmount(premium.toString());
        }
      }
    }
  }, [insuranceType, coverageAmount, policyDuration, service]);

  // Validation functions
  const validateMobileMoney = () => {
    if (!mobileMoneyNumber) return "Mobile money number is required";
    if (!/^0[2-5][0-9]{8}$/.test(mobileMoneyNumber)) return "Please enter a valid Ghanaian mobile number";
    return null;
  };

  const validateCard = () => {
    if (!cardNumber) return "Card number is required";
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) return "Please enter a valid 16-digit card number";
    if (!cardExpiry) return "Card expiry date is required";
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) return "Please enter expiry date in MM/YY format";
    if (!validateExpiry(cardExpiry)) return "Card has expired or invalid expiry date";
    if (!cardCVV) return "CVV is required";
    if (!/^\d{3,4}$/.test(cardCVV)) return "Please enter a valid CVV";
    if (!cardHolderName) return "Card holder name is required";
    return null;
  };

  const validateBankTransfer = () => {
    if (!bankAccount) return "Account number is required";
    if (!/^\d{10,12}$/.test(bankAccount)) return "Please enter a valid account number";
    if (!bankCode) return "Please select a bank";
    if (!accountName) return "Account holder name is required";
    return null;
  };

  // Helper functions for input formatting
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s/g, '').replace(/\D/g, '');
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

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s/g, '').replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateExpiry = (expiry: string) => {
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/');
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    return expDate > now;
  };

  // Helper: get security settings from localStorage
  function getSecuritySettings() {
    try {
      return JSON.parse(localStorage.getItem('cave_security_settings') || '{}');
    } catch {
      return {};
    }
  }
  // Helper: get today's total payments from localStorage
  function getTodaysTotalPayments() {
    const today = new Date().toISOString().slice(0, 10);
    const txns = JSON.parse(localStorage.getItem('cave_payments') || '[]');
    return txns.filter((t: any) => t.date === today).reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
  }
  // Helper: save payment to localStorage for daily tracking
  function savePaymentForLimit(amount: number) {
    const today = new Date().toISOString().slice(0, 10);
    const txns = JSON.parse(localStorage.getItem('cave_payments') || '[]');
    txns.push({ date: today, amount });
    localStorage.setItem('cave_payments', JSON.stringify(txns));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!amount || !account || customer === undefined || (service.name === 'Airtime' && !network) || (service.name === 'Data Bundles' && !network) || (service.name === 'Education' && !educationService) || (service.name === 'Education' && educationService === 'School Fees' && !institution) || (service.name === 'Cable TV' && !cableProvider) || (service.name === 'Cable TV' && cableProvider === 'DStv' && !dstvPackage) || (service.name === 'Tickets' && !ticketEvent) || (service.name === 'Plane Ticket Booking' && (!airline || !passengerName || !departure || !destination || !travelDate || !amount)) || (service.name === 'Insurance' && (!insuranceType || !insuranceProvider || !policyHolder || !insurancePhone || !coverageAmount || !policyDuration || !amount))) {
      return setError("All fields are required.");
    }
    
    if (Number(amount) < 1) return setError("Amount must be at least 1 GHS.");
    
    // --- Transaction Limit Checks ---
    const sec = getSecuritySettings();
    const amt = parseFloat(amount);
    if (sec.perTransactionLimit && amt > sec.perTransactionLimit) {
      return setError(`Per-transaction limit exceeded (max: GHS ${sec.perTransactionLimit})`);
    }
    if (sec.dailyLimit) {
      const todaysTotal = getTodaysTotalPayments();
      if (amt + todaysTotal > sec.dailyLimit) {
        return setError(`Daily limit exceeded (max: GHS ${sec.dailyLimit}, used: GHS ${todaysTotal})`);
      }
    }
    // --- End Transaction Limit Checks ---
    
    // Payment method specific validation
    let paymentValidationError = null;
    if (method === "Mobile Money") {
      paymentValidationError = validateMobileMoney();
    } else if (method === "Card") {
      paymentValidationError = validateCard();
    } else if (method === "Bank") {
      paymentValidationError = validateBankTransfer();
    }
    
    if (paymentValidationError) {
      return setError(paymentValidationError);
    }
    
    setStep('confirm');
  };
  const handleConfirm = async () => {
    setIsLoading(true);
    setPaymentError("");
    setStep('processing');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random success/failure for demo
      const isSuccess = Math.random() > 0.2; // 80% success rate
      
      if (isSuccess) {
        const mockTransactionId = 'TXN' + Date.now().toString().slice(-8);
        setTransactionId(mockTransactionId);
        setStep('success');
        setSuccess('Payment successful!');
        onTransactionSuccess(service.name, Number(amount), "success", service.name === 'Plane Ticket Booking' ? airline : undefined);
        // Save payment for daily limit tracking
        savePaymentForLimit(Number(amount));
      } else {
        setPaymentError('Payment failed. Please try again or contact support.');
        setStep('error');
      }
    } catch (err) {
      setPaymentError('Network error. Please check your connection and try again.');
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    setAmount(""); 
    setAccount(""); 
    setCustomer(""); 
    setMethod("Mobile Money"); 
    setNetwork("MTN"); 
    setEducationService("School Fees"); 
    setInstitution(""); 
    setCableProvider(""); 
    setDstvPackage(""); 
    setTicketEvent(""); 
    setAirline(""); 
    setPassengerName(""); 
    setDeparture(""); 
    setDestination(""); 
    setTravelDate(""); 
    setInsuranceType(""); 
    setInsuranceProvider(""); 
    setPolicyHolder(""); 
    setInsurancePhone(""); 
    setCoverageAmount(""); 
    setPolicyDuration("1 Year"); 
    setStep('form'); 
    setError(""); 
    setSuccess(""); 
    setIsLoading(false); 
    setPaymentError(""); 
    setTransactionId("");
    // Reset payment method states
    setMobileMoneyNumber("");
    setCardNumber("");
    setCardExpiry("");
    setCardCVV("");
    setCardHolderName("");
    setBankAccount("");
    setBankCode("");
    setAccountName("");
    onClose();
  };

  const handleRetry = () => {
    setStep('confirm');
    setPaymentError("");
  };

  // Color and gradient for header based on service
  const headerGradient = service.name === 'Electricity'
    ? 'bg-gradient-to-r from-yellow-300 to-yellow-400'
    : service.name === 'Water'
    ? 'bg-gradient-to-r from-blue-300 to-blue-400'
    : service.name === 'Internet'
    ? 'bg-gradient-to-r from-indigo-300 to-indigo-400'
    : service.name === 'Airtime'
    ? 'bg-gradient-to-r from-green-300 to-green-400'
    : service.name === 'Data Bundles'
    ? 'bg-gradient-to-r from-pink-300 to-pink-400'
    : service.name === 'Education'
    ? 'bg-gradient-to-r from-orange-300 to-orange-400'
    : service.name === 'Cable TV'
    ? 'bg-gradient-to-r from-purple-300 to-purple-400'
    : service.name === 'Tickets'
    ? 'bg-gradient-to-r from-red-300 to-red-400'
    : service.name === 'Plane Ticket Booking'
    ? 'bg-gradient-to-r from-sky-300 to-sky-400'
    : service.name === 'Insurance'
    ? 'bg-gradient-to-r from-amber-300 to-amber-400'
    : 'bg-gradient-to-r from-gray-300 to-gray-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-md relative overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        <button onClick={handleClose} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
        {/* Header */}
        <div className={`flex items-center gap-3 px-6 py-4 ${headerGradient} rounded-t-3xl shadow-md mb-2`}>
          <span className="text-2xl">{service.icon}</span>
          <span className="text-2xl font-extrabold text-gray-900 drop-shadow">{service.name}</span>
        </div>
        {step === 'form' && (
          <form className="flex flex-col gap-4 px-6 pb-6 pt-2 overflow-y-auto" style={{maxHeight: '70vh'}} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder={service.name === 'Cable TV' ? 'Smart Card Number' : (['Electricity', 'Water'].includes(service.name) ? 'Meter Number' : 'Phone Number')}
              value={account}
              onChange={e => setAccount(e.target.value)}
              className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500 text-base shadow-sm"
              required
            />
            {service.name === 'Airtime' && (
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Network</label>
                <select
                  value={network}
                  onChange={e => setNetwork(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                  style={{
                    background:
                      network === 'MTN' ? 'linear-gradient(90deg, #fef08a 60%, #facc15 100%)' :
                      network === 'Telecel' ? 'linear-gradient(90deg, #fecaca 60%, #ef4444 100%)' :
                      'linear-gradient(90deg, #dbeafe 60%, #3b82f6 100%)',
                  }}
                  required
                >
                  <option value="MTN">🟡 MTN</option>
                  <option value="Telecel">🔴 Telecel</option>
                  <option value="AirtelTigo">🔵 AirtelTigo</option>
                </select>
              </div>
            )}
            {service.name === 'Data Bundles' && (
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Network</label>
                <select
                  value={network}
                  onChange={e => setNetwork(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                  style={{
                    background:
                      network === 'MTN' ? 'linear-gradient(90deg, #fef08a 60%, #facc15 100%)' :
                      network === 'Telecel' ? 'linear-gradient(90deg, #fecaca 60%, #ef4444 100%)' :
                      'linear-gradient(90deg, #dbeafe 60%, #3b82f6 100%)',
                  }}
                  required
                >
                  <option value="MTN">🟡 MTN</option>
                  <option value="Telecel">🔴 Telecel</option>
                  <option value="AirtelTigo">🔵 AirtelTigo</option>
                </select>
              </div>
            )}
            {service.name === 'Education' && (
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Service Type</label>
                <select
                  value={educationService}
                  onChange={e => setEducationService(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                  required
                >
                  <option value="School Fees">🏫 School Fees</option>
                  <option value="Exam Fees">📝 Exam Fees</option>
                  <option value="Admission">🎓 Admission</option>
                  <option value="Others">📄 Others</option>
                </select>
                {educationService === 'School Fees' && (
                  <div className="mt-2">
                    <label className="block mb-1 font-semibold text-gray-700">Institution</label>
                    <select
                      value={institution}
                      onChange={e => setInstitution(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-white border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                      required
                    >
                      <option value="" disabled>Select Institution</option>
                      {ghanaTertiaryInstitutions.map(inst => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            {service.name === 'Cable TV' && (
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Provider</label>
                <select
                  value={cableProvider}
                  onChange={e => setCableProvider(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                  required
                >
                  <option value="" disabled>Select Provider</option>
                  {cableProviders.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
                {cableProvider === 'DStv' && (
                  <div className="mt-2">
                    <label className="block mb-1 font-semibold text-gray-700">DStv Package</label>
                    <select
                      value={dstvPackage}
                      onChange={e => setDstvPackage(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-white border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                      required
                    >
                      <option value="" disabled>Select Package</option>
                      {dstvPackages.map(pkg => (
                        <option key={pkg} value={pkg}>{pkg}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            {service.name === 'Tickets' && (
              <div>
                <label className="block mb-1 font-semibold text-gray-700">Event</label>
                <select
                  value={ticketEvent}
                  onChange={e => setTicketEvent(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                  required
                >
                  <option value="" disabled>Select Event</option>
                  {ghanaEvents.map(event => (
                    <option key={event} value={event}>{event}</option>
                  ))}
                </select>
              </div>
            )}
            {service.name === 'Plane Ticket Booking' && (
              <>
                <div className="flex items-center gap-2 px-6 py-3 mb-2 rounded-2xl bg-gradient-to-r from-sky-200 to-sky-400 shadow-md">
                  <span className="text-2xl">✈️</span>
                  <span className="text-lg font-bold text-sky-900">Plane Ticket Booking</span>
                </div>
                <div className="border-b border-sky-200 mb-2"></div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700"><span className='mr-1'>🛩️</span>Airline</label>
                  <select
                    value={airline}
                    onChange={e => setAirline(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white border-2 border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                    required
                  >
                    <option value="" disabled>Select Airline</option>
                    {airlines.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <div className="border-b border-sky-100 my-2"></div>
                <input
                  type="text"
                  placeholder="Passenger Name"
                  value={passengerName}
                  onChange={e => setPassengerName(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 placeholder-gray-500 text-base shadow-sm mb-1"
                  required
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 font-semibold text-gray-700"><span className='mr-1'>🛫</span>Departure</label>
                    <select
                      value={departure}
                      onChange={e => setDeparture(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-white border-2 border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                      required
                    >
                      <option value="" disabled>Select Departure</option>
                      {airportOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-semibold text-gray-700"><span className='mr-1'>🛬</span>Destination</label>
                    <select
                      value={destination}
                      onChange={e => setDestination(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-white border-2 border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                      required
                    >
                      <option value="" disabled>Select Destination</option>
                      {airportOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="block font-semibold text-gray-700"><span className='mr-1'>📅</span>Travel Date</label>
                  <input
                    type="date"
                    placeholder="Travel Date"
                    value={travelDate}
                    onChange={e => setTravelDate(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-gray-50 border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 placeholder-gray-500 text-base shadow-sm mb-1 flex-1"
                    required
                  />
                </div>
                <div className="border-b border-sky-100 my-2"></div>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Amount (GHS)"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 placeholder-gray-500 text-base shadow-sm mb-1"
                  required
                  readOnly={service && service.name === 'Plane Ticket Booking'}
                />
              </>
            )}
            {service.name === 'Insurance' && (
              <>
                <div className="flex items-center gap-2 px-6 py-3 mb-2 rounded-2xl bg-gradient-to-r from-amber-200 to-amber-400 shadow-md">
                  <span className="text-2xl">🛡️</span>
                  <span className="text-lg font-bold text-amber-900">Insurance Booking</span>
                </div>
                <div className="border-b border-amber-200 mb-2"></div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700"><span className='mr-1'>📋</span>Insurance Type</label>
                  <select
                    value={insuranceType}
                    onChange={e => setInsuranceType(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                    required
                  >
                    <option value="" disabled>Select Insurance Type</option>
                    {insuranceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-gray-700"><span className='mr-1'>🏢</span>Insurance Provider</label>
                  <select
                    value={insuranceProvider}
                    onChange={e => setInsuranceProvider(e.target.value)}
                    className="px-4 py-3 rounded-xl bg-white border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                    required
                  >
                    <option value="" disabled>Select Provider</option>
                    {insuranceProviders.map(provider => (
                      <option key={provider} value={provider}>{provider}</option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Policy Holder Name"
                  value={policyHolder}
                  onChange={e => setPolicyHolder(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-500 text-base shadow-sm mb-1"
                  required
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={insurancePhone}
                  onChange={e => setInsurancePhone(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-500 text-base shadow-sm mb-1"
                  required
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 font-semibold text-gray-700"><span className='mr-1'>💰</span>Coverage Amount (GHS)</label>
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      placeholder="e.g., 50000"
                      value={coverageAmount}
                      onChange={e => setCoverageAmount(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-gray-50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-500 text-base shadow-sm mb-1"
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-semibold text-gray-700"><span className='mr-1'>⏱️</span>Policy Duration</label>
                    <select
                      value={policyDuration}
                      onChange={e => setPolicyDuration(e.target.value)}
                      className="px-4 py-3 rounded-xl bg-white border-2 border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                      required
                    >
                      {policyDurations.map(duration => (
                        <option key={duration} value={duration}>{duration}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="border-b border-amber-100 my-2"></div>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Premium Amount (GHS)"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900 placeholder-gray-500 text-base shadow-sm mb-1"
                  required
                  readOnly={service && service.name === 'Insurance'}
                />
              </>
            )}
            {/* Enhanced Payment Method Selection */}
            <div className="border-t border-gray-200 pt-4">
              <label className="block mb-3 font-semibold text-gray-700">Payment Method</label>
              <div className="space-y-3">
                {paymentMethods.map((paymentMethod) => (
                  <div
                    key={paymentMethod.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      method === paymentMethod.name
                        ? 'border-[var(--color-primary)] bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setMethod(paymentMethod.name)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{paymentMethod.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{paymentMethod.name}</div>
                        <div className="text-sm text-gray-500">{paymentMethod.description}</div>
                      </div>
                      {method === paymentMethod.name && (
                        <div className="w-5 h-5 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Specific Fields */}
            {method === "Mobile Money" && (
              <div className="space-y-3">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Mobile Money Provider</label>
                  <div className="grid grid-cols-1 gap-2">
                    {mobileMoneyProviders.map((provider) => (
                      <div
                        key={provider.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          network === provider.name
                            ? 'border-[var(--color-primary)] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setNetwork(provider.name)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{provider.icon}</span>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800">{provider.name}</div>
                            <div className="text-xs text-gray-500">{provider.number}</div>
                          </div>
                          {network === provider.name && (
                            <span className="text-[var(--color-primary)]">✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <input
                  type="tel"
                  placeholder="Mobile Money Number"
                  value={mobileMoneyNumber}
                  onChange={(e) => setMobileMoneyNumber(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500 text-base shadow-sm"
                  required
                />
              </div>
            )}

            {method === "Card" && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500 text-base shadow-sm"
                  maxLength={19}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500 text-base shadow-sm"
                    maxLength={5}
                    required
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                    className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500 text-base shadow-sm"
                    maxLength={4}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Card Holder Name"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500 text-base shadow-sm"
                  required
                />
              </div>
            )}

            {method === "Bank" && (
              <div className="space-y-3">
                <select
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 text-base shadow-sm"
                  required
                >
                  <option value="" disabled>Select Bank</option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Account Number"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500 text-base shadow-sm"
                  maxLength={12}
                  required
                />
                <input
                  type="text"
                  placeholder="Account Holder Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-gray-900 placeholder-gray-500 text-base shadow-sm"
                  required
                />
              </div>
            )}

            {method === "Crypto" && (
              <div className="space-y-3 border-2 border-yellow-200 rounded-xl p-4 bg-yellow-50">
                <div className="text-yellow-700 font-bold text-center mb-2">Demo: No real crypto is transferred. Use the info below to simulate a payment.</div>
                <label className="block font-semibold text-gray-700">Select Coin</label>
                <select
                  value={cryptoCoin}
                  onChange={e => { setCryptoCoin(e.target.value); setCryptoStatus('pending'); }}
                  className="px-4 py-3 rounded-xl bg-white border-2 border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900 text-base shadow-sm font-semibold mb-1 transition-all"
                >
                  {cryptoCoins.map(coin => (
                    <option key={coin.symbol} value={coin.symbol}>{coin.name} ({coin.symbol})</option>
                  ))}
                </select>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm text-gray-700">Send exactly <b>{cryptoLoading ? '...' : cryptoAmount} {cryptoCoin}</b> to:</div>
                  <div className="font-mono text-xs bg-gray-100 rounded p-2 break-all select-all border border-gray-200">{cryptoAddress}</div>
                  <img src={cryptoCoins.find(c => c.symbol === cryptoCoin)?.qr} alt="QR Code" className="w-32 h-32 mx-auto" />
                </div>
                <button
                  type="button"
                  className={`w-full px-6 py-3 rounded-xl font-bold bg-yellow-500 text-white shadow-lg hover:bg-yellow-600 transition-all text-lg mt-2 ${cryptoStatus === 'confirmed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => setCryptoStatus('confirmed')}
                  disabled={cryptoStatus === 'confirmed'}
                >
                  {cryptoStatus === 'pending' ? 'Mark as Paid (Demo)' : 'Payment Confirmed!'}
                </button>
                {cryptoStatus === 'confirmed' && (
                  <div className="text-green-600 font-semibold text-center mt-2">Payment marked as confirmed (Demo)</div>
                )}
              </div>
            )}

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button type="submit" className="px-6 py-3 rounded-xl font-bold bg-[var(--color-primary)] text-white shadow-lg hover:bg-blue-700 transition-all text-lg mt-2">Continue</button>
          </form>
        )}
        {step === 'confirm' && (
          <div className="flex flex-col gap-4 px-6 pb-6 pt-2">
            <div className="text-lg font-semibold text-gray-700">Confirm Payment</div>
            <div className="bg-gray-50 rounded-xl p-4 shadow-inner">
              <div><b>Service:</b> {service.name}</div>
              {service.name === 'Cable TV' && cableProvider && (
                <div><b>Provider:</b> {cableProvider}</div>
              )}
              {service.name === 'Education' && (
                <>
                  <div><b>Service Type:</b> {educationService}</div>
                  {educationService === 'School Fees' && institution && (
                    <div><b>Institution:</b> {institution}</div>
                  )}
                </>
              )}
              {service.name === 'Tickets' && ticketEvent && (
                <div><b>Event:</b> {ticketEvent}</div>
              )}
              {service.name === 'Plane Ticket Booking' && (
                <>
                  <div><b>Airline:</b> {airline}</div>
                  <div><b>Passenger Name:</b> {passengerName}</div>
                  <div><b>Departure:</b> {departure}</div>
                  <div><b>Destination:</b> {destination}</div>
                  <div><b>Travel Date:</b> {travelDate}</div>
                  <div><b>Amount:</b> GHS {amount}</div>
                </>
              )}
              {service.name === 'Insurance' && (
                <>
                  <div><b>Insurance Type:</b> {insuranceType}</div>
                  <div><b>Provider:</b> {insuranceProvider}</div>
                  <div><b>Policy Holder:</b> {policyHolder}</div>
                  <div><b>Phone Number:</b> {insurancePhone}</div>
                  <div><b>Coverage Amount:</b> GHS {coverageAmount}</div>
                  <div><b>Policy Duration:</b> {policyDuration}</div>
                  <div><b>Premium Amount:</b> GHS {amount}</div>
                </>
              )}
              <div><b>{service.name === 'Cable TV' ? 'Smart Card Number' : (['Electricity', 'Water'].includes(service.name) ? 'Meter Number' : 'Phone Number')}:</b> {account}</div>
              {(service.name === 'Airtime' || service.name === 'Data Bundles') && (
                <div><b>Network:</b> {network}</div>
              )}
              <div><b>Amount:</b> GHS {amount}</div>
              <div><b>Payment Method:</b> {method}</div>
              {method === "Mobile Money" && (
                <>
                  <div><b>Provider:</b> {network}</div>
                  <div><b>Number:</b> {mobileMoneyNumber}</div>
                </>
              )}
              {method === "Card" && (
                <>
                  <div><b>Card Number:</b> **** **** **** {cardNumber.slice(-4)}</div>
                  <div><b>Card Holder:</b> {cardHolderName}</div>
                  <div><b>Expiry:</b> {cardExpiry}</div>
                </>
              )}
              {method === "Bank" && (
                <>
                  <div><b>Bank:</b> {banks.find(b => b.code === bankCode)?.name}</div>
                  <div><b>Account Number:</b> ****{bankAccount.slice(-4)}</div>
                  <div><b>Account Name:</b> {accountName}</div>
                </>
              )}
              {method === "Crypto" && (
                <>
                  <div><b>Crypto Coin:</b> {cryptoCoin}</div>
                  <div><b>Crypto Address:</b> {cryptoAddress}</div>
                  <div><b>Amount:</b> {cryptoAmount} {cryptoCoin}</div>
                  <div><b>Status:</b> {cryptoStatus}</div>
                </>
              )}
            </div>
            <button onClick={handleConfirm} className="px-6 py-3 rounded-xl font-bold bg-[var(--color-primary)] text-white shadow-lg hover:bg-blue-700 transition-all text-lg">Pay Now</button>
            <button onClick={() => setStep('form')} className="text-sm text-gray-500 underline">Back</button>
          </div>
        )}
        {step === 'processing' && (
          <div className="flex flex-col items-center gap-6 px-6 pb-8 pt-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--color-primary)]"></div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-700 mb-2">Processing Payment...</div>
              <div className="text-sm text-gray-500">Please wait while we process your payment</div>
            </div>
          </div>
        )}
        {step === 'success' && (
          <div className="flex flex-col items-center gap-6 px-6 pb-8 pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl text-green-600">✓</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">{success}</div>
              <div className="text-sm text-gray-600 mb-4">Transaction ID: {transactionId}</div>
              <div className="text-xs text-gray-500 mb-4">A receipt has been sent to your email</div>
              
              {/* Receipt Preview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
                <div className="text-sm font-semibold text-gray-700 mb-2">Receipt Preview:</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Service: {service.name}</div>
                  <div>Amount: ₵{amount}</div>
                  <div>Date: {new Date().toLocaleDateString()}</div>
                  <div>Time: {new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => {
                  const transaction = {
                    id: transactionId,
                    service: service.name,
                    amount: Number(amount),
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                    provider: service.name === 'Plane Ticket Booking' ? airline : service.name,
                    status: 'success'
                  };
                  // Generate receipt for download
                  const receipt = {
                    transactionId: transaction.id,
                    date: transaction.date,
                    time: transaction.time,
                    service: transaction.service,
                    provider: transaction.provider,
                    amount: transaction.amount,
                    status: transaction.status,
                    reference: `REF-${transaction.id}`,
                    customerEmail: user?.email || '',
                    customerName: user?.displayName || user?.email?.split('@')[0] || 'Customer'
                  };
                  
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
                }} 
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all"
              >
                Download Receipt
              </button>
              <button onClick={handleClose} className="flex-1 px-4 py-3 rounded-xl font-bold bg-[var(--color-primary)] text-white shadow-lg hover:bg-blue-700 transition-all">
                Done
              </button>
            </div>
          </div>
        )}
        {step === 'error' && (
          <div className="flex flex-col items-center gap-6 px-6 pb-8 pt-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl text-red-600">✕</span>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600 mb-2">Payment Failed</div>
              <div className="text-sm text-gray-600 mb-4">{paymentError}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleRetry} className="px-6 py-3 rounded-xl font-bold bg-[var(--color-primary)] text-white shadow-lg hover:bg-blue-700 transition-all">Try Again</button>
              <button onClick={handleClose} className="px-6 py-3 rounded-xl font-bold bg-gray-500 text-white shadow-lg hover:bg-gray-600 transition-all">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScheduledPaymentsModal({ 
  onClose, 
  onSchedule, 
  onRecurring, 
  user 
}: { 
  onClose: () => void;
  onSchedule: (data: any) => void;
  onRecurring: (data: any) => void;
  user: any;
}) {
  const [type, setType] = useState<'scheduled' | 'recurring'>('scheduled');
  const [service, setService] = useState("");
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("");
  const [customer, setCustomer] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Mobile Money");
  const [network, setNetwork] = useState("MTN");
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountName, setAccountName] = useState("");

  const services = [
    { name: "Electricity", providers: ["ECG", "NEDCo"] },
    { name: "Water", providers: ["GWCL"] },
    { name: "Internet", providers: ["MTN", "Vodafone", "AirtelTigo"] },
    { name: "Airtime", providers: ["MTN", "Vodafone", "AirtelTigo"] },
    { name: "Data Bundles", providers: ["MTN", "Vodafone", "AirtelTigo"] },
    { name: "Education", providers: ["University of Ghana", "KNUST", "UCC", "Ashesi"] },
    { name: "Cable TV", providers: ["DStv", "GOtv", "StarTimes"] },
    { name: "Tickets", providers: ["Event Organizers"] },
    { name: "Plane Ticket Booking", providers: ["Africa World Airlines", "PassionAir"] },
    { name: "Insurance", providers: ["SIC", "Vanguard", "Enterprise"] }
  ];

  const frequencies = [
    "Daily", "Weekly", "Monthly", "Quarterly", "Yearly"
  ];

  const paymentMethods = [
    { id: "mobile_money", name: "Mobile Money", icon: "📱" },
    { id: "card", name: "Credit/Debit Card", icon: "💳" },
    { id: "bank", name: "Bank Transfer", icon: "🏦" }
  ];

  const mobileMoneyProviders = [
    { id: "mtn", name: "MTN Mobile Money", icon: "🟡" },
    { id: "vodafone", name: "Vodafone Cash", icon: "🔴" },
    { id: "airteltigo", name: "AirtelTigo Money", icon: "🔵" }
  ];

  const banks = [
    { code: "GCB", name: "Ghana Commercial Bank" },
    { code: "ECOBANK", name: "Ecobank Ghana" },
    { code: "UBA", name: "United Bank for Africa" },
    { code: "STANBIC", name: "Stanbic Bank Ghana" },
    { code: "CAL", name: "CAL Bank" },
    { code: "FIDELITY", name: "Fidelity Bank Ghana" }
  ];

  const formatCardNumber = (value: string) => {
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

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    if (!service || !provider || !amount || !account || !customer) {
      return "Please fill in all required fields";
    }
    if (type === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      return "Please select date and time for scheduled payment";
    }
    if (type === 'recurring' && (!startDate || !endDate)) {
      return "Please select start and end dates for recurring payment";
    }
    if (parseFloat(amount) <= 0) {
      return "Amount must be greater than 0";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const paymentData = {
      service,
      provider,
      amount: parseFloat(amount),
      account,
      customer,
      paymentMethod,
      network,
      mobileMoneyNumber,
      cardNumber,
      cardExpiry,
      cardHolderName,
      bankAccount,
      bankCode,
      accountName,
      customerName: user?.displayName || user?.email,
      customerEmail: user?.email
    };

    if (type === 'scheduled') {
      onSchedule({
        ...paymentData,
        scheduledDate,
        scheduledTime
      });
    } else {
      onRecurring({
        ...paymentData,
        frequency,
        startDate,
        endDate
      });
    }
  };

  const selectedServiceData = services.find(s => s.name === service);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {type === 'scheduled' ? 'Schedule Payment' : 'Set Up Recurring Payment'}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Type Selector */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setType('scheduled')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              type === 'scheduled' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            ⏰ One-time Scheduled
          </button>
          <button
            onClick={() => setType('recurring')}
            className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
              type === 'recurring' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🔄 Recurring Payment
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Service *</label>
              <select
                value={service}
                onChange={(e) => {
                  setService(e.target.value);
                  setProvider("");
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              >
                <option value="">Select Service</option>
                {services.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Provider *</label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
                disabled={!service}
              >
                <option value="">Select Provider</option>
                {selectedServiceData?.providers.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₵) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number *</label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="Account number"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name *</label>
              <input
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="Customer name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                required
              />
            </div>
          </div>

          {/* Date/Time Selection */}
          {type === 'scheduled' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Date *</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Time *</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency *</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                >
                  {frequencies.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Method *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.name)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === method.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-semibold text-gray-800">{method.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Details */}
          {paymentMethod === "Mobile Money" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Network</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {mobileMoneyProviders.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={mobileMoneyNumber}
                  onChange={(e) => setMobileMoneyNumber(e.target.value)}
                  placeholder="0241234567"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          )}

          {paymentMethod === "Credit/Debit Card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  value={cardCVV}
                  onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          )}

          {paymentMethod === "Bank Transfer" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bank</label>
                <select
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select Bank</option>
                  {banks.map(bank => (
                    <option key={bank.code} value={bank.code}>{bank.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="1234567890"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Account holder name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
            >
              {type === 'scheduled' ? 'Schedule Payment' : 'Set Up Recurring Payment'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading, resendEmailVerification } = useAuth();
  const router = useRouter();
  const [resent, setResent] = useState(false);
  const [resendError, setResendError] = useState("");
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [copied, setCopied] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [agentForm, setAgentForm] = useState({ name: '', email: '', phone: '', business: '', location: '', message: '' });
  const [agentSuccess, setAgentSuccess] = useState('');
  const [agentError, setAgentError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showScheduledModal, setShowScheduledModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>({});
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scheduledPayments, setScheduledPayments] = useState<any[]>([]);
  const [recurringPayments, setRecurringPayments] = useState<any[]>([]);

  // Load scheduled and recurring payments
  useEffect(() => {
    const storedScheduled = JSON.parse(localStorage.getItem('cave_scheduled_payments') || '[]');
    const storedRecurring = JSON.parse(localStorage.getItem('cave_recurring_payments') || '[]');
    setScheduledPayments(storedScheduled);
    setRecurringPayments(storedRecurring);
  }, []);

  // Save scheduled payments
  const saveScheduledPayments = (payments: any[]) => {
    localStorage.setItem('cave_scheduled_payments', JSON.stringify(payments));
    setScheduledPayments(payments);
  };

  // Save recurring payments
  const saveRecurringPayments = (payments: any[]) => {
    localStorage.setItem('cave_recurring_payments', JSON.stringify(payments));
    setRecurringPayments(payments);
  };

  // Schedule a payment
  const schedulePayment = (data: any) => {
    const newScheduled = {
      id: `sched_${Date.now()}`,
      ...data,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    const updated = [...scheduledPayments, newScheduled];
    saveScheduledPayments(updated);
    setShowScheduledModal(false);
    setPaymentData({});
  };

  // Set up recurring payment
  const setupRecurringPayment = (data: any) => {
    const newRecurring = {
      id: `recur_${Date.now()}`,
      ...data,
      status: 'active',
      createdAt: new Date().toISOString(),
      nextPayment: data.startDate
    };
    const updated = [...recurringPayments, newRecurring];
    saveRecurringPayments(updated);
    setShowScheduledModal(false);
    setPaymentData({});
  };

  // Cancel scheduled payment
  const cancelScheduledPayment = (id: string) => {
    const updated = scheduledPayments.filter(p => p.id !== id);
    saveScheduledPayments(updated);
  };

  // Cancel recurring payment
  const cancelRecurringPayment = (id: string) => {
    const updated = recurringPayments.map(p => 
      p.id === id ? { ...p, status: 'cancelled' } : p
    );
    saveRecurringPayments(updated);
  };

  // Get upcoming payments
  const upcomingPayments = scheduledPayments
    .filter(p => p.status === 'scheduled' && new Date(p.scheduledDate) > new Date())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 3);

  // Get active recurring payments
  const activeRecurring = recurringPayments.filter(p => p.status === 'active');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const clearAll = () => setNotifications([]);

  const addTransaction = (service: string, amount: number, status: 'success' | 'failed', provider?: string) => {
    const newTransaction = {
      id: 'TXN' + Date.now().toString().slice(-8),
      service,
      amount,
      status,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      provider: provider || service
    };
    setTransactions(prev => [newTransaction, ...prev.slice(0, 4)]); // Keep only 5 most recent
    
    // Generate receipt and send email notification for successful payments
    if (status === 'success') {
      generateReceipt(newTransaction);
      sendEmailNotification(newTransaction);
      
      // Award points for successful payment
      awardPoints(amount, service);
    }
  };

  // Award points for successful payments
  const awardPoints = (amount: number, service: string) => {
    // Load current user rewards
    const storedRewards = localStorage.getItem('cave_user_rewards');
    if (!storedRewards) return;

    const userRewards = JSON.parse(storedRewards);
    
    // Calculate base points (1 point per ₵1 spent)
    let basePoints = Math.floor(amount);
    
    // Apply tier multiplier
    const tierMultipliers = {
      bronze: 1,
      silver: 1.2,
      gold: 1.5,
      platinum: 2
    };
    
    const multiplier = tierMultipliers[userRewards.tier as keyof typeof tierMultipliers] || 1;
    const totalPoints = Math.floor(basePoints * multiplier);
    
    // Add bonus points for specific services
    let bonusPoints = 0;
    if (service === 'Electricity' || service === 'Water') {
      bonusPoints = Math.floor(amount * 0.1); // 10% bonus for utilities
    } else if (service === 'Internet' || service === 'Data Bundles') {
      bonusPoints = Math.floor(amount * 0.15); // 15% bonus for internet services
    }
    
    const finalPoints = totalPoints + bonusPoints;
    
    // Update user rewards
    userRewards.points += finalPoints;
    userRewards.totalSpent += amount;
    userRewards.totalTransactions += 1;
    userRewards.lastTransactionDate = new Date().toISOString();
    
    // Save updated rewards
    localStorage.setItem('cave_user_rewards', JSON.stringify(userRewards));
    
    // Add notification about points earned
    const pointsNotification = {
      id: Date.now(),
      message: `Earned ${finalPoints} points for your ${service} payment! ${bonusPoints > 0 ? `(${bonusPoints} bonus points)` : ''}`,
      date: new Date().toISOString().split('T')[0],
      type: "success" as const,
      read: false
    };
    
    setNotifications(prev => [pointsNotification, ...prev.slice(0, 9)]);
  };

  // Receipt generation function
  const generateReceipt = (transaction: any) => {
    const receipt = {
      transactionId: transaction.id,
      date: transaction.date,
      time: transaction.time,
      service: transaction.service,
      provider: transaction.provider,
      amount: transaction.amount,
      status: transaction.status,
      reference: `REF-${transaction.id}`,
      customerEmail: user?.email || '',
      customerName: user?.displayName || user?.email?.split('@')[0] || 'Customer'
    };
    
    // Store receipt in localStorage for download
    const receipts = JSON.parse(localStorage.getItem('cave_receipts') || '[]');
    receipts.push(receipt);
    localStorage.setItem('cave_receipts', JSON.stringify(receipts));
  };

  // Email notification function
  const sendEmailNotification = async (transaction: any) => {
    try {
      // Mock email sending - in production this would call your email service
      console.log('Sending email notification for transaction:', transaction.id);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add notification to the notifications list
      const newNotification = {
        id: Date.now(),
        message: `Receipt for ${transaction.service} payment (₵${transaction.amount.toFixed(2)}) has been sent to your email.`,
        date: new Date().toISOString().split('T')[0],
        type: "success" as const,
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 most recent
      
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  };

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

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAgentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAgentForm({ ...agentForm, [e.target.name]: e.target.value });
    setAgentError('');
    setAgentSuccess('');
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentForm.name || !agentForm.email || !agentForm.phone || !agentForm.business || !agentForm.location) {
      setAgentError('All fields except message are required.');
      return;
    }
    setAgentSuccess('Application submitted! We will contact you soon. (Mock)');
    setAgentForm({ name: '', email: '', phone: '', business: '', location: '', message: '' });
    setTimeout(() => setShowAgent(false), 2000);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading...</div>;
  }
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Not signed in.</div>;
  }
  if (!user.emailVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-yellow-200 text-center">
          <h2 className="text-2xl font-bold text-yellow-700 mb-4">Verify Your Email</h2>
          <p className="mb-4 text-gray-700">A verification link has been sent to <b>{user.email ?? ''}</b>. Please check your inbox and click the link to verify your email address.</p>
          <button
            className="px-6 py-3 rounded-lg font-bold bg-yellow-500 text-white shadow hover:bg-yellow-600 transition-all mb-2"
            onClick={async () => { setResendError(""); setResent(false); try { await resendEmailVerification(); setResent(true); } catch (e: any) { setResendError(e.message); } }}
            disabled={resent}
          >
            {resent ? "Verification Email Sent!" : "Resend Verification Email"}
          </button>
          {resendError && <div className="text-red-500 text-sm mt-2">{resendError}</div>}
          <div className="text-gray-500 text-xs mt-4">Refresh this page after verifying your email.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100/40 to-orange-100/30">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/30 backdrop-blur-md border-r border-white/20 shadow-lg p-6">
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-[var(--color-primary)] hover:underline focus:outline-none">Cave</Link>
        </div>
        <nav className="flex flex-col gap-4">
          <Link href="/dashboard" className="font-semibold text-blue-700 hover:underline">Dashboard</Link>
          <Link href="/bills" className="font-semibold text-gray-700 hover:underline">Bills</Link>
          <Link href="/history" className="font-semibold text-gray-700 hover:underline">History</Link>
          <Link href="/receipts" className="font-semibold text-gray-700 hover:underline">Receipts</Link>
          <Link href="/profile" className="font-semibold text-gray-700 hover:underline">Profile</Link>
        </nav>
        <div className="mt-auto pt-8 text-xs text-gray-500">Logged in as<br />{user.email}</div>
        <button
          onClick={() => router.push('/signin')}
          className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-700 transition-all w-full"
        >
          Log Out
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center p-6 md:p-12">
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)]">Welcome, {(user.email ?? 'User').split(' ')[0]}!</h1>
            <div className="relative">
              <button onClick={() => setShowNotifications(v => !v)} className="relative p-2 rounded-full bg-white/80 hover:bg-green-100 shadow">
                <span role="img" aria-label="bell" className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-green-500 text-white text-xs flex items-center justify-center rounded-full border-2 border-white">{unreadCount}</span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="p-4 font-bold text-gray-700 border-b flex justify-between items-center">
                    Notifications
                    <button onClick={markAllRead} className="text-xs text-green-600 hover:underline">Mark all read</button>
                  </div>
                  <ul className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <li className="px-4 py-6 text-center text-gray-400">No notifications</li>
                    ) : (
                      notifications.map(n => (
                        <li key={n.id} className={`px-4 py-3 border-b last:border-b-0 flex items-start gap-2 ${!n.read ? "bg-green-50" : ""}`}>
                          <span className={`mt-1 w-2 h-2 rounded-full ${n.type === "success" ? "bg-green-500" : n.type === "error" ? "bg-red-500" : "bg-yellow-400"}`}></span>
                          <div className="flex-1">
                            <div className={`text-sm ${!n.read ? "font-bold text-green-700" : "text-gray-700"}`}>{n.message}</div>
                            <div className="text-xs text-gray-400">{n.date}</div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                  <button onClick={clearAll} className="w-full py-2 text-xs text-gray-500 hover:text-red-500 border-t">Clear all</button>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-700 mb-6">What would you like to do today?</p>
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/bills" className="px-6 py-3 rounded-lg bg-[var(--color-primary)] text-white font-semibold shadow hover:bg-blue-700 transition-all">Pay a Bill</Link>
            <Link href="/history" className="px-6 py-3 rounded-lg bg-white/80 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)] shadow hover:bg-blue-50 transition-all">View History</Link>
            <Link href="/receipts" className="px-6 py-3 rounded-lg bg-white/80 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)] shadow hover:bg-blue-50 transition-all">Receipts</Link>
            <Link href="/analytics" className="px-6 py-3 rounded-lg bg-white/80 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)] shadow hover:bg-blue-50 transition-all">Analytics</Link>
            <Link href="/payment-methods" className="px-6 py-3 rounded-lg bg-white/80 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)] shadow hover:bg-blue-50 transition-all">Payment Methods</Link>
            <Link href="/security" className="px-6 py-3 rounded-lg bg-white/80 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)] shadow hover:bg-blue-50 transition-all">Security</Link>
            <Link href="/support" className="px-6 py-3 rounded-lg bg-white/80 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)] shadow hover:bg-blue-50 transition-all">Support</Link>
            <Link href="/rewards" className="px-6 py-3 rounded-lg bg-white/80 text-[var(--color-primary)] font-semibold border border-[var(--color-primary)] shadow hover:bg-blue-50 transition-all">Rewards</Link>
          </div>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total Spent</div>
                  <div className="text-2xl font-bold text-gray-800">
                    ₵{transactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl text-green-600">💰</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Successful Payments</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {transactions.filter(t => t.status === 'success').length}
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl text-blue-600">✓</span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 mb-1">This Month</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {transactions.filter(t => {
                      const transactionDate = new Date(t.date);
                      const now = new Date();
                      return transactionDate.getMonth() === now.getMonth() && 
                             transactionDate.getFullYear() === now.getFullYear() &&
                             t.status === 'success';
                    }).length}
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl text-purple-600">📅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards Summary */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Rewards & Loyalty</h3>
                <p className="text-purple-100 text-sm mb-3">Earn points with every payment</p>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-2xl font-bold">1,250</div>
                    <div className="text-purple-100 text-sm">Total Points</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Silver</div>
                    <div className="text-purple-100 text-sm">Current Tier</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">3</div>
                    <div className="text-purple-100 text-sm">Friends Referred</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Link 
                  href="/rewards" 
                  className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
                >
                  View Rewards
                </Link>
              </div>
            </div>
          </div>

          {/* Support Summary */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Customer Support</h3>
                <p className="text-blue-100 text-sm mb-3">We're here to help you 24/7</p>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-lg font-semibold">FAQ</div>
                    <div className="text-blue-100 text-sm">Quick Answers</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Live Chat</div>
                    <div className="text-blue-100 text-sm">Instant Help</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Tickets</div>
                    <div className="text-blue-100 text-sm">Track Issues</div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Link 
                  href="/support" 
                  className="inline-block px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all"
                >
                  Get Support
                </Link>
              </div>
            </div>
          </div>
          {/* Services Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
            {services.map((service, idx) => (
              <button
                key={service.name}
                type="button"
                onClick={e => {
                  // Animate the card before opening modal
                  const btn = e.currentTarget;
                  btn.classList.add('animate-scale-in');
                  setTimeout(() => {
                    btn.classList.remove('animate-scale-in');
                    setSelectedService(service);
                  }, 180);
                }}
                className={
                  `flex flex-col items-center justify-center p-7 rounded-2xl shadow-xl border border-gray-100 transition-all duration-200 cursor-pointer group ` +
                  `bg-gradient-to-br ` +
                  (idx === 0
                    ? 'from-yellow-100 to-yellow-200/80'
                    : idx === 1
                    ? 'from-blue-100 to-blue-200/80'
                    : idx === 2
                    ? 'from-indigo-100 to-indigo-200/80'
                    : idx === 3
                    ? 'from-green-100 to-green-200/80'
                    : idx === 4
                    ? 'from-pink-100 to-pink-200/80'
                    : idx === 5
                    ? 'from-orange-100 to-orange-200/80'
                    : idx === 6
                    ? 'from-purple-100 to-purple-200/80'
                    : 'from-red-100 to-red-200/80')
                }
                style={{ boxShadow: idx === 0
                  ? '0 8px 32px 0 rgba(251,191,36,0.10)'
                  : idx === 1
                  ? '0 8px 32px 0 rgba(59,130,246,0.10)'
                  : idx === 2
                  ? '0 8px 32px 0 rgba(99,102,241,0.10)'
                  : idx === 3
                  ? '0 8px 32px 0 rgba(34,197,94,0.10)'
                  : idx === 4
                  ? '0 8px 32px 0 rgba(236,72,153,0.10)'
                  : idx === 5
                  ? '0 8px 32px 0 rgba(251,146,60,0.10)'
                  : idx === 6
                  ? '0 8px 32px 0 rgba(168,85,247,0.10)'
                  : '0 8px 32px 0 rgba(239,68,68,0.10)'}}
              >
                <span
                  className="flex items-center justify-center w-14 h-14 rounded-full shadow-lg mb-3 text-3xl"
                  style={{
                    background: idx === 0
                      ? 'linear-gradient(135deg, #fde68a 60%, #fbbf24 100%)'
                      : idx === 1
                      ? 'linear-gradient(135deg, #93c5fd 60%, #3b82f6 100%)'
                      : idx === 2
                      ? 'linear-gradient(135deg, #c7d2fe 60%, #6366f1 100%)'
                      : idx === 3
                      ? 'linear-gradient(135deg, #bbf7d0 60%, #22c55e 100%)'
                      : idx === 4
                      ? 'linear-gradient(135deg, #fbcfe8 60%, #ec4899 100%)'
                      : idx === 5
                      ? 'linear-gradient(135deg, #fdba74 60%, #fb923c 100%)'
                      : idx === 6
                      ? 'linear-gradient(135deg, #e9d5ff 60%, #a855f7 100%)'
                      : 'linear-gradient(135deg, #fecaca 60%, #ef4444 100%)',
                  }}
                >
                  {service.icon}
                </span>
                <span className="font-extrabold text-lg text-gray-900 mb-1 drop-shadow-md">
                  {service.name}
                </span>
              </button>
            ))}
          </div>
          {/* Recent Transactions */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
              <Link href="/history" className="text-sm text-[var(--color-primary)] hover:underline font-semibold">View All</Link>
            </div>
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <div>No transactions yet</div>
                <div className="text-sm">Your payment history will appear here</div>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
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
                        <div className="text-sm text-gray-500">{transaction.provider} • {transaction.date} at {transaction.time}</div>
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

          {/* Scheduled Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Upcoming Scheduled Payments */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Upcoming Payments</h2>
                <button
                  onClick={() => setShowScheduledModal(true)}
                  className="text-sm text-[var(--color-primary)] hover:underline font-semibold"
                >
                  Schedule New
                </button>
              </div>
              {upcomingPayments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">⏰</div>
                  <div>No upcoming payments</div>
                  <div className="text-sm">Schedule payments for the future</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg text-blue-600">⏰</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{payment.service}</div>
                          <div className="text-sm text-gray-500">{payment.provider} • {payment.scheduledDate}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">₵{payment.amount.toFixed(2)}</div>
                        <button
                          onClick={() => cancelScheduledPayment(payment.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recurring Payments */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recurring Payments</h2>
                <button
                  onClick={() => setShowScheduledModal(true)}
                  className="text-sm text-[var(--color-primary)] hover:underline font-semibold"
                >
                  Set Up New
                </button>
              </div>
              {activeRecurring.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🔄</div>
                  <div>No recurring payments</div>
                  <div className="text-sm">Set up automatic payments</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeRecurring.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-lg text-green-600">🔄</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{payment.service}</div>
                          <div className="text-sm text-gray-500">{payment.provider} • {payment.frequency}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">₵{payment.amount.toFixed(2)}</div>
                        <button
                          onClick={() => cancelRecurringPayment(payment.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Refer & Earn Card */}
          <div className="bg-green-50 border border-green-200 rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Refer & Earn</h2>
              <p className="text-gray-700 mb-4">Invite your friends to Cave and earn rewards when they sign up and make their first payment!</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-4 py-2 rounded-lg bg-white border border-green-300 font-mono text-green-700 text-lg">{referralCode}</span>
                <button onClick={handleCopy} className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all">{copied ? "Copied!" : "Copy"}</button>
              </div>
              <div className="text-xs text-gray-500 mb-2">Share your code with friends to earn ₵5.00 for each successful referral.</div>
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-lg font-bold text-green-700 mb-2">Your Referrals</h3>
              {referredFriends.length === 0 ? (
                <div className="text-gray-400">No referrals yet.</div>
              ) : (
                <ul className="space-y-2">
                  {referredFriends.map(f => (
                    <li key={f.name} className="flex justify-between items-center bg-white rounded-lg px-4 py-2 border border-green-100">
                      <span className="font-semibold text-gray-700">{f.name}</span>
                      <span className="text-green-600 font-bold">+{f.reward}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Become an Agent Card */}
          <div className="bg-white border border-green-200 rounded-2xl shadow p-6 flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Become an Agent</h2>
              <p className="text-gray-700 mb-4">Join Cave as an agent or merchant and earn commissions by helping others pay their bills!</p>
              <button onClick={() => setShowAgent(true)} className="px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all">Apply Now</button>
            </div>
            <div className="flex-1 w-full">
              <ul className="list-disc pl-6 text-gray-600 text-sm">
                <li>Earn commissions on every transaction</li>
                <li>Grow your business with Cave</li>
                <li>Get access to exclusive agent tools</li>
              </ul>
            </div>
          </div>
          {showAgent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                <button onClick={() => setShowAgent(false)} className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-gray-700">&times;</button>
                <h3 className="text-xl font-bold mb-4 text-green-700">Agent Application</h3>
                <form className="flex flex-col gap-4" onSubmit={handleAgentSubmit}>
                  <input name="name" value={agentForm.name} onChange={handleAgentChange} placeholder="Full Name" className="px-4 py-3 rounded-lg bg-gray-100 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 placeholder-gray-500" />
                  <input name="email" value={agentForm.email} onChange={handleAgentChange} placeholder="Email" className="px-4 py-3 rounded-lg bg-gray-100 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 placeholder-gray-500" />
                  <input name="phone" value={agentForm.phone} onChange={handleAgentChange} placeholder="Phone" className="px-4 py-3 rounded-lg bg-gray-100 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 placeholder-gray-500" />
                  <input name="business" value={agentForm.business} onChange={handleAgentChange} placeholder="Business Name" className="px-4 py-3 rounded-lg bg-gray-100 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 placeholder-gray-500" />
                  <input name="location" value={agentForm.location} onChange={handleAgentChange} placeholder="Location" className="px-4 py-3 rounded-lg bg-gray-100 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 placeholder-gray-500" />
                  <textarea name="message" value={agentForm.message} onChange={handleAgentChange} placeholder="Message (optional)" className="px-4 py-3 rounded-lg bg-gray-100 border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 placeholder-gray-500" />
                  {agentError && <div className="text-red-500 text-sm text-center">{agentError}</div>}
                  {agentSuccess && <div className="text-green-600 text-sm text-center">{agentSuccess}</div>}
                  <button type="submit" className="px-6 py-3 rounded-lg font-bold bg-green-600 text-white shadow hover:bg-green-700 transition-all">Submit Application</button>
                </form>
              </div>
            </div>
          )}
        </div>
        <BillModal service={selectedService} onClose={() => setSelectedService(null)} onTransactionSuccess={addTransaction} user={user} />
        
        {/* Scheduled Payments Modal */}
        {showScheduledModal && (
          <ScheduledPaymentsModal 
            onClose={() => setShowScheduledModal(false)}
            onSchedule={schedulePayment}
            onRecurring={setupRecurringPayment}
            user={user}
          />
        )}

        {/* Floating Support Chat Widget */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => window.open('/support', '_blank')}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-2xl hover:scale-110"
            title="Get Support"
          >
            💬
          </button>
        </div>
      </main>
    </div>
  );
} 