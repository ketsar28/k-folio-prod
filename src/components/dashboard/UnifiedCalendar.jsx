import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
  Task01Icon,
  KanbanIcon,
  Target01Icon,
  Calendar01Icon
} from "@hugeicons/core-free-icons";
import { db } from "../../config/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const UnifiedCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubs = [];

    // 1. Fetch Todos
    const qTodos = query(collection(db, "users", user.uid, "todos"));
    unsubs.push(onSnapshot(qTodos, (snap) => {
      const todos = snap.docs
        .map(d => ({ id: d.id, ...d.data(), type: 'todo' }))
        .filter(t => t.dueDate && !t.completed); // Only showing active todos with dates
      updateEvents(todos, 'todo');
    }));

    // 2. Fetch Projects
    const qProjects = query(collection(db, "users", user.uid, "projects"));
    unsubs.push(onSnapshot(qProjects, (snap) => {
      const projects = snap.docs
        .map(d => ({ id: d.id, ...d.data(), type: 'project' }))
        .filter(p => p.dueDate && p.status !== 'done');
      updateEvents(projects, 'project');
    }));

    // 3. Fetch Resolutions
    const qResolutions = query(collection(db, "users", user.uid, "resolutions"));
    unsubs.push(onSnapshot(qResolutions, (snap) => {
      const resolutions = snap.docs
        .map(d => ({ id: d.id, ...d.data(), type: 'resolution' }))
        .filter(r => r.targetDate && !r.completed);
      updateEvents(resolutions, 'resolution');
    }));

    return () => unsubs.forEach(u => u());
  }, [user]);

  // Aggregate events in state
  const updateEvents = (newItems, type) => {
    setEvents(prev => {
      // Remove old items of this type and add new ones
      const others = prev.filter(e => e.type !== type);
      return [...others, ...newItems];
    });
    setLoading(false);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const getEventsForDate = (day) => {
    return events.filter(e => {
      const date = new Date(e.dueDate || e.targetDate);
      return date.getDate() === day && 
             date.getMonth() === currentDate.getMonth() && 
             date.getFullYear() === currentDate.getFullYear();
    });
  };

  const getEventTypeConfig = (type) => {
    switch(type) {
      case 'todo': return { color: '#f59e0b', icon: Task01Icon, label: 'Task' };
      case 'project': return { color: '#3b82f6', icon: KanbanIcon, label: 'Project' };
      case 'resolution': return { color: '#10b981', icon: Target01Icon, label: 'Goal' };
      default: return { color: '#6b7280', icon: Calendar01Icon, label: 'Event' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Get selected date events
  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6 lg:flex-row">
      {/* Calendar View */}
      <div className="flex-1 bg-[var(--bg-card)] rounded-2xl border border-[var(--glass-border)] p-4 sm:p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <HugeiconsIcon icon={Calendar03Icon} size={24} className="text-[var(--primary)]" />
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-700 text-[var(--text-secondary)]">
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </button>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-700 text-[var(--text-secondary)]">
              <HugeiconsIcon icon={ArrowRight01Icon} size={20} />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-[var(--text-secondary)] py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-1 auto-rows-fr">
          {/* Empty cells for previous month */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2 min-h-[60px] sm:min-h-[80px]" />
          ))}

          {/* Days */}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDate(day);
            const isToday = 
              day === new Date().getDate() && 
              currentDate.getMonth() === new Date().getMonth() && 
              currentDate.getFullYear() === new Date().getFullYear();
            const isSelected = selectedDate === day;

            return (
              <motion.button
                key={day}
                onClick={() => setSelectedDate(day)}
                whileHover={{ scale: 0.98 }}
                className={`
                  relative p-2 rounded-xl flex flex-col items-start justify-start border transition-all min-h-[60px] sm:min-h-[80px]
                  ${isSelected 
                    ? "bg-[var(--primary)]/10 border-[var(--primary)] ring-1 ring-[var(--primary)]" 
                    : "bg-slate-800/30 border-transparent hover:border-[var(--glass-border)]"
                  }
                `}
              >
                <span className={`
                  text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1
                  ${isToday ? "bg-[var(--primary)] text-white" : "text-[var(--text-primary)]"}
                `}>
                  {day}
                </span>

                {/* Event Dots */}
                <div className="flex flex-wrap gap-1 content-start w-full">
                  {dayEvents.slice(0, 4).map((event, idx) => (
                    <div 
                      key={idx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: getEventTypeConfig(event.type).color }}
                      title={event.title || event.text}
                    />
                  ))}
                  {dayEvents.length > 4 && (
                    <span className="text-[10px] text-[var(--text-secondary)]">+{dayEvents.length - 4}</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sidebar: Event Details */}
      <div className="w-full lg:w-80 bg-[var(--bg-card)] rounded-2xl border border-[var(--glass-border)] p-4 sm:p-6 flex flex-col h-[300px] lg:h-auto">
        <h3 className="text-lg font-bold text-white mb-4">
          {selectedDate 
            ? `${selectedDate} ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
            : "Upcoming Events"
          }
        </h3>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
          {(selectedDate ? selectedEvents : events.sort((a,b) => new Date(a.dueDate || a.targetDate) - new Date(b.dueDate || b.targetDate)).slice(0, 5))
            .map((event, idx) => {
              const config = getEventTypeConfig(event.type);
              const date = new Date(event.dueDate || event.targetDate);
              
              return (
                <div key={`${event.id}-${idx}`} className="p-3 bg-slate-800/50 rounded-xl border border-[var(--glass-border)] flex gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${config.color}20`, color: config.color }}
                  >
                    <HugeiconsIcon icon={config.icon} size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white text-sm truncate">{event.title || event.text}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-[var(--text-secondary)] border border-white/5">
                        {config.label}
                      </span>
                      
                      {/* Show Status for Projects */}
                      {event.type === 'project' && event.status && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          event.status === 'done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          event.status === 'review' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                          event.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}>
                          {event.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      )}

                      <span className="text-xs text-[var(--text-secondary)] ml-auto">
                        {date.getDate()}/{date.getMonth() + 1}
                      </span>
                    </div>

                    {/* Show Tags for Projects */}
                    {event.type === 'project' && event.tags && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {event.tags.split(',').slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-[10px] text-[var(--text-secondary)]">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          }
          
          {selectedDate && selectedEvents.length === 0 && (
            <div className="text-center py-10 text-[var(--text-secondary)]">
              <p>No events for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedCalendar;
