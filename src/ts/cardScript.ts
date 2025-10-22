import { TaskList, type ColumnType, type Task } from "../classes/TaskList";
export const taskList = new TaskList()

export function dragstartHandler(ev:DragEvent):void {
    const target = ev.target as HTMLDivElement
    ev.dataTransfer?.setData("text", target?.id);
  }

export function dragoverHandler(ev:DragEvent):void{
    ev.preventDefault();
  }

export function dropHandler(ev:DragEvent):void{
    ev.preventDefault();
    const taskId = ev.dataTransfer?.getData("text")
    if(!taskId) return
    const taskIdNum: number = parseInt(taskId)
    const container = ev.currentTarget as HTMLElement
    console.log(container)
    let subContainer = (container as HTMLElement)?.querySelector('.cards-container')

    if(!subContainer) return

    const draggedElement = document.getElementById(taskId) as HTMLElement
    subContainer.appendChild(draggedElement);
    const progressId = container?.id as ColumnType; //This is for method
    console.log(progressId)
    taskList.update(taskIdNum, {progress:`${progressId}`})
    console.log(taskList.getAll())
  }

  export function openEmptycard(event:MouseEvent):void{
    const target = event.target as HTMLElement
    const parentDiv = target.parentElement?.parentElement?.parentElement;
    if(!parentDiv) return
    const cardsDiv = parentDiv.querySelector(".cards-container");

    //check if there is empty card exist or not
    const findInput  = cardsDiv?.querySelector('.card-input') as (HTMLInputElement | null)
    if(findInput){
      findInput.focus()
      return
    }
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

    const input = card.querySelector("input") as HTMLInputElement

    let handled = false
    input.addEventListener("focusout",(e)=>{
      if(handled) return
      addInputToTask(e)})

    input.addEventListener('keydown',(e)=>{
      if(e.key=="Enter"){
        handled=true
        addInputToTask(e)
        input.blur()
      }
    })
    cardsDiv?.append(card);

    card.scrollIntoView({
      behavior:'smooth'
    })
    input.focus()
  }

  export function addInputToTask(event:FocusEvent|KeyboardEvent):void {
    const target = event.target as HTMLInputElement
    const newTitle = target.value;

    if(!newTitle){
      const parentCard = target.parentElement?.parentElement
      parentCard?.remove()
      return
    }

    const parentDiv =
      target.parentElement?.parentElement?.parentElement?.parentElement;
    
      if(!parentDiv) return
    const progressVal = parentDiv.id as ColumnType

    taskList.add(newTitle, "medium" , progressVal)
    render()
  }

export function render():void{
  const cardDivs = document.querySelectorAll(".cards-container")
  // Erase cards from all cards-container
  cardDivs.forEach(cardDiv=>cardDiv.innerHTML="")

  //get all task
  const tasks = taskList.getAll()

  //Filter tasks
  const todos: Task[] = tasks.filter((item) => item.progress === "todo");
  const inProgress: Task[] = tasks.filter(
    (item) => item.progress === "in-progress"
  );
  const completed: Task[] = tasks.filter(
    (item) => item.progress === "done"
  );

  //Find each container and assign to each container
  const todoDiv = document.querySelector('#todo .cards-container') as HTMLDivElement
  const inProgressDiv = document.querySelector('#in-progress .cards-container') as HTMLDivElement
  const completedDiv = document.querySelector('#done .cards-container') as HTMLDivElement

  renderCard(todos, todoDiv)
  renderCard(inProgress, inProgressDiv)
  renderCard(completed, completedDiv)

}

export function renderCard(tasks:Task[], container:HTMLElement):void{
  tasks.map(task=>{
    const priority = task.priority
    const bgColorClass =
      priority === 'high' ? "bg-high" : priority === 'medium' ? "bg-mid" : "bg-low";

    const div = document.createElement('div')
    div.classList.add('card')
    div.draggable= true
    div.id = String(task.id)
    
    div.innerHTML=`
      <div class="task-title">${task.title}</div>
      <div class="priority-str ${bgColorClass}">${priority}</div>
      <div class="duedate-text">${task.deadline?`Due: ${task.deadline}`:""}</div>
    `

    div.addEventListener("dragstart", (event) => dragstartHandler(event))

    //modal class trigger
    div.addEventListener('click',()=>
      (document.querySelector(".item-modal") as HTMLDivElement)?.classList.add(".item-modal"))
    container.appendChild(div)
})
}