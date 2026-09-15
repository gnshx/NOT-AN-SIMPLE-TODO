'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckSquare,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Filter
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  completed: boolean;
  dueDate?: string;
}

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Prepare Google System Design & Concurrency STAR stories', priority: 'HIGH', category: 'Interview Prep', completed: true, dueDate: 'Today' },
  { id: 't2', title: 'Draft & Send Follow-up Email to Stripe Recruiter Sarah', priority: 'HIGH', category: 'Communication', completed: false, dueDate: 'Today' },
  { id: 't3', title: 'Create React/TypeScript Resume Variant v3', priority: 'MEDIUM', category: 'Resume Workspace', completed: false, dueDate: 'Tomorrow' },
  { id: 't4', title: 'Review Acme Corp tech stack & Glassdoor question sheet', priority: 'LOW', category: 'Research', completed: false, dueDate: 'May 16' }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [newCategory, setNewCategory] = useState('General');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      priority: newPriority,
      category: newCategory,
      completed: false,
      dueDate: 'Today'
    };
    setTasks([newTask, ...tasks]);
    setNewTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'PENDING') return !t.completed;
    if (filter === 'COMPLETED') return t.completed;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace">
        <div className="page-kicker">
          <CheckSquare size={14} />
          TASK EXECUTION & ACTION ITEMS
        </div>

        <div className="page-heading">
          <div>
            <h1>Task Execution Center</h1>
            <p>Prioritized daily tasks, interview preparation items, and career action follow-ups.</p>
          </div>
          <div className="task-count">
            Pending Tasks: <strong>{tasks.filter((t) => !t.completed).length} Items</strong>
          </div>
        </div>

        {/* Responsive 2 Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Create Task Form */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)' }}>
              <Plus size={16} style={{ color: 'var(--accent-cobalt)' }} /> Add Action Task
            </h2>

            <form onSubmit={handleAddTask} style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                  Task Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Practice System Design STAR answer..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Communication">Communication</option>
                    <option value="Resume Workspace">Resume Workspace</option>
                    <option value="Research">Research</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="primary-button" style={{ width: '100%', marginTop: '6px' }}>
                <Plus size={16} /> Create Task
              </button>
            </form>
          </div>

          {/* Task List */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>Execution Queue</h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(['ALL', 'PENDING', 'COMPLETED'] as const).map((f) => (
                  <button
                    key={f}
                    className={`filter-pill ${filter === f ? 'active' : ''}`}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <AnimatePresence>
                {filteredTasks.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      background: t.completed ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-surface-2)',
                      border: '1px solid var(--border-subtle)',
                      opacity: t.completed ? 0.6 : 1
                    }}
                  >
                    <button
                      onClick={() => toggleTask(t.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: t.completed ? 'none' : '2px solid var(--text-muted)',
                        background: t.completed ? 'var(--accent-emerald)' : 'transparent',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {t.completed && <CheckCircle2 size={14} />}
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: t.completed ? 'line-through' : 'none' }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '12px', fontFamily: 'var(--font-mono)' }}>
                        <span>Category: {t.category}</span>
                        {t.dueDate && <span>Due: {t.dueDate}</span>}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: t.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.14)' : 'rgba(59, 130, 246, 0.14)',
                        color: t.priority === 'HIGH' ? '#f87171' : '#93c5fd'
                      }}
                    >
                      {t.priority}
                    </span>

                    <button onClick={() => deleteTask(t.id)} style={{ color: 'var(--text-muted)', padding: '4px' }}>
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
