import { todoContext, type Todo, type Progress } from "./TodoContext";
import { KanbanBoard } from "../classes/kanboard";

export type ColumnType = "todo" | "in-progress" | "done";

export const kanbanBoard = new KanbanBoard();

export function dragstartHandler(ev: DragEvent): void {
  const target = ev.target as HTMLDivElement;
  ev.dataTransfer?.setData("text/plain", target?.id);
}

export function dragoverHandler(ev: DragEvent): void {
  ev.preventDefault();
}

export function dropHandler(ev: DragEvent): void {
  ev.preventDefault();
  const taskId = ev.dataTransfer?.getData("text/plain");
  if (!taskId) return;

  const taskIdNum: number = parseInt(taskId);
  const container = ev.currentTarget as HTMLElement;
  const progressId = container?.id as ColumnType;
  const success = kanbanBoard.moveTask(taskIdNum, progressId);

  if (success) {
    return;
  }
}

export function openEmptycard(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const parentDiv = target.closest(".col");
  if (!parentDiv) return;
  const cardsDiv = parentDiv.querySelector(".cards-container");
  const findInput = cardsDiv?.querySelector(
    ".card-input"
  ) as HTMLInputElement | null;
  if (findInput) {
    findInput.focus();
    return;
  }

  const card = document.createElement("div");
  card.classList.add("card");
  card.draggable = true;
  card.id = `new-task-${Date.now()}`;
  card.ondragstart = (event) => dragstartHandler(event as DragEvent);

  card.innerHTML = `
        <div>
           <input type="text"
           id="task-title" class="card-input"
           placeholder="Task title"
          />
        </div>
        `;

  const input = card.querySelector("input") as HTMLInputElement;

  let handled = false;
  input.addEventListener("focusout", (e) => {
    if (handled) return;
    addInputToTask(e as FocusEvent);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handled = true;
      addInputToTask(e as KeyboardEvent);
      input.blur();
    }
  });
  cardsDiv?.append(card);

  card.scrollIntoView({
    behavior: "smooth",
  });
  input.focus();
}

export function addInputToTask(event: FocusEvent | KeyboardEvent): void {
  const target = event.target as HTMLInputElement;
  const newTitle = target.value;

  if (!newTitle) {
    const parentCard = target.parentElement?.parentElement;
    parentCard?.remove();
    return;
  }

  const parentDiv = target.closest(".col");
  if (!parentDiv) return;
  const progressVal = parentDiv.id as ColumnType;

  kanbanBoard.addTask(newTitle, "2", progressVal);

  const parentCard = target.parentElement?.parentElement;
  parentCard?.remove();
}
