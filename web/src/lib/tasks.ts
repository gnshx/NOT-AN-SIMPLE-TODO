export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
}

const TASKS_KEY = 'daynightpilot.tasks';
export const TASKS_CHANGED = 'daynightpilot:tasks-changed';

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = window.localStorage.getItem(TASKS_KEY);
    const tasks = value ? JSON.parse(value) : [];
    return Array.isArray(tasks) ? tasks : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]) {
  window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new Event(TASKS_CHANGED));
}

export function createTask(input: Pick<Task, 'title' | 'date' | 'time' | 'priority'>): Task {
  return {
    ...input,
    id: crypto.randomUUID(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}
