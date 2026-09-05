'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, Clock3, Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { createTask, loadTasks, saveTasks, TASKS_CHANGED, Task, TaskPriority, today } from '@/lib/tasks';

const hours = Array.from({ length: 13 }, (_, index) => index + 8);

function formatHour(hour: number) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric' }).format(new Date(2026, 0, 1, hour));
}

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(today());
  const [title, setTitle] = useState('');
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

  const dayTasks = useMemo(
    () => tasks.filter((task) => task.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [tasks, selectedDate],
  );
  const completed = dayTasks.filter((task) => task.completed).length;

  const update = (next: Task[]) => {
    setTasks(next);
    saveTasks(next);
  };

  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    update([...tasks, createTask({ title: trimmed, date: selectedDate, time, priority })]);
    setTitle('');
  };

  return (
    <div className="app-page">
      <Sidebar />
      <main className="workspace">
        <div className="page-kicker"><Clock3 size={15} /> Time-blocked schedule</div>
        <div className="page-heading">
          <div><h1>Day planner</h1><p>Put your work on a timeline and focus on the next block.</p></div>
          <label className="date-picker">Plan for<input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label>
        </div>

        <div className="planner-summary"><strong>{completed}/{dayTasks.length}</strong> tasks completed <span aria-hidden="true">•</span> {selectedDate === today() ? 'Today' : new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>

        <div className="planner-layout">
          <section className="timeline" aria-label="Day timeline">
            {hours.map((hour) => {
              const blockTasks = dayTasks.filter((task) => Number(task.time.slice(0, 2)) === hour);
              return <div className="time-slot" key={hour}>
                <time>{formatHour(hour)}</time>
                <div className="slot-content">
                  {blockTasks.map((task) => <button key={task.id} className={`planner-task priority-${task.priority.toLowerCase()} ${task.completed ? 'is-complete' : ''}`} onClick={() => update(tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))}>
                    <span className="planner-check">{task.completed && <Check size={13} />}</span>
                    <span><strong>{task.title}</strong><small>{task.time} · {task.priority} priority</small></span>
                  </button>)}
                </div>
              </div>;
            })}
            {dayTasks.filter((task) => !hours.includes(Number(task.time.slice(0, 2)))).map((task) => <div className="unscheduled-task" key={task.id}>{task.time} · {task.title}</div>)}
          </section>

          <form className="planner-add" onSubmit={addTask}>
            <h2>Schedule a task</h2>
            <label>Task<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs your attention?" /></label>
            <label>Start time<input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label>
            <label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <button className="primary-button" type="submit"><Plus size={17} /> Add to timeline</button>
          </form>
        </div>
      </main>
    </div>
  );
}
