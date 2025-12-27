import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, writeBatch } from "firebase/firestore";
import ConfirmModal from "../ui/ConfirmModal";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoneyBag02Icon,
  AnalysisTextLinkIcon,
  Task01Icon,
  Analytics01Icon,
  StarIcon,
  Add01Icon,
  Edit02Icon,
  Delete02Icon,
  ChartHistogramIcon,
  Cancel01Icon,
  FilterHorizontalIcon,
  InformationCircleIcon
} from "@hugeicons/core-free-icons";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const ASSET_TYPES = [
  { id: "crypto", label: "Crypto", icon: MoneyBag02Icon, color: "#f7931a" },
  { id: "stock", label: "Saham", icon: Analytics01Icon, color: "#3b82f6" },
  { id: "gold", label: "Emas", icon: StarIcon, color: "#eab308" },
  { id: "other", label: "Lainnya", icon: MoneyBag02Icon, color: "#8b5cf6" },
];

const getAssetFormConfig = (type) => {
  switch (type) {
    case "crypto": return {
       tickerLabel: "Ticker / Symbol", tickerPlaceholder: "BTC, ETH, SOL",
       nameLabel: "Nama Aset", namePlaceholder: "Bitcoin, Ethereum",
       amountLabel: "Jumlah Koin (Coin)", amountPlaceholder: "0.00000000",
       amountTooltip: "Jumlah unit koin yang Anda miliki. Gunakan koma untuk desimal."
    };
    case "stock": return {
       tickerLabel: "Kode Emiten", tickerPlaceholder: "BBCA, TLKM, GOTO",
       nameLabel: "Nama Perusahaan", namePlaceholder: "Bank Central Asia, Telkom",
       amountLabel: "Jumlah Lembar", amountPlaceholder: "0",
       amountTooltip: "Total lembar saham yang dimiliki (1 Lot = 100 Lembar)."
    };
    case "gold": return {
       tickerLabel: "Kode / Seri (Opsional)", tickerPlaceholder: "ANTAM, UBS",
       nameLabel: "Jenis Emas", namePlaceholder: "Emas Antam 24K, Emas Digital",
       amountLabel: "Berat (Gram)", amountPlaceholder: "0.00",
       amountTooltip: "Berat emas dalam satuan gram. Gunakan koma untuk desimal."
    };
    default: return {
       tickerLabel: "Kode / Ticker", tickerPlaceholder: "CODE",
       nameLabel: "Nama Aset", namePlaceholder: "Nama Aset",
       amountLabel: "Jumlah Unit", amountPlaceholder: "0",
       amountTooltip: "Jumlah unit aset yang dimiliki."
    };
  }
};

const PLATFORMS = ["Binance", "Indodax", "Tokocrypto", "Pintu", "Ajaib", "Bibit", "Stockbit", "Bareksa", "Pluang", "GoTrade", "OKX", "Wallet (Cold)", "Other"];

// Helpers for IDR format
const formatIDR = (val) => {
  if (val === "" || val === undefined || val === null) return "";
  const str = val.toString();
  const parts = str.split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return parts.length > 1 ? `${integerPart},${parts[1]}` : integerPart;
};

