import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Delete02Icon,
  Tick02Icon,
  Calendar01Icon,
  Clock01Icon,
  FilterIcon,
  Flag02Icon,
  Sorting01Icon,
  Edit02Icon,
  Cancel01Icon
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
  serverTimestamp 
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const PRIORITIES = [
  { id: "low", label: "Rendah", color: "#6b7280" },
  { id: "medium", label: "Sedang", color: "#f59e0b" },
  { id: "high", label: "Tinggi", color: "#ef4444" },
];

const TodoApp = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // Subscribe to todos collection
  useEffect(() => {
    if (!user) return;

    const todosRef = collection(db, "users", user.uid, "todos");
    const q = query(todosRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const resetForm = () => {
    setNewTodo("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;

    try {
      if (editingId) {
        // Update existing todo
        const todoRef = doc(db, "users", user.uid, "todos", editingId);
        await updateDoc(todoRef, {
          text: newTodo.trim(),
          description: description.trim(),
          priority: priority,
          dueDate: dueDate || null,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Add new todo
        const todosRef = collection(db, "users", user.uid, "todos");
        await addDoc(todosRef, {
          text: newTodo.trim(),
          description: description.trim(),
          completed: false,
          priority: priority,
          dueDate: dueDate || null,
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving todo:", error);
    }
  };

  const startEdit = (todo) => {
    setNewTodo(todo.text);
    setDescription(todo.description || "");
    setDueDate(todo.dueDate || "");
    setPriority(todo.priority || "medium");
    setEditingId(todo.id);
    setShowForm(true);
  };

  // Reschedule overdue task to tomorrow
  const rescheduleToTomorrow = async (todoId) => {
    if (!user) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];
    
    try {
      const todoRef = doc(db, "users", user.uid, "todos", todoId);
      await updateDoc(todoRef, {
        dueDate: tomorrowStr,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error rescheduling:", error);
    }
  };

  const toggleTodo = async (todo) => {
    if (!user) return;
    try {
      const todoRef = doc(db, "users", user.uid, "todos", todo.id);
      await updateDoc(todoRef, {
        completed: !todo.completed,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    if (!user) return;
    try {
      const todoRef = doc(db, "users", user.uid, "todos", todoId);
      await deleteDoc(todoRef);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    if (filter === "overdue") {
      if (!todo.dueDate || todo.completed) return false;
      return new Date(todo.dueDate) < new Date().setHours(0, 0, 0, 0);
    }
    if (filter === "today") {
      if (!todo.dueDate) return false;
      const today = new Date().toISOString().split("T")[0];
      return todo.dueDate === today;
    }
    return true;
  });

  // Sort todos
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
    }
    if (sortBy === "date") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return 0;
  });

  const getPriorityColor = (priorityId) => {
    return PRIORITIES.find((p) => p.id === priorityId)?.color || "#6b7280";
  };

  const isOverdue = (todo) => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date().setHours(0, 0, 0, 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr === today.toISOString().split("T")[0]) return "Hari ini";
    if (dateStr === tomorrow.toISOString().split("T")[0]) return "Besok";
    
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined });
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;
  const overdueCount = todos.filter((t) => isOverdue(t)).length;

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
          <p className="text-lg sm:text-2xl font-bold text-[var(--text-primary)]">{todos.length}</p>
          <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate">Total</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/20"
        >
          <p className="text-lg sm:text-2xl font-bold text-[var(--primary)]">{activeCount}</p>
          <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate">Aktif</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-green-500/10 border border-green-500/20"
        >
          <p className="text-lg sm:text-2xl font-bold text-green-500">{completedCount}</p>
          <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate">Selesai</p>
        </motion.div>
        {overdueCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-red-500/10 border border-red-500/20"
          >
            <p className="text-lg sm:text-2xl font-bold text-red-500">{overdueCount}</p>
            <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate">Terlewat</p>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Todo Form */}
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--glass-border)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[var(--text-primary)] text-sm">
                {editingId ? "Edit Tugas" : "Tugas Baru"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-main)] transition-all"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </button>
            </div>

            {/* Task Name */}
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Nama tugas..."
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white placeholder:text-slate-400 text-sm"
            />

            {/* Description */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi tugas (opsional)..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white placeholder:text-slate-400 text-sm resize-none"
            />

            {/* Due Date & Priority Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Due Date */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Tanggal Target</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white text-sm appearance-none [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-xs text-[var(--text-secondary)] mb-1.5 block">Prioritas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none transition-all text-white text-sm"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 rounded-xl bg-slate-700 text-[var(--text-secondary)] font-medium text-sm hover:bg-slate-600 transition-all"
              >
                Batal
              </button>
              <motion.button
                type="submit"
                disabled={!newTodo.trim()}
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
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowForm(true)}
            className="w-full py-4 rounded-xl sm:rounded-2xl border-2 border-dashed border-[var(--glass-border)] hover:border-[var(--primary)] text-[var(--text-secondary)] hover:text-[var(--primary)] font-medium flex items-center justify-center gap-2 transition-all text-sm"
          >
            <HugeiconsIcon icon={Add01Icon} size={20} />
            <span>Tambah Tugas Baru</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Filter & Sort Row */}
      <div className="flex flex-wrap items-center gap-2 justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <HugeiconsIcon icon={FilterIcon} size={16} className="text-[var(--text-secondary)] shrink-0" />
          {[
            { id: "all", label: "Semua" },
            { id: "today", label: "Hari Ini" },
            { id: "active", label: "Aktif" },
            { id: "completed", label: "Selesai" },
            { id: "overdue", label: "Terlewat" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                filter === f.id
                  ? f.id === "overdue" ? "bg-red-500 text-white" : "bg-[var(--primary)] text-white"
                  : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Sorting01Icon} size={14} className="text-[var(--text-secondary)]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-2 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--glass-border)] text-[var(--text-secondary)] text-xs outline-none"
          >
            <option value="date">Deadline</option>
            <option value="priority">Prioritas</option>
            <option value="created">Terbaru</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-2 sm:space-y-3">
        <AnimatePresence>
          {sortedTodos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 sm:py-16"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center">
                <HugeiconsIcon icon={Clock01Icon} size={28} className="text-[var(--text-secondary)]" />
              </div>
              <p className="text-[var(--text-secondary)] text-sm">
                {filter === "all" ? "Belum ada tugas" : `Tidak ada tugas ${filter === "today" ? "hari ini" : filter === "active" ? "aktif" : filter === "overdue" ? "terlewat" : "selesai"}`}
              </p>
            </motion.div>
          ) : (
            sortedTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.03 }}
                className={`group flex items-center gap-3 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all ${
                  todo.completed
                    ? "bg-green-500/5 border-green-500/20"
                    : isOverdue(todo)
                    ? "bg-red-500/5 border-red-500/20"
                    : "bg-[var(--bg-card)]/80 backdrop-blur-xl border-[var(--glass-border)] hover:border-[var(--primary)]/30"
                }`}
              >
                {/* Priority Indicator */}
                <div
                  className="w-1 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: getPriorityColor(todo.priority) }}
                />

                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo)}
                  className={`shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    todo.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-[var(--glass-border)] hover:border-[var(--primary)]"
                  }`}
                >
                  {todo.completed && <HugeiconsIcon icon={Tick02Icon} size={14} />}
                </button>

                {/* Content */}
                <div 
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === todo.id ? null : todo.id)}
                >
                  <span
                    className={`block text-sm transition-all ${
                      todo.completed
                        ? "text-[var(--text-secondary)] line-through"
                        : "text-[var(--text-primary)]"
                    }`}
                  >
                    {todo.text}
                  </span>
                  
                  {/* Description Preview */}
                  {todo.description && expandedId !== todo.id && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1 opacity-70">
                      {todo.description}
                    </p>
                  )}
                  
                  {/* Meta Info */}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {todo.dueDate && (
                      <span className={`flex items-center gap-1 text-xs ${isOverdue(todo) ? "text-red-400" : "text-[var(--text-secondary)]"}`}>
                        <HugeiconsIcon icon={Calendar01Icon} size={12} />
                        {formatDate(todo.dueDate)}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
                      <HugeiconsIcon icon={Flag02Icon} size={12} style={{ color: getPriorityColor(todo.priority) }} />
                      {PRIORITIES.find(p => p.id === todo.priority)?.label}
                    </span>
                    {todo.description && (
                      <span className="text-xs text-[var(--primary)]">
                        {expandedId === todo.id ? "▲ Tutup" : "▼ Detail"}
                      </span>
                    )}
                  </div>
                  
                  {/* Expanded Description */}
                  <AnimatePresence>
                    {expandedId === todo.id && todo.description && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-[var(--glass-border)]"
                      >
                        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
                          {todo.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  {/* Reschedule Button for Overdue */}
                  {isOverdue(todo) && (
                    <button
                      onClick={() => rescheduleToTomorrow(todo.id)}
                      className="px-2 py-1 rounded-lg text-xs bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all whitespace-nowrap"
                      title="Jadwalkan ke besok"
                    >
                      → Besok
                    </button>
                  )}
                  
                  <div className="flex items-center gap-1 opacity-60 sm:opacity-60 group-hover:opacity-100 transition-opacity">
                    {/* Edit Button */}
                    <button
                      onClick={() => startEdit(todo)}
                      className="p-1.5 sm:p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all"
                    >
                      <HugeiconsIcon icon={Edit02Icon} size={16} />
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1.5 sm:p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TodoApp;
