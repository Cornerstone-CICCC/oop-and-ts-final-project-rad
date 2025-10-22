export class TodoContext {
  static id = 1;

  constructor() {
    //const saved = localStorage.getItem("todos");
    //this.todos = saved ? JSON.parse(saved) : [];
    this.todos = [];
    this.listeners = [];
  }

  addTodo(todo) {
    const newTodo = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      date: todo.date,
      deadline: todo.deadline,
      progress: todo.progress,
    };
    this.todos.push(newTodo);
    this.notifyListeners();

    if (typeof window !== "undefined") {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    }
  }

  getTodos() {
    return this.todos;
  }

  loadTodos() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      this.todos = saved ? JSON.parse(saved) : [];
    }
    return this.todos;
  }

  updateTodo(id, updatedData) {
    this.todos = this.todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, ...updatedData };
      }
      return todo;
    });

    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.notifyListeners();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.todos));
  }
}

export const todoContext = new TodoContext();
