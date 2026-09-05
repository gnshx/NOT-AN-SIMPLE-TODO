'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, ListTodo, Plus, Trash2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { createTask, loadTasks, saveTasks, TASKS_CHANGED, Task, TaskPriority, today } from '@/lib/tasks';

const priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today());
  const [time, setTime] = useState('09:00');
  const [priority, setPriority] = useState<TaskPriority>('Medium');

  useEffect(() => {
    const sync = () => setTasks(loadTasks());
    const timer = window.setTimeout(sync, 0);
    window.addEventListener(TASKS_CHANGED, sync);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(TASKS_CHANGED, sync);
    };
  }, []);

  const ordered = useMemo(
    () => [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed) || a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    [tasks],
  );
  const openCount = tasks.filter((task) => !task.completed).length;

  const update = (next: Task[]) => {
    setTasks(next);
    saveTasks(next);
  };

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    update([...tasks, createTask({ title: trimmed, date, time, priority })]);
    setTitle('');
  };

  return (
    <div className="app-page">
      <Sidebar />
      <main className="workspace">
        <div className="page-kicker"><ListTodo size={15} /> Personal productivity</div>
        <div className="page-heading">
          <div>
            <h1>To-do list</h1>
            <p>Capture what needs doing, then schedule it in your day.</p>
          </div>
          <div className="task-count">{openCount} open task{openCount === 1 ? '' : 's'}</div>
        </div>

        <section className="task-layout">
          <form className="task-form" onSubmit={addTask}>
            <h2>Add a task</h2>
            <label>
              Task
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Prepare interview notes" autoFocus />
            </label>
            <div className="form-grid">
              <label>Date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
              <label>Time<input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
            </div>
            <label>
              Priority
              <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
                {priorities.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button className="primary-button" type="submit"><Plus size={17} /> Add task</button>
          </form>

          <section className="task-list" aria-label="Tasks">
            <div className="list-heading"><h2>All tasks</h2><span>{tasks.length} total</span></div>
            {ordered.length === 0 ? (
              <div className="empty-state"><ListTodo size={28} /><p>Your list is clear. Add your first task to begin planning.</p></div>
            ) : ordered.map((task) => (
              <article className={`task-item ${task.completed ? 'is-complete' : ''}`} key={task.id}>
                <button className="complete-button" onClick={() => update(tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))} aria-label={`Mark ${task.title} ${task.completed ? 'incomplete' : 'complete'}`}>
                  {task.completed && <Check size={14} />}
                </button>
                <div className="task-copy">
                  <strong>{task.title}</strong>
                  <span>{task.date === today() ? 'Today' : new Date(`${task.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {task.time}</span>
                </div>
                <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                <button className="delete-button" onClick={() => update(tasks.filter((item) => item.id !== task.id))} aria-label={`Delete ${task.title}`}><Trash2 size={16} /></button>
              </article>
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}
