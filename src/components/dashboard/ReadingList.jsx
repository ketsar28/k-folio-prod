import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  Search01Icon,
  GithubIcon, // For GitHub source
  Book01Icon, // For Physical Book
  SmartPhone01Icon, // For E-Book
  NewsIcon, // For Articles
  HeadphonesIcon, // For Audiobooks
  Tick02Icon,
  Cancel01Icon,
  Link01Icon
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

const SOURCES = [
  { id: "physical", label: "Buku Fisik", icon: Book01Icon, color: "#f59e0b" }, // Amber
  { id: "ebook", label: "E-Book", icon: SmartPhone01Icon, color: "#3b82f6" }, // Blue
  { id: "github", label: "GitHub", icon: GithubIcon, color: "#ffffff" }, // White
  { id: "article", label: "Artikel", icon: NewsIcon, color: "#10b981" }, // Emerald
  { id: "audiobook", label: "Audiobook", icon: HeadphonesIcon, color: "#ec4899" }, // Pink
];

const STATUSES = [
  { id: "want_to_read", label: "Ingin Baca", color: "#9ca3af" },
  { id: "reading", label: "Sedang Baca", color: "#3b82f6" },
  { id: "completed", label: "Selesai", color: "#10b981" },
  { id: "on_hold", label: "Ditunda", color: "#f59e0b" },
];

