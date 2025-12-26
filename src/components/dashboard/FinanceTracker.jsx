import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  Tick02Icon,
  Cancel01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  MoneyBag02Icon,
  PieChartIcon,
  Search01Icon,
  Wallet01Icon,
  Calendar02Icon,
  AnalyticsUpIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { db } from "../../config/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

// Accounts (Banks + E-Wallets)
const ACCOUNT_TYPES = [
  // Banks
  { id: "bca", label: "BCA", icon: "🏦", color: "#0150a0", type: "bank" },
  { id: "bni", label: "BNI", icon: "🏦", color: "#f57c00", type: "bank" },
  { id: "bri", label: "BRI", icon: "🏦", color: "#003d79", type: "bank" },
  { id: "mandiri", label: "Mandiri", icon: "🏦", color: "#003b71", type: "bank" },
  { id: "cimb", label: "CIMB Niaga", icon: "🏦", color: "#ed1c24", type: "bank" },
  { id: "seabank", label: "SeaBank", icon: "🏦", color: "#00a8e1", type: "bank" },
  { id: "jago", label: "Bank Jago", icon: "🏦", color: "#ffd100", type: "bank" },
  { id: "blu", label: "blu by BCA", icon: "🏦", color: "#0066b3", type: "bank" },
  // E-Wallets
  { id: "dana", label: "DANA", icon: "📱", color: "#108ee9", type: "ewallet" },
  { id: "gopay", label: "GoPay", icon: "📱", color: "#00aa13", type: "ewallet" },
  { id: "ovo", label: "OVO", icon: "📱", color: "#4c3494", type: "ewallet" },
  { id: "shopeepay", label: "ShopeePay", icon: "📱", color: "#ee4d2d", type: "ewallet" },
  { id: "linkaja", label: "LinkAja", icon: "📱", color: "#e31937", type: "ewallet" },
  // Cash
  { id: "cash", label: "Cash", icon: "💵", color: "#10b981", type: "cash" },
];

// Categories
const CATEGORIES = {
  income: [
    { id: "salary", label: "Gaji", icon: "💼", color: "#10b981" },
    { id: "freelance", label: "Freelance", icon: "💻", color: "#3b82f6" },
    { id: "investment", label: "Investasi", icon: "📈", color: "#8b5cf6" },
    { id: "transfer_in", label: "Transfer Masuk", icon: "📥", color: "#06b6d4" },
    { id: "gift", label: "Hadiah", icon: "🎁", color: "#ec4899" },
    { id: "refund", label: "Refund", icon: "↩️", color: "#f59e0b" },
    { id: "other_income", label: "Lainnya", icon: "💵", color: "#6b7280" },
  ],
  expense: [
    { id: "food", label: "Makanan", icon: "🍔", color: "#f59e0b" },
    { id: "transport", label: "Transportasi", icon: "🚗", color: "#3b82f6" },
    { id: "shopping", label: "Belanja", icon: "🛒", color: "#ec4899" },
    { id: "bills", label: "Tagihan", icon: "📄", color: "#ef4444" },
    { id: "entertainment", label: "Hiburan", icon: "🎮", color: "#8b5cf6" },
    { id: "health", label: "Kesehatan", icon: "💊", color: "#10b981" },
    { id: "education", label: "Pendidikan", icon: "📚", color: "#6366f1" },
    { id: "subscription", label: "Langganan", icon: "📺", color: "#f97316" },
    { id: "transfer_out", label: "Transfer Keluar", icon: "📤", color: "#64748b" },
    { id: "other_expense", label: "Lainnya", icon: "💸", color: "#6b7280" },
  ],
};

// Period Options
const PERIODS = [
  { id: "daily", label: "Hari Ini" },
  { id: "weekly", label: "Minggu Ini" },
  { id: "monthly", label: "Bulan Ini" },
  { id: "yearly", label: "Tahun Ini" },
  { id: "custom", label: "Kustom" },
  { id: "all", label: "Semua" },
];

