import {TaskList } from './TaskList';
import type {Task, ColumnType} from './TaskList'

export class KanbanBoard {
  private taskList: TaskList;
  private columns: Record<ColumnType, Task[]> = {
    todo: [],
    'in-progress': [],
    done: [],
  };

  constructor(taskList?: TaskList) {
    this.taskList = taskList ?? new TaskList();
    this.initializeBoard();
  }

  initializeBoard(): void {
    const allTasks = this.taskList.getAll();
    this.columns = {
      todo: [],
      'in-progress': [],
      done: [],
    };

    for (const task of allTasks) {
      const col = task.progress;
      if (this.columns[col]) {
        this.columns[col].push(task);
      }
    }
  }

  //get Tasks per column
  getColumn(column: ColumnType): Task[] {
    return this.columns[column];
  }

  //add task and update column
  addTask(
    title: string,
    priority: string,
    progress: ColumnType,
    description?: string,
    deadline?: Date
  ): Task {
    const task = this.taskList.add(title, priority, progress, description, deadline);
    this.columns[progress].push(task);
    return task;
  }

  // move task between columns
  moveTask(id: number, targetColumn: ColumnType): boolean {
    const task = this.taskList.onDrop(id, targetColumn);
    if (!task) return false;
    this.initializeBoard(); // Reorganiza columnas
    return true;
  }

  //Delete task and update column
  deleteTask(id: number): boolean {
    const success = this.taskList.delete(id);
    if (success) this.initializeBoard();
    return success;
  }
}
