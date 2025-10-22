export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  completed: boolean;
  date: Date;
  deadline?: Date;
  progress: string
}

export class TaskList {
  private tasks: Task[] = [];
  private nextId = 1

  add(title: string, priority: string, progress: string, description?: string, deadline?: Date): Task {
    const task: Task = {
      id: this.nextId++,
      title,
      description,
      priority,
      completed: false,
      date: new Date(),
      deadline,
      progress,
    };
    this.tasks.push(task);
    return task;
  }

  update(id: number,updates: {
      title?: string;
      description?: string;
      priority?: string;
      completed?: boolean;
      deadline?: Date;
      progress?: string;
    }): Task | null {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;

    if (updates.title !== undefined) task.title = updates.title;
    if (updates.description !== undefined) task.description = updates.description;
    if (updates.priority !== undefined) task.priority = updates.priority;
    if (updates.completed !== undefined) task.completed = updates.completed;
    if (updates.deadline !== undefined) task.deadline = updates.deadline;
    if (updates.progress !== undefined) task.progress = updates.progress;

    return task;
  }

  delete(id: number): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }

  getAll(): Task[] {
    return [...this.tasks];
  }

  onDrag(id: number): Task | null {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    console.log(`Drag task: ${task.title}`);
    return task;
  }

  onDrop(id: number, targetColumn: string): Task | null {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    task.progress = targetColumn;
    console.log(`Task "${task.title}" was changed to "${targetColumn}"`);
    return task;
  }

}
