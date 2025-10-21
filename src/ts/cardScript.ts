export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: number;
  date: string;
  deadline: string;
  progress: string;
}

type Priority={key:number,state:string }

export const status: Priority[]=[
  {key: 1, state:"High"},
  {key:2, state:"Medium"},
  {key:3, state:"Low"},
]

export const progresses: string[]= ["Todo", "In Progress", "Completed"]

export const dummydata: Todo[] = [
  {
    id: 1,
    title: "Clean the kitchen",
    description: "Wipe the counters, wash dishes, and organize the pantry.",
    priority: 1,
    date: "2025-10-21",
    deadline: "2025-10-23",
    progress: "Todo",
  },
  {
    id: 2,
    title: "Finish English essay",
    description:
      "Write the conclusion and proofread the entire essay before submission.",
    priority: 2,
    date: "2025-10-22",
    deadline: "2025-10-25",
    progress: "In Progress",
  },
  {
    id: 3,
    title: "Team meeting",
    description:
      "Discuss project milestones and assign tasks for the next sprint.",
    priority: 1,
    date: "2025-10-23",
    deadline: "2025-10-23",
    progress: "Todo",
  },
  {
    id: 4,
    title: "Grocery shopping",
    description: "Buy milk, bread, eggs, and fruits for the week.",
    priority: 3,
    date: "2025-10-20",
    deadline: "2025-10-21",
    progress: "Completed",
  },
  {
    id: 5,
    title: "Workout session",
    description: "45-minute cardio followed by strength training.",
    priority: 2,
    date: "2025-10-24",
    deadline: "2025-10-26",
    progress: "In Progress",
  },
  {
    id: 6,
    title: "Call mom",
    description: "Catch up with mom and ask about the family gathering plans.",
    priority: 3,
    date: "2025-10-19",
    deadline: "2025-10-20",
    progress: "Todo",
  },
  {
    id: 7,
    title: "Study JavaScript",
    description:
      "Review promises, async/await, and practice with coding exercises.",
    priority: 1,
    date: "2025-10-25",
    deadline: "2025-10-30",
    progress: "Todo",
  },
  {
    id: 8,
    title: "Doctor appointment",
    description: "Regular health checkup at 10:00 AM.",
    priority: 1,
    date: "2025-10-18",
    deadline: "2025-10-18",
    progress: "Completed",
  },
  {
    id: 9,
    title: "Laundry day",
    description:
      "Wash white clothes separately and dry everything before evening.",
    priority: 2,
    date: "2025-10-21",
    deadline: "2025-10-22",
    progress: "In Progress",
  },
  {
    id: 10,
    title: "Plan weekend trip",
    description: "Decide destination, book tickets, and pack essentials.",
    priority: 3,
    date: "2025-10-26",
    deadline: "2025-10-29",
    progress: "Todo",
  },
];

const counter = dummydata.length

export function dragstartHandler(ev:DragEvent):void {
    const target = ev.target as HTMLDivElement
    ev.dataTransfer?.setData("text", target?.id);
  }

export function dragoverHandler(ev:DragEvent):void{
    ev.preventDefault();
  }

export function dropHandler(ev:DragEvent):void{
    ev.preventDefault();
    const taskId = ev.dataTransfer?.getData("text");
    const target = ev.target as HTMLDivElement
    if(!taskId) return
    const draggedElement = document.getElementById(taskId) as HTMLElement
    target.appendChild(draggedElement);
    // const progressId :number = target.id;
  }

  export function openEmptycard(event:MouseEvent):void{
    const target = event.target as HTMLElement
    const parentDiv = target.parentElement?.parentElement?.parentElement;
    if(!parentDiv) return
    const cardsDiv = parentDiv.querySelector(".cards-container");
    const card = document.createElement("div");
    card.classList.add("card");
    card.draggable = true;
    card.ondragstart = (event) => dragstartHandler(event);

    card.innerHTML = `
        <div>
           <input type="text"
           id="task-title" class="card-input"
           placeholder="Task title"
          />
        </div>
        `;

    card.querySelector("input")?.addEventListener("focusout",(e)=>{
      console.log("focusout")
      addInputToTask(e)})
    cardsDiv?.append(card);
  }

  export function addInputToTask(event:FocusEvent):void {
    const target = event.target as HTMLInputElement
    const parentDiv =
      target.parentElement?.parentElement?.parentElement?.parentElement;
    
      if(!parentDiv) return
    const progressVal = parentDiv.id;
    console.log(progressVal); //input

    const progressStr =
      progressVal === "inProgress"
        ? "In Progress"
        : progressVal[0].toUpperCase() + progressVal.slice(1);
    const newTitle = target.value;

    const newTask:Todo = {
      id: counter+1,
      title: newTitle,
      description: "",
      priority: 3,
      date: (new Date()).toString(),
      deadline: "",
      progress: progressStr,
    };

    dummydata.push(newTask);
    console.log(dummydata)
    render(dummydata)
  }

export function render(tasks:Todo[]):void{
  const cardDivs = document.querySelectorAll(".cards-container")
  // Erase cards from all cards-container
  cardDivs.forEach(cardDiv=>cardDiv.innerHTML="")

  //Filter tasks
  const todos: Todo[] = dummydata.filter((item) => item.progress === "Todo");
  const inProgress: Todo[] = dummydata.filter(
    (item) => item.progress === "In Progress"
  );
  const completed: Todo[] = dummydata.filter(
    (item) => item.progress === "Completed"
  );

  //Find each container and assign to each container
  const todoDiv = document.querySelector('#todo .cards-container') as HTMLDivElement
  const inProgressDiv = document.querySelector('#inProgress .cards-container') as HTMLDivElement
  const completedDiv = document.querySelector('#completed .cards-container') as HTMLDivElement

  renderCard(todos, todoDiv)
  renderCard(inProgress, inProgressDiv)
  renderCard(completed, completedDiv)

}

export function renderCard(tasks:Todo[], container:HTMLElement):void{
  tasks.map(task=>{
    const priorityNum = task.priority;
    const priority = status.find((level) => level.key === priorityNum);
    const bgColorClass =
      priorityNum === 1 ? "bg-high" : priorityNum === 2 ? "bg-mid" : "bg-low";
    const priorityStr = priority?.state;
    const div = document.createElement('div')
    div.classList.add('card')
    div.draggable= true
    div.id = String(task.id)
    
    div.innerHTML=`
      <div class="task-title">${task.title}</div>
      <div class="priority-str ${bgColorClass}">${priorityStr}</div>
      <div class="duedate-text">${task.deadline?`Due: ${task.deadline}`:""}</div>
    `
    div.addEventListener('click',()=>console.log('modal'))
    container.appendChild(div)
})
}