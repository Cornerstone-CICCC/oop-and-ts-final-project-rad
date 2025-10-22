export enum Priority {
  High = 1,
  Medium = 2,
  Low = 3,
}

export type Progress = "Todo" | "In Progress" | "Completed";

export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  date: string;
  deadline: string;
  progress: Progress;
}

type Listener = (todos: Todo[]) => void;

export class TodoContext {
  private todos: Todo[] = [];
  private listeners: Listener[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      this.todos = saved ? JSON.parse(saved) : [];
    }
  }

  addTodo(todo: Todo): void {
    this.todos.push(todo);
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  loadTodos(): Todo[] {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      this.todos = saved ? JSON.parse(saved) : [];
    }
    return this.todos;
  }

  updateTodo(id: number, updatedData: Partial<Todo>): void {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, ...updatedData } : todo
    );
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveToLocalStorage();
    this.notifyListeners();
  }

  subscribe(listener: Listener): void {
    this.listeners.push(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.todos));
  }

  private saveToLocalStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    }
  }
}

export const todoContext = new TodoContext();