const FinanceTracker = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [period, setPeriod] = useState("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, income, expense
  
  // Custom date range
  const [customDateStart, setCustomDateStart] = useState(new Date().toISOString().split("T")[0]);
  const [customDateEnd, setCustomDateEnd] = useState(new Date().toISOString().split("T")[0]);


  // Form state
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "food",
    accountId: "cash",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Account balances management
  const [initialBalances, setInitialBalances] = useState({}); // { accountId: initialBalance }
  const [showBalanceSettings, setShowBalanceSettings] = useState(false);
  const [editingBalance, setEditingBalance] = useState({ accountId: "", amount: "" });

  // Subscribe to transactions
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Subscribe to initial balances
  useEffect(() => {
    if (!user) return;

    const fetchBalances = async () => {
      const balanceDoc = await getDoc(doc(db, "users", user.uid, "settings", "accountBalances"));
      if (balanceDoc.exists()) {
        setInitialBalances(balanceDoc.data().balances || {});
      }
    };
    fetchBalances();
  }, [user]);

  // Calculate current balance per account (initial + income - expense)
  const accountBalances = useMemo(() => {
    const balances = {};
    
    // Start with initial balances
    ACCOUNT_TYPES.forEach(acc => {
      balances[acc.id] = initialBalances[acc.id] || 0;
    });

    // Apply all transactions (not just filtered)
    transactions.forEach(t => {
      const accId = t.accountId || t.paymentMethod || "cash";
      if (t.type === "income") {
        balances[accId] = (balances[accId] || 0) + parseFloat(t.amount);
      } else {
        balances[accId] = (balances[accId] || 0) - parseFloat(t.amount);
      }
    });

    return balances;
  }, [transactions, initialBalances]);

  // Save initial balance to Firestore
  const saveInitialBalance = async (accountId, amount) => {
    if (!user) return;
    const newBalances = { ...initialBalances, [accountId]: parseFloat(amount) || 0 };
    await setDoc(doc(db, "users", user.uid, "settings", "accountBalances"), {
      balances: newBalances,
      updatedAt: serverTimestamp(),
    });
    setInitialBalances(newBalances);
    setEditingBalance({ accountId: "", amount: "" });
  };


  // Filter transactions by period
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      
      // Period filter
      let matchesPeriod = true;
      if (period === "daily") matchesPeriod = tDate >= startOfDay;
      else if (period === "weekly") matchesPeriod = tDate >= startOfWeek;
      else if (period === "monthly") matchesPeriod = tDate >= startOfMonth;
      else if (period === "yearly") matchesPeriod = tDate >= startOfYear;
      else if (period === "custom") {
        const start = new Date(customDateStart);
        const end = new Date(customDateEnd);
        end.setHours(23, 59, 59, 999); // Include the entire end day
        matchesPeriod = tDate >= start && tDate <= end;
      }

      // Type filter
      const matchesType = filterType === "all" || t.type === filterType;

      // Search filter
      const matchesSearch = 
        t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesPeriod && matchesType && matchesSearch;
    });
  }, [transactions, period, filterType, searchQuery, customDateStart, customDateEnd]);

  // Calculate totals
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    const expense = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [filteredTransactions]);

  // Category breakdown for chart
  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = t.category || "other_expense";
        breakdown[cat] = (breakdown[cat] || 0) + parseFloat(t.amount);
      });
    return Object.entries(breakdown)
      .map(([id, amount]) => {
        const category = CATEGORIES.expense.find((c) => c.id === id) || { label: id, color: "#6b7280", icon: "💸" };
        return { ...category, amount };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [filteredTransactions]);

  // Format currency - defined before financialHealth useMemo uses it
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format number with thousand separators (dots for Indonesian format)
  const formatNumberInput = (value) => {
    // Remove non-numeric characters except minus sign at start
    const numericValue = value.replace(/[^\d-]/g, '').replace(/(?!^)-/g, '');
    if (!numericValue || numericValue === '-') return numericValue;
    
    // Format with thousand separators (dots)
    const number = parseInt(numericValue, 10);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('id-ID').format(number);
  };

  // Parse formatted number back to plain number
  const parseFormattedNumber = (formattedValue) => {
    if (!formattedValue) return '';
    return formattedValue.replace(/\./g, '');
  };

  // Financial Health Analysis & Suggestions
  const financialHealth = useMemo(() => {
    const { income, expense, balance } = stats;
    let healthScore = 100; // Start perfect
    const suggestions = [];

    // Calculate savings rate
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    
    // Evaluate spending patterns
    if (expense > income) {
      healthScore -= 40;
      suggestions.push({
        type: "warning",
        title: "Pengeluaran Melebihi Pemasukan",
        text: `Anda menghabiskan lebih dari yang didapat. Kurangi pengeluaran sebesar ${formatCurrency(expense - income)} untuk seimbang.`,
      });
    }
    
    if (savingsRate < 20 && income > 0) {
      healthScore -= 20;
      suggestions.push({
        type: "tip",
        title: "Tingkatkan Tabungan",
        text: `Idealnya tabungkan 20% penghasilan. Saat ini hanya ${savingsRate.toFixed(1)}%. Target: ${formatCurrency(income * 0.2)}/periode.`,
      });
    }

    // Analyze category spending
    const foodSpending = categoryBreakdown.find(c => c.id === "food")?.amount || 0;
    const entertainmentSpending = categoryBreakdown.find(c => c.id === "entertainment")?.amount || 0;
    
    if (expense > 0 && foodSpending / expense > 0.4) {
      healthScore -= 10;
      suggestions.push({
        type: "tip",
        title: "Pengeluaran Makanan Tinggi",
        text: `Makanan ${((foodSpending / expense) * 100).toFixed(0)}% dari total pengeluaran (${formatCurrency(foodSpending)}). Coba masak sendiri atau bawa bekal untuk hemat.`,
      });
    }

    if (expense > 0 && entertainmentSpending / expense > 0.2) {
      healthScore -= 10;
      suggestions.push({
        type: "tip",
        title: "Hiburan Bisa Dikurangi",
        text: `${formatCurrency(entertainmentSpending)} untuk hiburan. Pertimbangkan alternatif gratis atau berbagi langganan.`,
      });
    }

    // Positive feedback
    if (balance > 0 && savingsRate >= 30) {
      suggestions.push({
        type: "success",
        title: "Cashflow Sangat Baik! 🎉",
        text: `Anda menabung ${savingsRate.toFixed(1)}% penghasilan. Pertahankan kebiasaan bijak ini!`,
      });
    } else if (balance > 0) {
      suggestions.push({
        type: "success",
        title: "Saldo Positif ✅",
        text: `Keuangan Anda dalam kondisi aman dengan saldo ${formatCurrency(balance)}.`,
      });
    }

    return {
      score: Math.max(0, Math.min(100, healthScore)),
      status: healthScore >= 80 ? "excellent" : healthScore >= 60 ? "good" : healthScore >= 40 ? "fair" : "poor",
      statusLabel: healthScore >= 80 ? "Sangat Baik" : healthScore >= 60 ? "Baik" : healthScore >= 40 ? "Perlu Perhatian" : "Kritis",
      color: healthScore >= 80 ? "#10b981" : healthScore >= 60 ? "#3b82f6" : healthScore >= 40 ? "#f59e0b" : "#ef4444",
      suggestions,
      savingsRate,
    };
  }, [stats, categoryBreakdown]);

  const resetForm = () => {
    setFormData({
      type: "expense",
      amount: "",
      category: "food",
      accountId: "cash",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !user) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "users", user.uid, "transactions", editingId), {
          ...formData,
          amount: parseFloat(formData.amount),
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "users", user.uid, "transactions"), {
          ...formData,
          amount: parseFloat(formData.amount),
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const deleteTransaction = async (id) => {
    if (!user) return;
    if (confirm("Hapus transaksi ini?")) {
      await deleteDoc(doc(db, "users", user.uid, "transactions", id));
    }
  };

  const startEdit = (transaction) => {
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      accountId: transaction.accountId || transaction.paymentMethod || "cash",
      description: transaction.description || "",
      date: transaction.date,
    });
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryInfo = (type, categoryId) => {
    const categories = CATEGORIES[type] || CATEGORIES.expense;
    return categories.find((c) => c.id === categoryId) || categories[categories.length - 1];
  };

  const getAccountInfo = (id) => {
    return ACCOUNT_TYPES.find((a) => a.id === id) || ACCOUNT_TYPES[ACCOUNT_TYPES.length - 1];
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Income Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <HugeiconsIcon icon={ArrowUp01Icon} size={20} className="text-emerald-400" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Pemasukan</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400">
            {formatCurrency(stats.income)}
          </div>
        </motion.div>

        {/* Expense Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <HugeiconsIcon icon={ArrowDown01Icon} size={20} className="text-red-400" />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Pengeluaran</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-red-400">
            {formatCurrency(stats.expense)}
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${
            stats.balance >= 0
              ? "from-blue-500/10 to-blue-600/5 border-blue-500/20"
              : "from-orange-500/10 to-orange-600/5 border-orange-500/20"
          } border`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              stats.balance >= 0 ? "bg-blue-500/20" : "bg-orange-500/20"
            }`}>
              <HugeiconsIcon icon={Wallet01Icon} size={20} className={stats.balance >= 0 ? "text-blue-400" : "text-orange-400"} />
            </div>
            <span className="text-sm text-[var(--text-secondary)]">Saldo</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-bold ${
            stats.balance >= 0 ? "text-blue-400" : "text-orange-400"
          }`}>
            {formatCurrency(stats.balance)}
          </div>
        </motion.div>
      </div>

      {/* Account Balances Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--glass-border)]"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Wallet01Icon} size={20} className="text-[var(--primary)]" />
            <h3 className="font-semibold text-white">Saldo Rekening</h3>
          </div>
          <button
            onClick={() => setShowBalanceSettings(!showBalanceSettings)}
            className="text-xs px-3 py-1.5 rounded-lg bg-[var(--primary)]/20 text-[var(--primary)] hover:bg-[var(--primary)]/30 transition-colors"
          >
            {showBalanceSettings ? "Tutup" : "⚙️ Atur Saldo"}
          </button>
        </div>

        {/* Balance Settings Panel */}
        <AnimatePresence>
          {showBalanceSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700"
            >
              <p className="text-xs text-[var(--text-secondary)] mb-3">
                Set saldo awal untuk setiap rekening. Saldo akan otomatis bertambah/berkurang sesuai transaksi.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {ACCOUNT_TYPES.map(acc => (
                  <div key={acc.id} className="flex items-center gap-2">
                    <span className="text-lg">{acc.icon}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder={acc.label}
                      value={editingBalance.accountId === acc.id 
                        ? formatNumberInput(editingBalance.amount) 
                        : (initialBalances[acc.id] ? formatNumberInput(String(initialBalances[acc.id])) : "")}
                      onChange={(e) => setEditingBalance({ accountId: acc.id, amount: parseFormattedNumber(e.target.value) })}
                      onBlur={() => {
                        if (editingBalance.accountId === acc.id && editingBalance.amount !== "") {
                          saveInitialBalance(acc.id, editingBalance.amount);
                        }
                      }}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-slate-700 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-xs w-full appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Account Balance Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {ACCOUNT_TYPES.filter(acc => accountBalances[acc.id] !== 0 || initialBalances[acc.id]).map(acc => {
            const balance = accountBalances[acc.id] || 0;
            const isNegative = balance < 0;
            return (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: `${acc.color}10`,
                  borderColor: `${acc.color}30`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{acc.icon}</span>
                  <span className="text-xs font-medium text-white truncate">{acc.label}</span>
                </div>
                <div className={`text-sm font-bold ${isNegative ? "text-red-400" : "text-white"}`}>
                  {formatCurrency(balance)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {ACCOUNT_TYPES.filter(acc => accountBalances[acc.id] !== 0 || initialBalances[acc.id]).length === 0 && (
          <p className="text-center text-[var(--text-secondary)] text-sm py-4">
            Belum ada saldo. Klik &quot;Atur Saldo&quot; untuk set saldo awal atau tambahkan transaksi.
          </p>
        )}
      </motion.div>

      {/* Category Breakdown Chart */}
      {categoryBreakdown.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--glass-border)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={PieChartIcon} size={20} className="text-[var(--primary)]" />
            <h3 className="font-semibold text-white">Pengeluaran per Kategori</h3>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {categoryBreakdown.slice(0, 5).map((cat, index) => {
              const percentage = stats.expense > 0 ? (cat.amount / stats.expense) * 100 : 0;
              return (
                <div key={cat.id} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-[var(--text-secondary)]">{cat.label}</span>
                    </span>
                    <span className="text-white font-medium">{formatCurrency(cat.amount)}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Financial Health Analysis */}
      {filteredTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--glass-border)]"
        >
          <div className="flex items-center gap-2 mb-4">
            <HugeiconsIcon icon={AnalyticsUpIcon} size={20} className="text-[var(--primary)]" />
            <h3 className="font-semibold text-white">Analisis Kesehatan Keuangan</h3>
          </div>
          
          {/* Health Score Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[var(--text-secondary)]">Skor Kesehatan</span>
              <span className="text-sm font-bold" style={{ color: financialHealth.color }}>
                {financialHealth.score}/100 - {financialHealth.statusLabel}
              </span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${financialHealth.score}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-full rounded-full"
                style={{ backgroundColor: financialHealth.color }}
              />
            </div>
          </div>

          {/* Suggestions */}
          {financialHealth.suggestions.length > 0 && (
            <div className="space-y-2">
              {financialHealth.suggestions.map((suggestion, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className={`p-3 rounded-xl border ${
                    suggestion.type === "warning" ? "bg-red-500/10 border-red-500/30" :
                    suggestion.type === "tip" ? "bg-amber-500/10 border-amber-500/30" :
                    "bg-emerald-500/10 border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <HugeiconsIcon 
                      icon={InformationCircleIcon} 
                      size={16} 
                      className={
                        suggestion.type === "warning" ? "text-red-400 mt-0.5" :
                        suggestion.type === "tip" ? "text-amber-400 mt-0.5" :
                        "text-emerald-400 mt-0.5"
                      }
                    />
                    <div>
                      <p className={`text-sm font-medium ${
                        suggestion.type === "warning" ? "text-red-400" :
                        suggestion.type === "tip" ? "text-amber-400" :
                        "text-emerald-400"
                      }`}>{suggestion.title}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{suggestion.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Period & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        {/* Period Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-card)] rounded-xl overflow-x-auto">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                period === p.id
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              {p.id === "custom" && <HugeiconsIcon icon={Calendar02Icon} size={12} />}
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range Panel */}
      <AnimatePresence>
        {period === "custom" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 sm:p-4 rounded-xl bg-[var(--bg-card)]/80 backdrop-blur border border-[var(--glass-border)]"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Calendar02Icon} size={18} className="text-[var(--primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">Periode:</span>
              </div>
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                <input
                  type="date"
                  value={customDateStart}
                  onChange={(e) => setCustomDateStart(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm [color-scheme:dark] min-w-[130px]"
                />
                <span className="text-[var(--text-secondary)] text-sm">s/d</span>
                <input
                  type="date"
                  value={customDateEnd}
                  onChange={(e) => setCustomDateEnd(e.target.value)}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm [color-scheme:dark] min-w-[130px]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-48">
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] text-sm text-white placeholder:text-gray-500 outline-none focus:border-[var(--primary)]"
            />
            <HugeiconsIcon icon={Search01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] text-xs text-gray-300 outline-none focus:border-[var(--primary)]"
          >
            <option value="all">Semua</option>
            <option value="income">Pemasukan</option>
            <option value="expense">Pengeluaran</option>
          </select>
      </div>

      {/* Add Button / Form */}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--glass-border)] space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-white text-sm">
                {editingId ? "Edit Transaksi" : "Transaksi Baru"}
              </h3>
              <button type="button" onClick={resetForm}>
                <HugeiconsIcon icon={Cancel01Icon} size={18} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Type Toggle */}
            <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "expense", category: "food" })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.type === "expense"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "income", category: "salary" })}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.type === "income"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-[var(--text-secondary)]"
                }`}
              >
                Pemasukan
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Jumlah</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatNumberInput(formData.amount)}
                  onChange={(e) => setFormData({ ...formData, amount: parseFormattedNumber(e.target.value) })}
                  placeholder="0"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-lg font-semibold appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Category */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm"
                >
                  {CATEGORIES[formData.type].map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Rekening/Dompet</label>
                <select
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm"
                >
                  {ACCOUNT_TYPES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.icon} {a.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Date */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Tanggal</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm [color-scheme:dark]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Keterangan</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Catatan..."
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 rounded-xl bg-slate-700 text-[var(--text-secondary)] font-medium text-sm hover:bg-slate-600 transition-all"
              >
                Batal
              </button>
              <motion.button
                type="submit"
                disabled={!formData.amount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg text-sm"
              >
                <HugeiconsIcon icon={editingId ? Tick02Icon : Add01Icon} size={18} />
                <span>{editingId ? "Update" : "Tambah"}</span>
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowForm(true)}
            className="w-full py-4 border-2 border-dashed border-[var(--glass-border)] rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all"
          >
            <HugeiconsIcon icon={Add01Icon} size={20} />
            <span className="font-medium">Tambah Transaksi</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10"
            >
              <HugeiconsIcon icon={MoneyBag02Icon} size={48} className="mx-auto mb-3 text-gray-600" />
              <p className="text-[var(--text-secondary)]">Belum ada transaksi</p>
            </motion.div>
          ) : (
            filteredTransactions.map((t, index) => {
              const categoryInfo = getCategoryInfo(t.type, t.category);
              const accountInfo = getAccountInfo(t.accountId || t.paymentMethod || "cash");
              const isIncome = t.type === "income";

              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.02 }}
                  className="group p-3 sm:p-4 rounded-2xl bg-[var(--bg-card)]/60 backdrop-blur border border-[var(--glass-border)] hover:border-[var(--primary)]/30 hover:bg-[var(--bg-card)]/80 transition-all"
                >
                  {/* Mobile Layout */}
                  <div className="flex sm:hidden flex-col gap-2">
                    {/* Top row: Icon + Category + Amount */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ backgroundColor: `${categoryInfo.color}20` }}
                        >
                          {categoryInfo.icon}
                        </div>
                        <div>
                          <span className="font-medium text-white text-sm">{categoryInfo.label}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-[var(--text-secondary)]">
                              {accountInfo.icon} {accountInfo.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold text-sm ${isIncome ? "text-emerald-400" : "text-red-400"}`}>
                        {isIncome ? "+" : "-"}{formatCurrency(t.amount)}
                      </div>
                    </div>
                    {/* Bottom row: Date + Description + Actions */}
                    <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] pl-12">
                      <div className="flex items-center gap-2 truncate">
                        <span>{formatDate(t.date)}</span>
                        {t.description && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[100px]">{t.description}</span>
                          </>
                        )}
                      </div>
                      {/* Actions - always visible on mobile */}
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(t)}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                        >
                          <HugeiconsIcon icon={Edit02Icon} size={14} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center gap-3">
                    {/* Category Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: `${categoryInfo.color}20` }}
                    >
                      {categoryInfo.icon}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm truncate">
                          {categoryInfo.label}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-[var(--text-secondary)]">
                          {accountInfo.icon} {accountInfo.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
                        <span>{formatDate(t.date)}</span>
                        {t.description && (
                          <>
                            <span>•</span>
                            <span className="truncate">{t.description}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <div className={`font-bold ${isIncome ? "text-emerald-400" : "text-red-400"}`}>
                        {isIncome ? "+" : "-"}{formatCurrency(t.amount)}
                      </div>
                    </div>

                    {/* Actions - always visible with subtle opacity, full on hover */}
                    <div className="flex gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(t)}
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors"
                      >
                        <HugeiconsIcon icon={Edit02Icon} size={16} />
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FinanceTracker;
