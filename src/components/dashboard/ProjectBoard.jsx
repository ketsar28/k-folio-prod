import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Calendar01Icon,
  Delete02Icon,
  Edit02Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  KanbanIcon
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

const COLUMNS = [
  { id: "todo", label: "To Do", color: "#f59e0b" }, // Amber
  { id: "in_progress", label: "In Progress", color: "#3b82f6" }, // Blue
  { id: "review", label: "Review", color: "#8b5cf6" }, // Purple
  { id: "done", label: "Done", color: "#10b981" }, // Emerald
];

const PRIORITIES = [
  { id: "low", label: "Low", color: "#6b7280" },
  { id: "medium", label: "Medium", color: "#f59e0b" },
  { id: "high", label: "High", color: "#ef4444" },
];

const ProjectBoard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
    tags: "", // Comma separated
  });

  // Subscribe to projects collection
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: "",
      tags: "",
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !user) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "users", user.uid, "projects", editingId), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "users", user.uid, "projects"), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const deleteProject = async (id) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteDoc(doc(db, "users", user.uid, "projects", id));
    }
  };

  const moveProject = async (project, direction) => {
    const currentIndex = COLUMNS.findIndex(c => c.id === project.status);
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < COLUMNS.length) {
      const newStatus = COLUMNS[newIndex].id;
      
      // Optimistic Update
      setProjects(prev => prev.map(p => 
         p.id === project.id ? { ...p, status: newStatus } : p
      ));

      await updateDoc(doc(db, "users", user.uid, "projects", project.id), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    }
  };

  const startEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description || "",
      priority: project.priority,
      status: project.status,
      dueDate: project.dueDate || "",
      tags: project.tags || "",
    });
    setEditingId(project.id);
    setIsAdding(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HugeiconsIcon icon={KanbanIcon} size={24} className="text-[var(--primary)]" />
            Project Board
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">Manage your freelance & bootcamp projects</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-medium text-sm hover:opacity-90 transition-all flex items-center gap-2"
        >
          <HugeiconsIcon icon={Add01Icon} size={18} />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>

      {/* Add/Edit Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.form
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <h3 className="text-lg font-bold text-white mb-4">
                {editingId ? "Edit Project Task" : "New Project Task"}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1.5">Task Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm"
                    placeholder="e.g. Redesign Landing Page"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1.5">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm"
                    >
                      {PRIORITIES.map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-secondary)] block mb-1.5">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm resize-none h-24"
                    placeholder="Task details..."
                  />
                </div>

                <div>
                  <label className="text-xs text-[var(--text-secondary)] block mb-1.5">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-600 focus:border-[var(--primary)] outline-none text-white text-sm"
                    placeholder="freelance, design, urgent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 rounded-xl bg-slate-700 text-white text-sm hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90"
                >
                  {editingId ? "Update Task" : "Create Task"}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* Board Columns */}
      <div className="flex-1 overflow-y-auto sm:overflow-x-auto sm:overflow-y-hidden pb-4 custom-scrollbar">
        <div className="flex flex-col sm:flex-row h-max sm:h-full gap-4 min-w-0 sm:min-w-0">
          {COLUMNS.map((column) => {
            const columnTasks = projects.filter(p => p.status === column.id);
            
            return (
              <div 
                key={column.id} 
                className="flex-1 min-w-[280px] bg-slate-800/30 rounded-2xl border border-[var(--glass-border)] flex flex-col"
              >
                {/* Column Header */}
                <div 
                  className="p-3 border-b border-white/5 flex items-center justify-between sticky top-0 bg-inherit rounded-t-2xl z-10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                    <span className="font-semibold text-white text-sm">{column.label}</span>
                    <span className="bg-slate-700 text-[var(--text-secondary)] text-[10px] px-1.5 py-0.5 rounded-md">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, status: column.id }));
                      setIsAdding(true);
                    }}
                    className="text-[var(--text-secondary)] hover:text-white"
                  >
                    <HugeiconsIcon icon={Add01Icon} size={16} />
                  </button>
                </div>

                {/* Column Content */}
                <div className="p-2 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
                    {columnTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout="position"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }} // Faster, standard transition
                        className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--glass-border)] group hover:border-[var(--primary)]/50 transition-all shadow-sm"
                      >
                        {/* Title & Priority */}
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h4 className="text-sm font-medium text-white leading-tight">{task.title}</h4>
                          <span 
                            className="shrink-0 w-2 h-2 rounded-full mt-1" 
                            style={{ backgroundColor: PRIORITIES.find(p => p.id === task.priority)?.color }}
                            title={`Priority: ${task.priority}`}
                          />
                        </div>

                        {/* Description Preview */}
                        {task.description && (
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-2">
                            {task.description}
                          </p>
                        )}

                        {/* Tags */}
                        {task.tags && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {task.tags.split(',').map((tag, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-[var(--text-secondary)] rounded-md border border-white/5">
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer Info & Actions */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                            {task.dueDate && (
                              <span className={`flex items-center gap-0.5 ${new Date(task.dueDate) < new Date() ? "text-red-400" : ""}`}>
                                <HugeiconsIcon icon={Calendar01Icon} size={10} />
                                {new Date(task.dueDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                              </span>
                            )}
                          </div>

                          {/* Hover Actions */}
                          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            {/* Move Left */}
                            {column.id !== "todo" && (
                              <button 
                                onClick={() => moveProject(task, "prev")}
                                className="p-1 rounded hover:bg-slate-700 text-[var(--text-secondary)]"
                                title="Move Back"
                              >
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                              </button>
                            )}

                            <button
                              onClick={() => startEdit(task)}
                              className="p-1 rounded hover:bg-slate-700 text-[var(--text-secondary)] hover:text-[var(--primary)]"
                            >
                              <HugeiconsIcon icon={Edit02Icon} size={14} />
                            </button>
                            <button
                              onClick={() => deleteProject(task.id)}
                              className="p-1 rounded hover:bg-slate-700 text-[var(--text-secondary)] hover:text-red-400"
                            >
                              <HugeiconsIcon icon={Delete02Icon} size={14} />
                            </button>

                             {/* Move Right */}
                             {column.id !== "done" && (
                              <button 
                                onClick={() => moveProject(task, "next")}
                                className="p-1 rounded hover:bg-slate-700 text-[var(--text-secondary)]"
                                title="Move Next"
                              >
                                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectBoard;