// High precision currency formatter
// Format Currency (IDR or USD)
const formatCurrency = (value, currency = 'IDR') => {
  if (value === "" || value === null || isNaN(value)) return currency === 'IDR' ? "Rp 0" : "$ 0";
  if (currency === 'USD') {
     return new Intl.NumberFormat("en-US", {
       style: "currency",
       currency: "USD",
       minimumFractionDigits: 0,
       maximumFractionDigits: 2,
     }).format(value);
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};



const formatNumber = (num) => new Intl.NumberFormat("id-ID").format(num);

// Smart Input Parser (Handles IDR/US/Mixed formats)
const parseInput = (val) => {
  if (!val) return "";
  let clean = val.replace(/[^0-9.,]/g, ""); // Keep digits, dots, commas
  
  const lastComma = clean.lastIndexOf(',');
  const lastDot = clean.lastIndexOf('.');

  if (lastComma > -1 && lastDot > -1) {
      if (lastComma > lastDot) { // IDR: 1.000,00
          clean = clean.replace(/\./g, ""); 
          clean = clean.replace(/,/g, "."); 
      } else { // US: 1,000.00
          clean = clean.replace(/,/g, ""); 
      }
  } else if (lastComma > -1) {
      // Only commas
      if ((clean.match(/,/g) || []).length > 1) {
          clean = clean.replace(/,/g, ""); // Treat as thousands (5,555,555)
      } else {
          clean = clean.replace(/,/g, "."); // Treat as decimal (500,5 -> 500.5)
      }
  } else if (lastDot > -1) {
      // Only dots -> Always treat as thousands in IDR context
      clean = clean.replace(/\./g, "");
  }
  
  return clean;
};

// Input Component with Clear Button & Better Helper
// eslint-disable-next-line react/prop-types
const FormattedInput = ({ value, onChange, placeholder, className, prefix, currency = 'IDR', exchangeRate = 16250 }) => {
  const displayValue = formatIDR(value);
  const derivedPrefix = prefix || (currency === 'USD' ? '$' : 'Rp');

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = (e) => {
      e.stopPropagation();
      onChange("");
  };

  const parsedVal = parseFloat(value);
  const isValid = value && !isNaN(parsedVal);
  const convertedIDR = currency === 'USD' ? parsedVal * exchangeRate : parsedVal;

  // Enhance className for container (convert focus: to focus-within:)
  const containerClass = className 
      ? className.replace(/focus:/g, 'focus-within:') 
      : "";

  return (
    <div className="relative group">
      {/* Box Container - Flexbox approach for perfect alignment */}
      <div className={`flex items-center px-4 relative transition-all ${containerClass}`}>
          {/* Prefix - Static Flex Item */}
          <span className="text-[var(--text-secondary)] text-sm whitespace-nowrap mr-3 font-medium select-none cursor-text" onClick={() => document.getElementById(`input-${placeholder}`)?.focus()}>
             {derivedPrefix}
          </span>
          
          {/* Input - Flexible */}
          <input
            type="text"
            value={displayValue}
            onChange={handleChange}
            placeholder={placeholder}
            // Inherit styles but reset layout properties
            className="flex-1 w-full bg-transparent border-none outline-none text-inherit placeholder:text-white/20 h-full py-0"
          />
          
          {/* Clear Button - Static Flex Item */}
          {value && (
             <button 
                type="button"
                onClick={handleClear}
                className="ml-2 p-1 rounded-full hover:bg-white/10 text-[var(--text-secondary)] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
             >
                <HugeiconsIcon icon={Cancel01Icon} size={14} />
             </button>
          )}
      </div>

      {/* Enhanced Helper Text */}
      {isValid && (
         <div className={`mt-1 ml-auto w-fit text-[10px] font-bold px-2 py-0.5 rounded-md transition-all border border-white/5 ${
            parsedVal > 0 ? "text-emerald-400 bg-[#0a0a0a]" : "text-[var(--text-secondary)] bg-[#0a0a0a]"
         }`}>
            Terbaca: {formatCurrency(parsedVal, currency)}
            {currency === 'USD' && <span className="text-white/50 ml-1">≈ {formatCurrency(convertedIDR, 'IDR')}</span>}
         </div>
      )}
    </div>
  );
};



const HelperTooltip = ({ text }) => (
  <div className="relative group inline-block ml-1 align-middle">
    <HugeiconsIcon icon={InformationCircleIcon} size={14} className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 text-white text-[10px] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center border border-[var(--glass-border)] invisible group-hover:visible">
      {text}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-r border-b border-[var(--glass-border)]"></div>
    </div>
  </div>
);

const InvestmentPortfolio = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("holdings"); // holdings, calculator, analysis, history
  const [filterCategory, setFilterCategory] = useState("all"); // all, crypto, stock, gold, etc.
  
  // Holdings State
  const [holdings, setHoldings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    type: "crypto",
    platform: "Binance",
    avgBuyPrice: "",
    currentPrice: "",
    amount: "",
    notes: ""
  });

  // Calculator State
  const [calcData, setCalcData] = useState({
    buyPrice: "",
    amount: "",
    targetPrice: ""
  });

  // Delete Modal
  const [deleteConfig, setDeleteConfig] = useState({ 
    isOpen: false, 
    id: null, 
    type: 'asset', // 'asset' | 'history' | 'history_all' 
    title: "", 
    message: "" 
  });

  // Wallets & History State
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositForm, setDepositForm] = useState({ type: "crypto", amount: "" });
  const [depositMode, setDepositMode] = useState('add'); // 'add' (Top Up) or 'set' (Reset/Fix)

  // Sell Modal State
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellData, setSellData] = useState({ id: null, sellPrice: "", amount: "" });
  
  // Custom Alert State
  // Custom Alert State
  const [alertState, setAlertState] = useState({ 
     isOpen: false, 
     title: "", 
     message: "", 
     type: "danger" // danger, success, info, warning
  });

  // Currency State
  const [inputCurrency, setInputCurrency] = useState('IDR'); // 'IDR' or 'USD'
  const [exchangeRate, setExchangeRate] = useState(16250); // Default Rate
  const [showSettings, setShowSettings] = useState(false);

  const showAlert = (message, title = "Perhatian", type = "danger") => {
     setAlertState({
        isOpen: true,
        title,
        message,
        type
     });
  };

  // Firestore Subscriptions
  useState(() => {
    if (!user) return;
    
    // Holdings
    const qHoldings = query(collection(db, "users", user.uid, "investments"), orderBy("createdAt", "desc"));
    const unsubHoldings = onSnapshot(qHoldings, (snapshot) => {
      setHoldings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Wallets
    const qWallets = query(collection(db, "users", user.uid, "investment_wallets"));
    const unsubWallets = onSnapshot(qWallets, (snapshot) => {
      const wData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // If no wallets, maybe init default? For now just set state.
      setWallets(wData);
    });

    // Transactions
    const qTransactions = query(collection(db, "users", user.uid, "investment_transactions"), orderBy("date", "desc"));
    const unsubTransactions = onSnapshot(qTransactions, (snapshot) => {
      setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubHoldings();
      unsubWallets();
      unsubTransactions();
    };
  }, [user]);

  // --- FILTER & STATS LOGIC ---
  
  // 1. Filtered Data
  const filteredHoldings = useMemo(() => {
    if (filterCategory === "all") return holdings;
    return holdings.filter(h => h.type === filterCategory);
  }, [holdings, filterCategory]);

  const filteredTransactions = useMemo(() => {
    if (filterCategory === "all") return transactions;
    // We infer transaction type from asset type logic or metadata if available
    // Currently transactions don't store "type" explicitly (crypto/stock), but they have asset names.
    // Ideally we improve transaction logging, but for v2 data we might need to guess or filter by logic.
    // For now, let's filter by checking if the asset exists in current holdings of that type?
    // Or better: We should have stored 'type' in transactions. 
    // Checking lines 288+, we do NOT store 'type' (crypto/stock) in transaction doc, only transaction type (BUY/SELL).
    // WORKAROUND: We will filter mostly holdings first. For transactions, we show ALL unless we can match against asset names.
    // User request: "kalau saya pilih tab kripto yang muncul data investasi kripto saya..pnl kripto saya berapa"
    // So distinct filtering is required.
    // Future improvement: Add 'assetType' field to transactions.
    
    // For now, we will simply return all transactions if filter is active because we lack data, 
    // OR we can guess based on known platform?
    // But platform is loose text.
    
    // Let's just filter holdings accurately first.
    return transactions;
  }, [transactions, filterCategory]);

  // 2. Filtered Stats (Dynamic Summary)
  const filteredStats = useMemo(() => {
    let inputsInvested = 0; // Assets cost
    let inputsValue = 0;    // Assets value
    
    // 1. Calculate Assets
    filteredHoldings.forEach(item => {
      const invested = parseFloat(item.avgBuyPrice) * parseFloat(item.amount);
      const current = parseFloat(item.currentPrice) * parseFloat(item.amount);
      inputsInvested += invested;
      inputsValue += current;
    });

    // 2. Calculate Wallet Cash (Appropriate to filter)
    let cashBalance = 0;
    if (filterCategory === 'all') {
       cashBalance = wallets.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0);
    } else {
       // Only count wallet equal to category
       const w = wallets.find(w => w.type === filterCategory);
       cashBalance = w ? (parseFloat(w.balance) || 0) : 0;
    }

    // 3. Integrate Cash into Modal and Value
    // Modal (Modal) = Asset Cost + Cash (Assuming Cash is part of initial capital)
    const totalInvested = inputsInvested + cashBalance;
    const totalCurrentValue = inputsValue + cashBalance;

    const totalPnL = inputsValue - inputsInvested; // Cash has 0 PnL
    const pnlPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return { totalInvested, totalCurrentValue, totalPnL, pnlPercentage };
  }, [filteredHoldings, wallets, filterCategory]);

  // Actions... (handleSave, handleDelete, etc. remain same)
  // ... (Keep existing action functions)
  
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const buyPrice = parseFloat(formData.avgBuyPrice.replace(/,/g, "."));
      const currentPrice = parseFloat(formData.currentPrice.replace(/,/g, "."));
      const amount = parseFloat(formData.amount.replace(/,/g, "."));
      
      // Convert if USD
      const finalBuyPrice = inputCurrency === 'USD' ? buyPrice * exchangeRate : buyPrice;
      const finalCurrentPrice = inputCurrency === 'USD' ? currentPrice * exchangeRate : currentPrice;
      const totalCost = finalBuyPrice * amount; // Total is always IDR for balance check

      const payload = {
        ...formData,
        avgBuyPrice: finalBuyPrice,
        currentPrice: finalCurrentPrice,
        amount: amount,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, "users", user.uid, "investments", editingId), payload);
      } else {
        const wallet = wallets.find(w => w.type === formData.type);
        const currentBalance = wallet ? wallet.balance : 0;

        if (currentBalance < totalCost) {
            showAlert(
               `Saldo ${formData.type} Wallet tidak mencukupi! \nButuh: ${formatCurrency(totalCost)}\nSaldo: ${formatCurrency(currentBalance)}`,
               "Saldo Tidak Cukup",
               "danger"
            );
            return;
        }

        if (wallet) {
            await updateDoc(doc(db, "users", user.uid, "investment_wallets", wallet.id), {
                balance: currentBalance - totalCost,
                updatedAt: serverTimestamp()
            });
        } else {
            showAlert("Wallet tidak ditemukan. Silahkan Deposit terlebih dahulu.", "Error Wallet", "danger");
            return;
        }

        await addDoc(collection(db, "users", user.uid, "investment_transactions"), {
            type: 'BUY',
            assetName: formData.name,
            assetType: formData.type, // Added for future filtering
            ticker: formData.ticker,
            amount: amount,
            price: finalBuyPrice,
            total: totalCost,
            platform: formData.platform,
            date: serverTimestamp()
        });

        await addDoc(collection(db, "users", user.uid, "investments"), {
          ...payload,
          createdAt: serverTimestamp()
        });
      }
      setShowAddModal(false);
      resetForm();
      showAlert("Transaksi berhasil disimpan!", "Sukses", "success");
    } catch (error) {
      console.error("Error saving investment:", error);
      showAlert("Terjadi kesalahan saat menyimpan data.", "Error System", "danger");
    }
  };

  const handleDelete = async () => {
    const { id, type } = deleteConfig;
    if (!id && type !== 'history_all') return;

    try {
      if (type === 'asset') {
         await deleteDoc(doc(db, "users", user.uid, "investments", id));
         showAlert("Aset berhasil dihapus secara permanen.", "Penghapusan Berhasil", "success");
      } else if (type === 'history') {
         await deleteDoc(doc(db, "users", user.uid, "investment_transactions", id));
         showAlert("Riwayat transaksi berhasil dihapus.", "Sukses", "success");
      } else if (type === 'history_all') {
         const batch = writeBatch(db);
         // Delete all currently loaded transactions
         transactions.forEach(tx => {
             const ref = doc(db, "users", user.uid, "investment_transactions", tx.id);
             batch.delete(ref);
         });
         await batch.commit();
         showAlert("Semua riwayat transaksi berhasil dibersihkan.", "Sukses", "success");
      }
    } catch (error) {
       console.error("Error deleting:", error);
       showAlert("Gagal menghapus data.", "Error", "danger");
    } finally {
       setDeleteConfig(prev => ({ ...prev, isOpen: false }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      ticker: "",
      type: "crypto",
      platform: "Binance",
      avgBuyPrice: "",
      currentPrice: "",
      amount: "",
      notes: ""
    });
    setEditingId(null);
  };

  const startEdit = (item) => {
    setFormData({
      name: item.name,
      ticker: item.ticker,
      type: item.type,
      platform: item.platform,
      avgBuyPrice: item.avgBuyPrice,
      currentPrice: item.currentPrice,
      amount: item.amount,
      notes: item.notes || ""
    });
    setEditingId(item.id);
    setShowAddModal(true);
  };

  const handleInputChange = (field, value) => {
    const cleanValue = parseInput(value);
    if (cleanValue === "" || !isNaN(parseFloat(cleanValue))) {
       setFormData(prev => ({ ...prev, [field]: cleanValue }));
    }
  };

  const handleCalcChange = (field, value) => {
     const cleanValue = parseInput(value);
     if (cleanValue === "" || !isNaN(parseFloat(cleanValue))) {
        setCalcData(prev => ({ ...prev, [field]: cleanValue }));
     }
  };

  // --- WALLET & TRANSACTION LOGIC ---
  const getWalletBalance = (type) => {
     const w = wallets.find(w => w.type === type);
     return w ? w.balance : 0;
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if(!user || !depositForm.amount) return;
    
    // Parse Amount from Input
    const rawAmount = parseFloat(depositForm.amount.replace(/,/g, ".")); 
    
    // Convert to IDR if USD Mode
    const amount = inputCurrency === 'USD' ? rawAmount * exchangeRate : rawAmount;
    
    const type = depositForm.type;

    try {
       const existingWallet = wallets.find(w => w.type === type);
       const walletRef = existingWallet 
          ? doc(db, "users", user.uid, "investment_wallets", existingWallet.id)
          : null;

       let newBalance = amount;
       let txType = 'DEPOSIT';
       let assetName = 'IDR Deposit';
       
       if (depositMode === 'add') {
           newBalance = (existingWallet ? existingWallet.balance : 0) + amount;
       } else {
           // SET (Reset) Mode
           txType = 'RESET';
           assetName = 'Balance Adjustment';
       }

       if (walletRef) {
          await updateDoc(walletRef, {
             balance: newBalance,
             updatedAt: serverTimestamp()
          });
       } else {
          await addDoc(collection(db, "users", user.uid, "investment_wallets"), {
             type,
             balance: newBalance,
             createdAt: serverTimestamp(),
             updatedAt: serverTimestamp()
          });
       }

       // Record Transaction
       await addDoc(collection(db, "users", user.uid, "investment_transactions"), {
          type: txType,
          amount: amount, 
          assetName: assetName,
          assetType: type, // Tag for filtering
          price: 1,
          total: amount,
          date: serverTimestamp(),
          platform: 'Manual Adjustment'
       });

       setShowDepositModal(false);
       setDepositForm({ type: 'crypto', amount: '' });
       showAlert("Deposit berhasil ditambahkan!", "Sukses", "success");
    } catch (error) {
       console.error(error);
       showAlert("Gagal melakukan deposit.", "Error", "danger");
    }
  };

  const handleSell = async (e) => {
     e.preventDefault();
     if(!user || !sellData.id) return;

     const item = holdings.find(h => h.id === sellData.id);
     if(!item) return;

     const sellAmount = parseFloat(sellData.amount.replace(/,/g, "."));
     const sellPrice = parseFloat(sellData.sellPrice.replace(/,/g, "."));
     const totalValue = sellAmount * sellPrice;
     const pnl = (sellPrice - item.avgBuyPrice) * sellAmount;

     try {
        const wallet = wallets.find(w => w.type === item.type);
        if(wallet) {
           await updateDoc(doc(db, "users", user.uid, "investment_wallets", wallet.id), {
              balance: (wallet.balance || 0) + totalValue,
              updatedAt: serverTimestamp()
           });
        } else {
            await addDoc(collection(db, "users", user.uid, "investment_wallets"), {
             type: item.type,
             balance: totalValue,
             createdAt: serverTimestamp(),
             updatedAt: serverTimestamp()
            });
        }

        await addDoc(collection(db, "users", user.uid, "investment_transactions"), {
           type: 'SELL',
           assetName: item.name,
           assetType: item.type, // Tag for filtering
           ticker: item.ticker,
           amount: sellAmount,
           price: sellPrice,
           total: totalValue,
           pnl: pnl,
           platform: item.platform,
           date: serverTimestamp()
        });

        if(Math.abs(item.amount - sellAmount) < 0.000001) {
           await deleteDoc(doc(db, "users", user.uid, "investments", item.id));
        } else {
           await updateDoc(doc(db, "users", user.uid, "investments", item.id), {
              amount: item.amount - sellAmount
           });
        }

        setShowSellModal(false);
        setSellData({ id: null, sellPrice: "", amount: "" });
        showAlert("Aset berhasil dijual!", "Sukses", "success");
     } catch (err) {
        console.error(err);
        showAlert("Gagal menjual aset.", "Error", "danger");
     }
  };

  const getTypeColor = (typeId) => ASSET_TYPES.find(t => t.id === typeId)?.color || "#gray";

  // Analysis/Calculator Logic
  const calculateScenario = () => {
    const buy = parseFloat(calcData.buyPrice) || 0;
    const target = parseFloat(calcData.targetPrice) || 0;
    const amt = parseFloat(calcData.amount) || 0;
    
    const profitPerUnit = target - buy;
    const totalProfit = profitPerUnit * amt;
    const percent = buy > 0 ? (profitPerUnit / buy) * 100 : 0;
    
    return { totalProfit, percent };
  };

  const getRecommendation = (percent) => {
     if (percent > 20) return { text: "STRONG BUY / HOLD", color: "text-emerald-400", bg: "bg-emerald-500/20", desc: "Potensi profit tinggi. Pertimbangkan untuk realisasi sebagian profit atau hold untuk jangka panjang." };
     if (percent > 0) return { text: "GOOD", color: "text-blue-400", bg: "bg-blue-500/20", desc: "Dalam zona profit. Aman untuk dikoleksi." };
     if (percent > -10) return { text: "WAIT & SEE", color: "text-amber-400", bg: "bg-amber-500/20", desc: "Harga koreksi wajar. Pantau support terdekat." };
     return { text: "DANGER / STOP LOSS", color: "text-rose-400", bg: "bg-rose-500/20", desc: "Kerugian cukup dalam. Pertimbangkan cut loss atau average down jika fundamental bagus." };
  };

  const scenarioResult = calculateScenario();
  const recommendation = getRecommendation(scenarioResult.percent);

  // --- HELPER DATA ---
  // allocationData also needs filtering if we want charts to update?
  // Usually allocation shows distribution of current view.
  const allocationData = ASSET_TYPES.filter(t => t.id !== 'other').map(type => {
     const available = filteredHoldings.filter(h => h.type === type.id);
     if (available.length === 0) return null;
     const value = available.reduce((sum, h) => sum + (parseFloat(h.amount) * parseFloat(h.currentPrice)), 0);
     return { name: type.label, value, color: type.color };
  }).filter(d => d !== null && d.value > 0);

  // Reused Modal Content
  const formConfig = getAssetFormConfig(formData.type);

  const ModalContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[var(--bg-card)] border border-[var(--glass-border)] w-full max-w-lg rounded-2xl p-6 relative overflow-y-auto max-h-[90vh]" 
      onClick={e => e.stopPropagation()}
    >
      <h3 className="text-xl font-bold text-white mb-6">{editingId ? "Edit Aset" : "Portfolio Baru"}</h3>
      
      <form onSubmit={handleSave} className="space-y-5">
        
        {/* Type Selection */}
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-2 block font-medium uppercase tracking-wide">Tipe Aset</label>
          <div className="grid grid-cols-3 gap-3">
            {ASSET_TYPES.filter(t => t.id !== 'other').map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all border ${
                  formData.type === type.id
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--bg-main)] text-[var(--text-secondary)] border-transparent hover:border-[var(--glass-border)]"
                }`}
              >
                <HugeiconsIcon icon={type.icon} size={20} />
                <span className="text-[10px] font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="text-xs text-[var(--text-secondary)] mb-1 block">Platform / Exchange</label>
          <div className="relative">
            <select
              value={formData.platform}
              onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] outline-none appearance-none"
            >
              {PLATFORMS.map(p => (
                <option key={p} value={p} className="bg-slate-900">{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
           <label className="text-xs text-[var(--text-secondary)] mb-1 block">{formConfig.nameLabel}</label>
           <input
             required
             value={formData.name}
             onChange={(e) => setFormData({...formData, name: e.target.value})}
             placeholder={formConfig.namePlaceholder}
             className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] outline-none"
           />
        </div>

        <div>
           <label className="text-xs text-[var(--text-secondary)] mb-1 block">{formConfig.tickerLabel}</label>
           <input
             required={formData.type !== 'gold'}
             value={formData.ticker}
             onChange={(e) => setFormData({...formData, ticker: e.target.value.toUpperCase()})}
             placeholder={formConfig.tickerPlaceholder}
             className="w-full px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] outline-none uppercase font-mono"
           />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="text-xs text-[var(--text-secondary)] mb-1 block">Harga Beli (Average) {inputCurrency === 'USD' ? '($)' : '(Rp)'} <HelperTooltip text="Harga rata-rata pembelian per unit aset. Gunakan angka & koma." /></label>
             <FormattedInput
                value={formData.avgBuyPrice}
                onChange={(val) => handleInputChange("avgBuyPrice", val)}
                placeholder="0"
                currency={inputCurrency}
                exchangeRate={exchangeRate}
                className="w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] outline-none"
             />
           </div>
           <div>
             <label className="text-xs text-[var(--text-secondary)] mb-1 block">Harga Sekarang {inputCurrency === 'USD' ? '($)' : '(Rp)'} <HelperTooltip text="Harga pasar terkini per unit aset. Data ini untuk estimasi profit." /></label>
             <FormattedInput
                value={formData.currentPrice}
                onChange={(val) => handleInputChange("currentPrice", val)}
                placeholder="0"
                currency={inputCurrency}
                exchangeRate={exchangeRate}
                className="w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] outline-none"
             />
           </div>
        </div>

        <div>
           <label className="text-xs text-[var(--text-secondary)] mb-1 block">{formConfig.amountLabel} <HelperTooltip text={formConfig.amountTooltip} /></label>
           <FormattedInput
              value={formData.amount}
              onChange={(val) => handleInputChange("amount", val)}
              placeholder={formConfig.amountPlaceholder}
              className="w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] outline-none"
           />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-[var(--primary)]/20"
          >
            Simpan Portfolio
          </button>
        </div>
      </form>
    </motion.div>
  );

  // --- RENDER ---
  return (
    <div className="space-y-6 pb-20">
      
      {/* 0. FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
         <button
            onClick={() => setFilterCategory("all")}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
               filterCategory === "all"
                  ? "bg-white text-black border-white"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--glass-border)] hover:border-white/20"
            }`}
         >
            <div className="flex items-center gap-2">
               <HugeiconsIcon icon={FilterHorizontalIcon} size={14} />
               <span>Semua Aset</span>
            </div>
         </button>
         
         <div className="w-[1px] h-6 bg-[var(--glass-border)] mx-1" />

         {ASSET_TYPES.filter(t => t.id !== 'other').map(type => (
            <button
               key={type.id}
               onClick={() => setFilterCategory(type.id)}
               className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-2 ${
                  filterCategory === type.id
                     ? `bg-[${type.color}] text-white border-[${type.color}]` // Fallback color logic handled better below
                     : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--glass-border)] hover:border-white/20"
               }`}
               style={filterCategory === type.id ? { backgroundColor: type.color, borderColor: type.color } : {}}
            >
               <HugeiconsIcon icon={type.icon} size={14} />
               <span>{type.label}</span>
            </button>
         ))}
      </div>

      {/* 2. PORTFOLIO SUMMARY (DYNAMIC) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <p className="text-[var(--text-secondary)] text-sm mb-1">
               Total Portfolio Value {filterCategory !== 'all' && <span className="text-white/50 bg-white/10 px-1.5 py-0.5 rounded text-[10px] ml-2 uppercase">{filterCategory}</span>}
            </p>
            <h2 className="text-3xl font-bold text-white mb-2">
              {formatCurrency(filteredStats.totalCurrentValue)}
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Modal: <span className="text-white ml-1">{formatCurrency(filteredStats.totalInvested)}</span>
            </p>
          </div>
        </motion.div>

        {/* PnL Card */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className={`p-5 rounded-2xl border relative overflow-hidden group ${
             filteredStats.totalPnL >= 0 
               ? "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/20" 
               : "bg-gradient-to-br from-rose-500/20 to-red-500/10 border-rose-500/20"
           }`}
        >
          <div className="relative z-10">
            <p className="text-[var(--text-secondary)] text-sm mb-1">Unrealized PnL</p>
            <h2 className={`text-3xl font-bold mb-2 ${filteredStats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {filteredStats.totalPnL >= 0 ? "+" : ""}{formatCurrency(filteredStats.totalPnL)}
            </h2>
            <div className={`flex items-center gap-1 text-sm ${filteredStats.totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
               <HugeiconsIcon icon={Analytics01Icon} size={16} />
               <span>{filteredStats.pnlPercentage.toFixed(2)}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 1. WALLET BALANCE SECTION (Reordered: Below Summary?? Or User wanted filters to affect this?) */}
      {/* User Logic: "kalau ada platform yang ga saya masukin depositnya ya ga usah dibuatkan card box saldonya" */}
      {/* Logic: Show ONLY wallets with Balance > 0 OR if we are filtering specific category, show that wallet? */}
      {/* Let's follow "Balance > 0" rule globally. Plus "Add Deposit" button at end. */}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         {ASSET_TYPES.filter(t => t.id !== 'other').map(type => {
            const bal = getWalletBalance(type.id);
            // Hide if 0 balance, UNLESS it's the currently ACTIVE filter? 
            // Better: Always hide 0 balance, rely on "Add Deposit" button to fund.
            if (bal <= 0) return null;
            
            // If filter is active (e.g. Crypto), should we hide Stock wallet? 
            // User: "ketika saya pilih saham yang keluar adalah data investasi saham"
            // So YES, we should filter wallets too.
            if (filterCategory !== 'all' && filterCategory !== type.id) return null;

            return (
               <div key={type.id} className="p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)] relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                     <div className="p-2 rounded-lg bg-black/20 text-white">
                        <HugeiconsIcon icon={type.icon} size={18} />
                     </div>
                     <button 
                        onClick={() => { setDepositForm(prev => ({...prev, type: type.id})); setShowDepositModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--primary)] transition-colors opacity-0 group-hover:opacity-100"
                     >
                        <HugeiconsIcon icon={Add01Icon} size={16} />
                     </button>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">{type.label} Wallet</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(bal)}</p>
               </div>
            )
         })}
         
         {/* GLOBAL ADD DEPOSIT BUTTON */}
         {/* Shown when we might want to add funds to a new wallet */}
         <button 
            onClick={() => { setDepositForm(prev => ({...prev, type: filterCategory !== 'all' ? filterCategory : 'crypto'})); setShowDepositModal(true); }}
            className="p-4 rounded-xl border border-dashed border-[var(--glass-border)] bg-transparent hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-white group"
         >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
               <HugeiconsIcon icon={Add01Icon} size={20} />
            </div>
            <span className="text-xs font-medium">New Deposit</span>
         </button>
      </div>

 
      {/* 3. TABS */}
      <div className="border-b border-[var(--glass-border)]">
        <div className="flex gap-6 overflow-x-auto noscrollbar">
          {["holdings", "analysis", "history", "calculator"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium whitespace-nowrap transition-colors relative ${
                activeTab === tab
                  ? "text-[var(--primary)]"
                  : "text-[var(--text-secondary)] hover:text-white"
              }`}
            >
              {tab === "holdings" && "Holdings"}
              {tab === "analysis" && "Chart & Analysis"}
              {tab === "history" && "History"}
              {tab === "calculator" && "Calculator"}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. TAB CONTENT */}
      <AnimatePresence mode="wait">
          
          {/* --- TAB: HOLDINGS --- */}
          {activeTab === "holdings" && (
            <motion.div
              key="holdings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
      {/* Portfolio Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                 Investment Portfolio
              </h2>
              <button onClick={() => setShowSettings(!showSettings)} className="ml-2 p-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-white transition-colors">
                 <HugeiconsIcon icon={Analytics01Icon} size={16} />
              </button>
           </div>
           
           {/* Currency Settings Panel (Collapsible) */}
           <AnimatePresence>
             {showSettings && (
               <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                 <div className="mt-2 text-sm flex items-center gap-3 bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--glass-border)] w-fit shadow-sm">
                    <span className="text-[var(--text-secondary)] font-medium">Input Mode:</span>
                    <div className="flex bg-black/30 rounded-lg p-1">
                       <button onClick={() => setInputCurrency('IDR')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${inputCurrency === 'IDR' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'}`}>IDR</button>
                       <button onClick={() => setInputCurrency('USD')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${inputCurrency === 'USD' ? 'bg-[var(--primary)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-white'}`}>USD</button>
                    </div>
                    {inputCurrency === 'USD' && (
                       <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                          <span className="text-[var(--text-secondary)]">1 USD = Rp</span>
                          <input 
                             type="number" 
                             value={exchangeRate} 
                             onChange={(e) => setExchangeRate(Number(e.target.value))}
                             className="w-24 bg-transparent border-b border-white/20 text-white outline-none text-right font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                          />
                       </div>
                    )}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
           <p className="text-[var(--text-secondary)] mt-1">
              Pantau aset masa depanmu
           </p>
   </div>
      </div>
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">All Assets</h3>
                  <button 
                     onClick={() => { resetForm(); setShowAddModal(true); }}
                     className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm hover:brightness-110 shadow-lg shadow-[var(--primary)]/20"
                  >
                     <HugeiconsIcon icon={Add01Icon} size={16} />
                     <span>Add Asset</span>
                  </button>
               </div>

              {filteredHoldings.length === 0 ? (
                <div className="text-center py-20 text-[var(--text-secondary)]">
                   <HugeiconsIcon icon={MoneyBag02Icon} size={48} className="mx-auto mb-4 opacity-20" />
                   <p>Belum ada aset investasi. Mulai koleksi sekarang!</p>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                   {filteredHoldings.map(item => {
                     const current = parseFloat(item.currentPrice) * parseFloat(item.amount);
                     const invested = parseFloat(item.avgBuyPrice) * parseFloat(item.amount);
                     const pnl = current - invested;
                     const isProfit = pnl >= 0;
                     const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
                     const platformDisplay = PLATFORMS.includes(item.platform) ? item.platform : "Other";

                     return (
                       <motion.div 
                         key={item.id}
                         layout
                         className="p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--glass-border)] hover:border-[var(--primary)] transition-all group relative"
                       >
                         {/* Header */}
                         <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                             <div 
                               className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner" 
                               style={{ backgroundColor: getTypeColor(item.type) }}
                             >
                               {item.name.charAt(0)}
                             </div>
                             <div>
                               <div className="flex items-center gap-2">
                                 <h4 className="font-bold text-white truncate max-w-[100px]">{item.ticker || item.name}</h4>
                                 <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wide bg-white/5 text-[var(--text-secondary)] border border-white/5">
                                   {platformDisplay}
                                 </span>
                               </div>
                               <p className="text-xs text-[var(--text-secondary)] truncate max-w-[120px]">{item.name}</p>
                             </div>
                           </div>
                           
                           <div className="text-right">
                             <div className={`font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
                               {isProfit ? "+" : ""}{formatCurrency(current)}
                             </div>
                             <div className={`text-[10px] flex items-center justify-end gap-1 ${isProfit ? "text-emerald-500" : "text-rose-500"}`}>
                               <span>{pnlPercent.toFixed(2)}% ({formatCurrency(pnl)})</span>
                             </div>
                           </div>
                         </div>

                         {/* Details */}
                         <div className="mt-2 pt-3 border-t border-[var(--glass-border)] grid grid-cols-2 gap-4">
                            <div>
                               <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Qty</p>
                               <p className="text-sm text-white font-medium">{formatNumber(item.amount)}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Avg Price</p>
                               <p className="text-sm text-white font-medium">{formatCurrency(item.avgBuyPrice)}</p>
                            </div>
                         </div>
                         
                         {/* Actions */}
                         <div className="mt-4 flex gap-2">
                             <button
                               onClick={() => { setSellData({id: item.id, sellPrice: "", amount: ""}); setShowSellModal(true); }}
                               className="flex-1 py-2 rounded-lg text-xs font-bold bg-white/5 text-[var(--text-secondary)] hover:bg-rose-500 hover:text-white transition-colors"
                             >
                                SELL / TP
                             </button>
                             <div className="flex gap-2">
                                <button 
                                  onClick={() => startEdit(item)}
                                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-slate-700"
                                >
                                  <HugeiconsIcon icon={Edit02Icon} size={16} />
                                </button>
                                    <button 
                                       onClick={(e) => { 
                                          e.stopPropagation(); 
                                          setDeleteConfig({ 
                                             isOpen: true, 
                                             id: item.id, 
                                             type: 'asset', 
                                             title: "Hapus Aset?", 
                                             message: "Aset ini akan dihapus dari portfolio Anda secara permanen." 
                                          }); 
                                       }}
                                       className="p-2 hover:bg-white/10 rounded-lg text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                                </button>
                             </div>
                         </div>
                       </motion.div>
                     );
                   })}
                </div>
              )}
            </motion.div>
          )}

          {/* --- TAB: ANALYSIS --- */}
          {activeTab === "analysis" && (
             <motion.div
               key="analysis"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="grid md:grid-cols-2 gap-6"
             >
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--glass-border)] text-center h-[400px] flex flex-col">
                   <h3 className="text-lg font-bold text-white mb-4">Asset Allocation</h3>
                   <div className="flex-1 relative">
                      {allocationData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                  data={allocationData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                              >
                                  {allocationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                  ))}
                              </Pie>
                              <RechartsTooltip 
                                 contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                                 itemStyle={{ color: '#fff' }}
                                 formatter={(value) => formatCurrency(value)}
                              />
                            </PieChart>
                        </ResponsiveContainer>
                      ) : (
                         <div className="flex h-full items-center justify-center text-[var(--text-secondary)]">No Data</div>
                      )}
                   </div>
                   <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {allocationData.map(d => (
                         <div key={d.name} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}} />
                             <span>{d.name} ({(d.value / (filteredStats.totalCurrentValue || 1) * 100).toFixed(1)}%)</span>
                         </div>
                      ))}
                   </div>
                </div>
                
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--glass-border)] flex flex-col items-center justify-center text-center opacity-75 min-h-[400px]">
                    <HugeiconsIcon icon={ChartHistogramIcon} size={48} className="text-[var(--primary)] mb-4" />
                    <h3 className="text-white font-bold mb-2">Portfolio History</h3>
                    <p className="text-sm text-[var(--text-secondary)] max-w-xs">
                       Grafik performa portfolio akan tersedia setelah Anda memiliki cukup riwayat transaksi.
                    </p>
                </div>
             </motion.div>
          )}

          {/* --- TAB: HISTORY --- */}
          {activeTab === "history" && (
             <motion.div
               key="history"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[var(--bg-card)]"
             >
                {/* Header Action */}
                {transactions.length > 0 && (
                   <div className="p-4 border-b border-[var(--glass-border)] flex justify-end">
                      <button 
                         onClick={() => setDeleteConfig({
                            isOpen: true,
                            id: 'ALL',
                            type: 'history_all',
                            title: "Bersihkan Semua Riwayat?",
                            message: "Semua data riwayat transaksi akan dihapus permanen. Tindakan ini tidak dapat dibatalkan."
                         })}
                         className="text-xs text-rose-400 hover:text-rose-300 font-bold px-3 py-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                      >
                         <HugeiconsIcon icon={Delete02Icon} size={14} />
                         <span>Clear History</span>
                      </button>
                   </div>
                )}
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-black/20 text-[var(--text-secondary)]">
                         <tr>
                            <th className="p-4 font-medium whitespace-nowrap">Date</th>
                            <th className="p-4 font-medium whitespace-nowrap">Type</th>
                            <th className="p-4 font-medium whitespace-nowrap">Asset / Info</th>
                            <th className="p-4 font-medium text-right whitespace-nowrap">Amount</th>
                             <th className="p-4 font-medium text-right whitespace-nowrap">Price</th>
                             <th className="p-4 font-medium text-right whitespace-nowrap">Total Value</th>
                             <th className="p-4 font-medium text-center w-10">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[var(--glass-border)]">
                           {/* Add Clear All Button Row if needed, or put it outside. Putting outside is better but table structure... */}
                         {filteredTransactions.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-[var(--text-secondary)]">Belum ada riwayat transaksi</td></tr>
                         ) : filteredTransactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                               <td className="p-4 text-[var(--text-secondary)]">
                                  {tx.date?.seconds ? new Date(tx.date.seconds * 1000).toLocaleDateString() : '-'}
                               </td>
                               <td className="p-4">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                     tx.type === 'SELL' ? 'bg-rose-500/20 text-rose-400' :
                                     tx.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' :
                                     'bg-blue-500/20 text-blue-400'
                                  }`}>
                                     {tx.type}
                                  </span>
                               </td>
                               <td className="p-4 text-white font-medium">{tx.assetName || '-'}</td>
                               <td className="p-4 text-right text-white">{formatNumber(tx.amount)}</td>
                               <td className="p-4 text-right text-[var(--text-secondary)]">
                                  {['DEPOSIT', 'RESET'].includes(tx.type) ? '-' : formatCurrency(tx.price)}
                               </td>
                               <td className="p-4 text-right font-medium text-white">{formatCurrency(tx.total)}</td>
                               <td className="p-4 text-center">
                                  <button 
                                     onClick={() => setDeleteConfig({
                                         isOpen: true,
                                         id: tx.id,
                                         type: 'history',
                                         title: "Hapus Riwayat?",
                                         message: "Data transaksi ini akan dihapus."
                                     })}
                                     className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--text-secondary)] hover:text-rose-400 transition-colors"
                                  >
                                      <HugeiconsIcon icon={Delete02Icon} size={16} />
                                  </button>
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </motion.div>
          )}

          {/* --- TAB: CALCULATOR --- */}
          {activeTab === "calculator" && (
            <motion.div
              key="calculator"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto"
            >
              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--glass-border)]">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <HugeiconsIcon icon={Task01Icon} size={20} className="text-[var(--primary)]" />
                   Profit Simulator
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6">
                  &quot;Kalau saya beli di harga X, lalu jual di harga Y, berapa untung saya?&quot;
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Harga Beli (Buy Price) <HelperTooltip text="Harga pembelian awal per unit untuk simulasi." /></label>
                    <FormattedInput
                       value={calcData.buyPrice}
                       onChange={(val) => handleCalcChange("buyPrice", val)}
                       placeholder="0"
                       prefix="Rp"
                       className="w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Jumlah Aset (Amount) <HelperTooltip text="Jumlah unit yang ingin disimulasikan." /></label>
                    <FormattedInput
                       value={calcData.amount}
                       onChange={(val) => handleCalcChange("amount", val)}
                       placeholder="0.00"
                       className="w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[var(--text-secondary)] mb-1 block">Target Harga Jual (Sell Price) <HelperTooltip text="Target harga jual per unit untuk melihat potensi profit." /></label>
                    <FormattedInput
                       value={calcData.targetPrice}
                       onChange={(val) => handleCalcChange("targetPrice", val)}
                       placeholder="0"
                       prefix="Rp"
                       className="w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white focus:border-[var(--primary)] outline-none transition-colors"
                    />
                  </div>
                </div>

                {calcData.buyPrice && calcData.targetPrice && (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-3 mt-6"
                   >
                     <div className={`p-4 rounded-xl border ${
                        scenarioResult.totalProfit >= 0 
                          ? "bg-emerald-500/10 border-emerald-500/20" 
                          : "bg-rose-500/10 border-rose-500/20"
                     }`}>
                       <p className="text-xs text-[var(--text-secondary)] text-center mb-1">Estimasi Profit / Loss</p>
                       <h2 className={`text-3xl font-bold text-center ${
                         scenarioResult.totalProfit >= 0 ? "text-emerald-400" : "text-rose-400"
                       }`}>
                         {scenarioResult.totalProfit >= 0 ? "+" : ""}{formatNumber(scenarioResult.totalProfit)}
                       </h2>
                       <p className={`text-center text-sm font-medium mt-1 ${
                         scenarioResult.totalProfit >= 0 ? "text-emerald-500" : "text-rose-500"
                       }`}>
                         {scenarioResult.percent.toFixed(2)}%
                       </p>
                     </div>

                     <div className={`p-4 rounded-xl border border-[var(--glass-border)] ${recommendation.bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <HugeiconsIcon icon={AnalysisTextLinkIcon} size={18} className={recommendation.color} />
                          <span className={`font-bold text-sm ${recommendation.color}`}>{recommendation.text}</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {recommendation.desc}
                        </p>
                        {scenarioResult.percent < 0 && (
                          <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10 text-xs text-[var(--text-secondary)]">
                            <span className="opacity-70">Saran: </span>
                            Harga minimal Break Even: <span className="text-white font-medium">{formatCurrency(parseFloat(calcData.buyPrice))}</span>
                          </div>
                        )}
                     </div>
                   </motion.div>
                )}
              </div>
            </motion.div>
          )}
      </AnimatePresence>

      {/* --- ADD/EDIT MODAL --- */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
             {ModalContent}
          </div>
        )}
      </AnimatePresence>

      {/* --- DEPOSIT MODAL --- */}
      {showDepositModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowDepositModal(false)}>
            <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] w-full max-w-sm rounded-2xl p-6" onClick={e => e.stopPropagation()}>
               <h3 className="text-xl font-bold text-white mb-4">Atur Saldo Wallet</h3>
               
               {/* Mode Toggle */}
               <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-xl">
                  <button 
                     type="button"
                     onClick={() => setDepositMode('add')}
                     className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${depositMode === 'add' ? 'bg-[var(--primary)] text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
                  >
                     Top Up (+)
                  </button>
                  <button 
                     type="button"
                     onClick={() => setDepositMode('set')}
                     className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${depositMode === 'set' ? 'bg-amber-500 text-white shadow-lg' : 'text-[var(--text-secondary)] hover:text-white'}`}
                  >
                     Atur Ulang (=)
                  </button>
               </div>

               <form onSubmit={handleDeposit} className="space-y-4">
                  <div>
                     <label className="text-xs text-[var(--text-secondary)] mb-1 block">Ke Wallet</label>
                     <div className="px-4 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white capitalize">
                        {ASSET_TYPES.find(t => t.id === depositForm.type)?.label} Wallet
                     </div>
                  </div>
                   <div>
                      <label className="text-xs text-[var(--text-secondary)] mb-1 block">Jumlah Deposit {inputCurrency === 'USD' ? '($)' : '(IDR)'} <HelperTooltip text="Nominal uang tunai yang ingin didepositkan ke wallet." /></label>
                      <FormattedInput 
                         value={depositForm.amount} 
                         onChange={val => setDepositForm({...depositForm, amount: parseInput(val)})} 
                         currency={inputCurrency}
                         exchangeRate={exchangeRate}
                         placeholder="0" 
                         className="w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white outline-none focus:border-[var(--primary)]" 
                      />
                   </div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-[var(--primary)] text-white font-bold hover:brightness-110">
                     Konfirmasi Deposit
                  </button>
               </form>
            </div>
         </div>
      )}

      {/* --- SELL MODAL --- */}
      {showSellModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSellModal(false)}>
            <div className="bg-[var(--bg-card)] border border-[var(--glass-border)] w-full max-w-sm rounded-2xl p-6" onClick={e => e.stopPropagation()}>
               <h3 className="text-xl font-bold text-white mb-4 text-rose-400">Jual Aset (Sell)</h3>
               <form onSubmit={handleSell} className="space-y-4">
                  <div>
                     <label className="text-xs text-[var(--text-secondary)] mb-1 block">Harga Jual (per unit) {inputCurrency === 'USD' ? '($)' : '(Rp)'} <HelperTooltip text="Harga jual per unit saat ini." /></label>
                     <FormattedInput 
                        value={sellData.sellPrice} 
                        onChange={val => setSellData({...sellData, sellPrice: parseInput(val)})} 
                        currency={inputCurrency}
                        exchangeRate={exchangeRate}
                        placeholder="0" 
                        className="w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white outline-none focus:border-[var(--primary)]" 
                     />
                  </div>
                  <div>
                     <label className="text-xs text-[var(--text-secondary)] mb-1 block">Jumlah yang dijual <HelperTooltip text="Jumlah unit unit aset yang akan dijual." /></label>
                     <FormattedInput 
                        value={sellData.amount} 
                        onChange={val => setSellData({...sellData, amount: parseInput(val)})} 
                        placeholder="0.00" 
                        className="w-full py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--glass-border)] text-white outline-none focus:border-[var(--primary)]" 
                     />
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded-lg text-xs text-blue-200">
                     <p>Estimasi Terima: <span className="font-bold">{formatCurrency((parseFloat(sellData.sellPrice.replace(/,/g, ".") || 0) * parseFloat(sellData.amount.replace(/,/g, ".") || 0)))}</span></p>
                     <p className="mt-1 opacity-75">Saldo akan masuk ke wallet Anda.</p>
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-rose-500 text-white font-bold hover:brightness-110">
                     Konfirmasi Jual
                  </button>
               </form>
            </div>
         </div>
      )}

      <ConfirmModal
        isOpen={deleteConfig.isOpen}
        onClose={() => setDeleteConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleDelete}
        title={deleteConfig.title}
        message={deleteConfig.message}
        confirmText={deleteConfig.type === 'history_all' ? 'Bersihkan Semua' : 'Hapus Permanen'}
        type="danger"
      />

      {/* --- CUSTOM ALERT MODAL --- */}
      <ConfirmModal
        isOpen={alertState.isOpen}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
        onConfirm={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
        title={alertState.title}
        message={alertState.message}
        confirmText="Mengerti"
        singleButton={true}
        type={alertState.type}
      />
    </div>
  );
};

export default InvestmentPortfolio;
