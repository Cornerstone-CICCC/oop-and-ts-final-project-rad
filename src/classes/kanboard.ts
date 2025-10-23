import { todoContext, Priority } from "../ts/TodoContext";
import type { Todo, Progress } from "../ts/TodoContext";

export type ColumnType = "todo" | "in-progress" | "done";

export class KanbanBoard {
  private columns: Record<ColumnType, Todo[]> = {
    todo: [],
    "in-progress": [],
    done: [],
  };

  constructor() {
    this.initializeBoard();
  }

  initializeBoard(): void {
    todoContext.loadTodos();

    const allTodos = todoContext.getTodos() as Todo[];

    this.columns = {
      todo: [],
      "in-progress": [],
      done: [],
    };

    for (const todo of allTodos) {
      const col = this.mapProgressToColumn(todo.progress);
      if (col && this.columns[col]) {
        this.columns[col].push(todo);
      }
    }
  }

  getColumn(column: ColumnType): Todo[] {
    return this.columns[column];
  }

  addTask(
    title: string,
    priority: number | string,
    progress: ColumnType,
    description?: string,
    deadline?: Date
  ): Todo {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    let prioValue: Priority;
    if (typeof priority === "string") {
      const parsed = Number(priority);
      prioValue = isNaN(parsed) ? Priority.Medium : (parsed as Priority);
    } else {
      prioValue = priority as Priority;
    }

    const newTodo: Todo = {
      id: Date.now(),
      title: title,
      description: description || "",
      priority: prioValue,
      date: `${yyyy}-${mm}-${dd}`,
      deadline: deadline ? deadline.toISOString().split("T")[0] : "",
      progress: this.mapColumnToProgress(progress),
    };

    todoContext.addTodo(newTodo);

    return newTodo;
  }

  moveTask(taskId: number, newProgress: ColumnType): boolean {
    const todos = todoContext.getTodos();
    const todoToMove = todos.find((t) => t.id === taskId);

    if (!todoToMove) return false;

    let progressStr: Progress;
    if (newProgress === "todo") {
      progressStr = "Todo";
    } else if (newProgress === "in-progress") {
      progressStr = "In Progress";
    } else {
      progressStr = "Completed";
    }

    todoContext.updateTodo(taskId, { progress: progressStr });
    return true;
  }

  deleteTask(id: number): boolean {
    todoContext.deleteTodo(id);
    return true;
  }

  private mapProgressToColumn(progress: Progress): ColumnType {
    switch (progress) {
      case "Todo":
        return "todo";
      case "In Progress":
        return "in-progress";
      case "Completed":
        return "done";
      default:
        return "todo";
    }
  }

  private mapColumnToProgress(column: ColumnType): Progress {
    switch (column) {
      case "todo":
        return "Todo";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Completed";
      default:
        return "Todo";
    }
  }
}
