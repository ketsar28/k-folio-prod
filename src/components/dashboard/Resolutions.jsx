import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Tick02Icon,
  Target01Icon,
  Calendar01Icon,
  Edit02Icon,
  Cancel01Icon,
  Tick01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  FilterIcon
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
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../ui/ConfirmModal";

const CATEGORIES = [
  { id: "career", label: "Karir", color: "#10b981" },
  { id: "health", label: "Kesehatan", color: "#22c55e" },
  { id: "finance", label: "Keuangan", color: "#f59e0b" },
  { id: "personal", label: "Personal", color: "#ec4899" },
  { id: "learning", label: "Belajar", color: "#8b5cf6" },
  { id: "spiritual", label: "Spiritual", color: "#06b6d4" },
  { id: "relationship", label: "Hubungan", color: "#f43f5e" },
  { id: "technology", label: "Teknologi", color: "#3b82f6" },
  { id: "creative", label: "Kreativitas", color: "#a855f7" },
  { id: "travel", label: "Travel", color: "#14b8a6" },
  { id: "lifestyle", label: "Lifestyle", color: "#f97316" },
  { id: "other", label: "Lainnya", color: "#6b7280" },
];

// Generate years from 2024 to 2035
const YEARS = Array.from({ length: 12 }, (_, i) => 2024 + i);

