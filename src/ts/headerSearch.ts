import { todoContext, Priority, type Todo } from "./TodoContext";

function initHeaderSearch(): void {
  const input = document.getElementById("search-input") as HTMLInputElement | null;
  const suggestions = document.getElementById("search-suggestions") as HTMLDivElement | null;
  if (!input || !suggestions) return;

  let debounceTimer: number | null = null;
  let focusedIndex = -1;
  const MAX_SUGGESTIONS = 6;

  function escapeHtml(str: string): string {
    return str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]!));
  }
  
  function render(list: Todo[], query: string) {
    if (!list.length || !query.trim()) {
      suggestions!.innerHTML = "";
      suggestions!.classList.remove("visible");
      return;
    }

    const escQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const items = list.slice(0, MAX_SUGGESTIONS).map((t, i) => {
      const re = new RegExp(`^(${escQuery})`, "i");
      const title = escapeHtml(t.title).replace(re, "<strong>$1</strong>");
      const prioLabel = Priority[t.priority] ?? String(t.priority);
      return `<div class="suggestion-item" data-id="${t.id}" data-index="${i}" role="option">${title} <span class="suggestion-meta">– ${prioLabel}</span></div>`;
    }).join("");
    suggestions!.innerHTML = items;
    suggestions!.classList.add("visible");
    focusedIndex = -1;
    updateFocus();
  }

  function updateFocus() {
    const nodes = Array.from(suggestions!.querySelectorAll<HTMLElement>(".suggestion-item"));
    nodes.forEach((n) => n.classList.remove("focused"));
    if (focusedIndex >= 0 && focusedIndex < nodes.length) {
      nodes[focusedIndex].classList.add("focused");
      nodes[focusedIndex].scrollIntoView({ block: "nearest" });
    }
  }

  function doSearch(query: string) {
    todoContext.loadTodos();
    const all = todoContext.getTodos() as Todo[];
    const q = query.trim().toLowerCase();
    if (!q) {
      render([], q);
      return;
    }
    const filtered = all.filter(t => t.title.toLowerCase().startsWith(q));
    render(filtered, q);
  }

  input.addEventListener("input", () => {
    if (debounceTimer !== null) window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(() => {
      doSearch(input.value);
      debounceTimer = null;
    }, 200) as unknown as number;
  });

  input.addEventListener("keydown", (ev) => {
    const nodes = Array.from(suggestions.querySelectorAll<HTMLElement>(".suggestion-item"));
    if (!nodes.length) return;
    if (ev.key === "ArrowDown") {
      ev.preventDefault();
      focusedIndex = Math.min(focusedIndex + 1, nodes.length - 1);
      updateFocus();
    } else if (ev.key === "ArrowUp") {
      ev.preventDefault();
      focusedIndex = Math.max(focusedIndex - 1, 0);
      updateFocus();
    } else if (ev.key === "Enter") {
      if (focusedIndex >= 0 && focusedIndex < nodes.length) {
        ev.preventDefault();
        const id = Number(nodes[focusedIndex].dataset.id);
        selectSuggestionById(id);
      }
    } else if (ev.key === "Escape") {
      suggestions.innerHTML = "";
      suggestions.classList.remove("visible");
    }
  });

  suggestions.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest(".suggestion-item") as HTMLElement | null;
    if (!target) return;
    const id = Number(target.dataset.id);
    selectSuggestionById(id);
  });

  document.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest("#search-suggestions") && !(e.target as HTMLElement).closest("#search-input")) {
      suggestions.innerHTML = "";
      suggestions.classList.remove("visible");
    }
  });

  function openViewModal(item: Todo) {
    const viewModal = document.getElementById("viewModal") as HTMLDialogElement | null;
    if (!viewModal) return;

    const titleEl = viewModal.querySelector("#modalTitle") as HTMLElement | null;
    const descEl = viewModal.querySelector("#modalDesc") as HTMLElement | null;
    const progressEl = viewModal.querySelector("#progressBadge") as HTMLElement | null;
    const periorityEl = viewModal.querySelector("#periorityBadge") as HTMLElement | null;
    const registeEl = viewModal.querySelector("#registe") as HTMLElement | null;
    const deadlineEl = viewModal.querySelector("#deadline") as HTMLElement | null;

    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.description || "";
    if (progressEl) progressEl.textContent = item.progress;
    if (periorityEl) periorityEl.textContent = Priority[item.priority] ?? String(item.priority);
    if (registeEl) registeEl.textContent = item.date ?? "";
    if (deadlineEl) deadlineEl.textContent = item.deadline ?? "No deadline";

    try {
      if (typeof viewModal.showModal === "function") viewModal.showModal();
      else viewModal.setAttribute("open", "");
    } catch {
      viewModal.setAttribute("open", "");
    }
  }

  function selectSuggestionById(id: number) {
    const all = todoContext.getTodos() as Todo[];
    const item = all.find(t => t.id === id);
    if (!item) return;
    input!.value = item.title;
    suggestions!.innerHTML = "";
    suggestions!.classList.remove("visible");

    input!.value = ""
    input!.blur();

    openViewModal(item);

    const ev = new CustomEvent("todo:selected", { detail: item });
    window.dispatchEvent(ev);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHeaderSearch);
} else {
  initHeaderSearch();
}