const ReadingList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    source: "physical",
    status: "want_to_read",
    currentProgress: 0,
    totalProgress: 100, // Pages, Chapters, or %
    unit: "page", // page, chapter, percent
    url: "",
    notes: "",
  });

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "reading_list"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBooks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      source: "physical",
      status: "want_to_read",
      currentProgress: 0,
      totalProgress: 100,
      unit: "page",
      url: "",
      notes: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !user) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "users", user.uid, "reading_list", editingId), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "users", user.uid, "reading_list"), {
          ...formData,
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const deleteBook = async (id) => {
    if (!user) return;
    if (confirm("Hapus buku ini dari daftar?")) {
      await deleteDoc(doc(db, "users", user.uid, "reading_list", id));
    }
  };

  const startEdit = (book) => {
    setFormData({ ...book });
    setEditingId(book.id);
    setIsAdding(true);
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || book.status === filterStatus;
    const matchesSource = filterSource === "all" || book.source === filterSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getSourceConfig = (id) => SOURCES.find(s => s.id === id) || SOURCES[0];
  const getStatusConfig = (id) => STATUSES.find(s => s.id === id) || STATUSES[0];
  
  const calculatePercent = (current, total) => {
    if (!total || total <= 0) return 0;
    return Math.min(100, Math.round((current / total) * 100));
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari buku atau penulis..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-xl text-sm focus:border-[var(--primary)] outline-none transition-all text-white placeholder:text-gray-500"
          />
          <HugeiconsIcon icon={Search01Icon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-lg text-xs text-gray-300 outline-none focus:border-[var(--primary)]"
          >
            <option value="all">Semua Status</option>
            {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select 
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-lg text-xs text-gray-300 outline-none focus:border-[var(--primary)]"
          >
            <option value="all">Semua Sumber</option>
            {SOURCES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Add New Button / Form */}
      <AnimatePresence>
        {isAdding ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-5 sm:p-7 bg-[var(--bg-card)]/90 backdrop-blur-2xl border border-[var(--primary)]/20 rounded-3xl space-y-5 shadow-2xl shadow-[var(--primary)]/5"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">{editingId ? "Edit Detail Bacaan" : "Mulai Petualangan Baru"}</h3>
                <p className="text-xs text-[var(--text-secondary)]">Catat progres membacamu hari ini</p>
              </div>
              <button type="button" onClick={resetForm}>
                <HugeiconsIcon icon={Cancel01Icon} size={20} className="text-gray-400 hover:text-white" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Judul Buku"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-[var(--primary)] outline-none"
                />
                <input
                  type="text"
                  placeholder="Penulis"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-[var(--primary)] outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-[var(--primary)] outline-none appearance-none"
                  >
                    {SOURCES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-[var(--primary)] outline-none appearance-none"
                  >
                    {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <input
                      type="number"
                      placeholder="Current"
                      value={formData.currentProgress}
                      onChange={(e) => setFormData({...formData, currentProgress: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-[var(--primary)] outline-none"
                    />
                  </div>
                  <div className="col-span-1">
                    <input
                      type="number"
                      placeholder="Total"
                      value={formData.totalProgress}
                      onChange={(e) => setFormData({...formData, totalProgress: parseInt(e.target.value) || 100})}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-[var(--primary)] outline-none"
                    />
                  </div>
                  <div className="col-span-1">
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-2 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-[var(--primary)] outline-none"
                    >
                      <option value="page">Hal</option>
                      <option value="chapter">Ch</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                </div>
                
                <input
                  type="url"
                  placeholder="URL (Link ke buku/artikel)"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-[var(--primary)] outline-none"
                />

                <textarea
                  placeholder="Catatan kecil..."
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:border-[var(--primary)] outline-none resize-none"
                />
              </div>
            </div>

            {/* Submit Buttons - Consistent with Tasks */}
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
                disabled={!formData.title.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm"
              >
                <HugeiconsIcon icon={editingId ? Tick02Icon : Add01Icon} size={18} />
                <span>{editingId ? "Update" : "Tambah"}</span>
              </motion.button>
            </div>
          </motion.form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-4 border-2 border-dashed border-[var(--glass-border)] rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all"
          >
            <HugeiconsIcon icon={Add01Icon} size={20} />
            <span className="font-medium">Tambah Bacaan Baru</span>
          </button>
        )}
      </AnimatePresence>

      {/* Book List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredBooks.map((book) => {
            const SourceIcon = getSourceConfig(book.source).icon;
            const progressPercent = calculatePercent(book.currentProgress, book.totalProgress);
            const statusConfig = getStatusConfig(book.status);

            return (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 bg-[var(--bg-card)]/40 backdrop-blur-sm border border-[var(--glass-border)] rounded-2xl group hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/5 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500"
                      style={{ 
                        background: `linear-gradient(135deg, ${getSourceConfig(book.source).color}15, ${getSourceConfig(book.source).color}05)`,
                        border: `1px solid ${getSourceConfig(book.source).color}25`
                      }}
                    >
                      <HugeiconsIcon 
                        icon={SourceIcon} 
                        size={20} 
                        style={{ color: getSourceConfig(book.source).color }} 
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-white text-sm sm:text-base leading-tight mb-1 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">{book.title}</h4>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] truncate">{book.author || "Penulis tidak diketahui"}</p>
                    </div>
                  </div>
                  
                  {/* Action buttons - always visible with subtle opacity */}
                  <div className="flex gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); startEdit(book); }} 
                      className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all"
                    >
                      <HugeiconsIcon icon={Edit02Icon} size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteBook(book.id); }} 
                      className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-auto mb-4">
                  <div className="flex justify-between text-xs font-semibold text-[var(--text-secondary)] mb-2">
                    <span className="flex items-center gap-1">
                      <span className="text-white">{book.currentProgress}</span>
                      <span>/ {book.totalProgress} {book.unit}</span>
                    </span>
                    <span className="text-[var(--primary)]">{progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.5)]"
                      style={{ 
                        background: `linear-gradient(90deg, ${statusConfig.color}, ${statusConfig.color}dd)`
                      }} 
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs">
                  <span 
                    className="px-2 py-0.5 rounded-md font-medium"
                    style={{ 
                      backgroundColor: `${statusConfig.color}20`,
                      color: statusConfig.color
                    }}
                  >
                    {statusConfig.label}
                  </span>
                  
                  {book.url && (
                    <a 
                      href={book.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <HugeiconsIcon icon={Link01Icon} size={14} />
                      Link
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredBooks.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500">
          <HugeiconsIcon icon={BookOpen01Icon} size={40} className="mx-auto mb-3 opacity-50" />
          <p>Belum ada buku yang ditambahkan</p>
        </div>
      )}
    </div>
  );
};

export default ReadingList;