const Resolutions = () => {
  const { user } = useAuth();
  const [resolutions, setResolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [filterYear, setFilterYear] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "career",
    year: new Date().getFullYear(),
    month: null,
    targetDate: "",
    progress: 0,
    milestones: "",
  });

  // Subscribe to resolutions
  useEffect(() => {
    if (!user) return;

    const resRef = collection(db, "users", user.uid, "resolutions");
    const q = query(resRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResolutions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "career",
      year: new Date().getFullYear(),
      month: null,
      targetDate: "",
      progress: 0,
      milestones: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !user) return;

    try {
      if (editingId) {
        const resRef = doc(db, "users", user.uid, "resolutions", editingId);
        await updateDoc(resRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        const resRef = collection(db, "users", user.uid, "resolutions");
        await addDoc(resRef, {
          ...formData,
          completed: false,
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving resolution:", error);
    }
  };

  const toggleComplete = async (res) => {
    if (!user) return;
    try {
      const resRef = doc(db, "users", user.uid, "resolutions", res.id);
      await updateDoc(resRef, {
        completed: !res.completed,
        progress: !res.completed ? 100 : res.progress,
      });
    } catch (error) {
      console.error("Error updating resolution:", error);
    }
  };

  const updateProgress = async (res, newProgress) => {
    if (!user) return;
    try {
      const resRef = doc(db, "users", user.uid, "resolutions", res.id);
      await updateDoc(resRef, {
        progress: newProgress,
        completed: newProgress === 100,
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const confirmDelete = (resId) => {
    setDeleteId(resId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteId && user) {
      try {
        const resRef = doc(db, "users", user.uid, "resolutions", deleteId);
        await deleteDoc(resRef);
        setDeleteId(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting resolution:", error);
      }
    }
  };

  const startEdit = (res) => {
    setFormData({
      title: res.title,
      description: res.description || "",
      category: res.category,
      year: res.year,
      month: res.month,
      targetDate: res.targetDate || "",
      progress: res.progress || 0,
      milestones: res.milestones || "",
    });
    setEditingId(res.id);
    setIsAdding(true);
  };

  const getCategoryColor = (categoryId) => {
    return CATEGORIES.find((c) => c.id === categoryId)?.color || "#6b7280";
  };

  const getCategoryLabel = (categoryId) => {
    return CATEGORIES.find((c) => c.id === categoryId)?.label || categoryId;
  };

  // Filter resolutions
  const filteredResolutions = resolutions.filter((res) => {
    if (filterYear !== "all" && res.year !== parseInt(filterYear)) return false;
    if (filterCategory !== "all" && res.category !== filterCategory) return false;
    return true;
  });

  // Group by year for display
  const groupedByYear = filteredResolutions.reduce((acc, res) => {
    const year = res.year;
    if (!acc[year]) acc[year] = [];
    acc[year].push(res);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => b - a);

  const completedCount = resolutions.filter((r) => r.completed).length;
  const activeCount = resolutions.filter((r) => !r.completed).length;
  const avgProgress = resolutions.length > 0 
    ? Math.round(resolutions.reduce((sum, r) => sum + (r.progress || 0), 0) / resolutions.length)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--glass-border)]"
        >
          <p className="text-lg sm:text-2xl font-bold text-[var(--text-primary)]">{resolutions.length}</p>
          <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate">Total</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20"
        >
          <p className="text-lg sm:text-2xl font-bold text-[var(--primary)]">{activeCount}</p>
          <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate">Berlangsung</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-500/10 border border-green-500/20"
        >
          <p className="text-lg sm:text-2xl font-bold text-green-500">{completedCount}</p>
          <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate">Tercapai</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20"
        >
          <p className="text-lg sm:text-2xl font-bold text-amber-500">{avgProgress}%</p>
          <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate">Avg Progress</p>
        </motion.div>
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isAdding ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--glass-border)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base">
                {editingId ? "Edit Resolusi" : "Resolusi Baru"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-main)] transition-all"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Judul Resolusi</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Belajar bahasa Inggris"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white placeholder:text-slate-500 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Deskripsi (Opsional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Jelaskan detail resolusi Anda..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white placeholder:text-slate-500 text-sm resize-none"
                />
              </div>

              {/* Category & Year Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Tahun Target</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white text-sm"
                  >
                    {YEARS.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Month & Target Date Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Bulan (Opsional)</label>
                  <select
                    value={formData.month || ""}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white text-sm"
                  >
                    <option value="">Sepanjang Tahun</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i).toLocaleString("id-ID", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Deadline (Opsional)</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white text-sm appearance-none [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Milestones */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Milestones / Langkah-langkah (Opsional)</label>
                <textarea
                  value={formData.milestones}
                  onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
                  placeholder="Tulis langkah-langkah untuk mencapai resolusi..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white placeholder:text-slate-500 text-sm resize-none"
                />
              </div>

              {/* Progress Slider (only for edit) */}
              {editingId && (
                <div>
                  <label className="text-xs text-[var(--text-secondary)] mb-2 block">
                    Progress: <span className="text-[var(--primary)] font-semibold">{formData.progress}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 rounded-xl bg-slate-700 text-[var(--text-secondary)] font-medium text-sm hover:bg-slate-600 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-medium flex items-center justify-center gap-2 text-sm"
              >
                <HugeiconsIcon icon={editingId ? Tick02Icon : Add01Icon} size={16} />
                <span>{editingId ? "Update" : "Simpan"}</span>
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsAdding(true)}
            className="w-full py-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-[var(--glass-border)] hover:border-[var(--primary)] text-[var(--text-secondary)] hover:text-[var(--primary)] font-medium flex items-center justify-center gap-2 transition-all text-sm"
          >
            <HugeiconsIcon icon={Add01Icon} size={20} />
            <span>Tambah Resolusi Baru</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <HugeiconsIcon icon={FilterIcon} size={16} className="text-[var(--text-secondary)] shrink-0" />
          
          {/* Year Filter */}
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-secondary)] text-xs outline-none"
          >
            <option value="all">Semua Tahun</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-secondary)] text-xs outline-none"
          >
            <option value="all">Semua Kategori</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Resolutions List - Grouped by Year */}
      <div className="space-y-6">
        <AnimatePresence>
          {sortedYears.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 sm:py-16"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center">
                <HugeiconsIcon icon={Target01Icon} size={28} className="text-[var(--text-secondary)]" />
              </div>
              <p className="text-[var(--text-secondary)] text-sm">Belum ada resolusi</p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-1">Mulai dengan menambahkan resolusi pertama!</p>
            </motion.div>
          ) : (
            sortedYears.map((year) => (
              <div key={year} className="space-y-3">
                {/* Year Header */}
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[var(--primary)]">{year}</h3>
                  <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-card)] px-2 py-0.5 rounded">
                    {groupedByYear[year].length} resolusi
                  </span>
                </div>

                {/* Resolutions for this year */}
                {groupedByYear[year].map((res, index) => (
                  <motion.div
                    key={res.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className={`group rounded-xl sm:rounded-2xl border overflow-hidden transition-all ${
                      res.completed
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-[var(--bg-card)]/80 backdrop-blur-xl border-[var(--glass-border)]"
                    }`}
                  >
                    {/* Main Row */}
                    <div className="flex items-start gap-3 p-3 sm:p-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleComplete(res)}
                        className={`shrink-0 w-6 h-6 mt-0.5 rounded-lg border-2 flex items-center justify-center transition-all ${
                          res.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-[var(--glass-border)] hover:border-[var(--primary)]"
                        }`}
                      >
                        {res.completed && <HugeiconsIcon icon={Tick01Icon} size={14} />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: getCategoryColor(res.category) }}
                          />
                          <span
                            className={`font-medium text-sm ${
                              res.completed ? "text-[var(--text-secondary)] line-through" : "text-[var(--text-primary)]"
                            }`}
                          >
                            {res.title}
                          </span>
                        </div>
                        
                        {/* Meta Info */}
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--text-secondary)] flex-wrap">
                          <span 
                            className="px-2 py-0.5 rounded font-medium"
                            style={{ backgroundColor: getCategoryColor(res.category) + "20", color: getCategoryColor(res.category) }}
                          >
                            {getCategoryLabel(res.category)}
                          </span>
                          <span className="flex items-center gap-1">
                            <HugeiconsIcon icon={Calendar01Icon} size={12} />
                            {res.month
                              ? `${new Date(2000, res.month - 1).toLocaleString("id-ID", { month: "short" })} ${res.year}`
                              : res.year}
                          </span>
                          {res.targetDate && (
                            <span className="text-amber-400">
                              Deadline: {new Date(res.targetDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {!res.completed && (res.progress || 0) > 0 && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-[10px] text-[var(--text-secondary)] mb-1">
                              <span>Progress</span>
                              <span>{res.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[var(--primary)] rounded-full transition-all"
                                style={{ width: `${res.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                        {(res.description || res.milestones) && (
                          <button
                            onClick={() => setExpandedId(expandedId === res.id ? null : res.id)}
                            className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-main)] transition-all"
                          >
                            <HugeiconsIcon icon={expandedId === res.id ? ArrowUp01Icon : ArrowDown01Icon} size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(res)}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all"
                        >
                          <HugeiconsIcon icon={Edit02Icon} size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(res.id)}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedId === res.id && (res.description || res.milestones) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 overflow-hidden"
                        >
                          <div className="pl-9 space-y-3">
                            {res.description && (
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Deskripsi</p>
                                <p className="text-xs text-[var(--text-primary)] bg-[var(--bg-main)] p-3 rounded-lg">
                                  {res.description}
                                </p>
                              </div>
                            )}
                            {res.milestones && (
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-1">Milestones</p>
                                <pre className="text-xs text-[var(--text-primary)] bg-[var(--bg-main)] p-3 rounded-lg whitespace-pre-wrap font-sans">
                                  {res.milestones}
                                </pre>
                              </div>
                            )}
                            
                            {/* Quick Progress Update */}
                            {!res.completed && (
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2">Update Progress</p>
                                <div className="flex gap-2 flex-wrap">
                                  {[0, 25, 50, 75, 100].map((val) => (
                                    <button
                                      key={val}
                                      onClick={() => updateProgress(res, val)}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        (res.progress || 0) === val
                                          ? "bg-[var(--primary)] text-white"
                                          : "bg-[var(--bg-main)] text-[var(--text-secondary)] hover:text-[var(--primary)]"
                                      }`}
                                    >
                                      {val}%
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ))
          )}
        </AnimatePresence>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Hapus Resolusi?"
        message="Resolusi ini akan dihapus permanen dari target kamu."
        confirmText="Hapus"
        type="danger"
      />
    </div>
  );
};

export default Resolutions;
