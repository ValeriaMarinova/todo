const input = document.querySelector("[data-text-field]");
const container = document.querySelector("[data-todo-container]");
const deletedContainer = document.querySelector("[data-deleted-container]"); 
const addElement = document.querySelector("[button-add-task]");

let toDoList = []; 
let deletedTasks = [];
let returnTask = [];

function main() {
    renderTodoList();
    renderDeletedTasks();
}

function addBtn() {
        addElement.textContent = "Добавить задачу";
        addElement.className = "add";
        addElement.addEventListener("click", handlerClick); 
        return addElement;
        } 

function handlerClick() {
        const newText = input.value.trim();
        if (newText === "") return;
        const timeAdd = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        });
            toDoList.push({
                text: newText,
                timeAdd: timeAdd,
            }),
            input.value = "";
            // renderTodoList();
            main();
        }
    
function createDeleteButton() {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.className = "delete-btn";
    return deleteBtn;
}

function deleteClick(index) {
    const timeDel = new Date().toLocaleDateString([], { 
        hour: '2-digit', 
        minute: '2-digit'
    });

    deletedTasks.push({
        task: toDoList[index],
        deletedAt: timeDel
    });

    console.log(deletedTasks);

    toDoList.splice(index, 1);
    main();
}

function delBtn(index, todoElement) {
    const deleteBtn = createDeleteButton();
    deleteBtn.addEventListener("click", () => deleteClick(index));
    todoElement.appendChild(deleteBtn);
}

function retBtn(index, todoElementRet) {
    const returnBtn = document.createElement("button");
    returnBtn.textContent = "Вернуть";
    // returnBtn.className = "edit-btn";
    returnBtn.className = "return-btn";

    returnBtn.addEventListener("click", () => handlerClickRet(index));
    todoElementRet.appendChild(returnBtn);
    return returnBtn;
};

function handlerClickRet(index) {
    toDoList.push(deletedTasks[index].task);
        console.log(deletedTasks[index].task);
        deletedTasks.splice(index, 1);
        console.log(deletedTasks[index]);

        main();
};

function createInput(type,value) {
    const input = document.createElement("input");
    input.type = type;
    input.value = value;
    return input;
}

function createEditInput(currentText) {
    return createInput("text", currentText);
}

function editClick(index, listElement) {
    const timeEdit = new Date().toLocaleDateString([], { 
        hour: '2-digit', 
        minute: '2-digit'
    });
    const nowText = listElement.querySelector("span").textContent;

    const editInput = createEditInput(nowText);
    listElement.innerHTML = "";
    listElement.appendChild(editInput);

    editInput.focus();
    editInput.addEventListener("keydown", (e) => {
        editSave(e, editInput, index, timeEdit, listElement, toDoList);
    });
}

function editSave(e, editInput, index, timeEdit, listElement, toDoList) {
    if (e.key === "Enter") {
        const newText = editInput.value.trim();
        if (newText) {
        toDoList[index] = {
        text: newText, 
        editedAt: timeEdit,
        timestamp: Date.now()
        };
        main();
        }
    }
}

function handleEditClick(index, listElement, toDoList){
    editClick(index,listElement,toDoList)
}

function editBtn(index, listElement) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "Редактировать";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => handleEditClick(index,listElement,toDoList));
    return editBtn;
}

function renderDeletedTasks() {
    deletedContainer.innerHTML = "<h3>Удаленные задачи:</h3>";
    deletedContainer.className = "del-task";
    const headerRow = document.createElement("div");
    deletedContainer.appendChild(headerRow);
    deletedTasks.forEach((task, index) => {
        const taskContainer = document.createElement("div");
        taskContainer.className = "deleted-task";

        const taskEl = document.createElement("div");
        taskEl.className = "deleted-task";
        taskEl.textContent = `${task.task.text} (удалена ${task.deletedAt})`;/////
        taskContainer.appendChild(taskEl);

        retBtn(index, taskContainer);
        deletedContainer.appendChild(taskContainer);
    });
}

function todoText(todo) {
    const todolistText = document.createElement("span");
    const displayTime = todo.editedAt || todo.timeAdd;
    todolistText.textContent = `${todo.text} (${displayTime})`;
    return todolistText;
}

function todoElement(todo, index) {
    const todolistElement = document.createElement("div");

    todolistElement.className = "task-actions";

    todolistElement.appendChild(todoText(todo));
    delBtn(index, todolistElement);
        todolistElement.appendChild(editBtn(index, todolistElement));
        return todolistElement
}

function renderTodoList() {
    container.innerHTML = "";
    const el = document.createElement("div");
    el.appendChild(input);
    el.appendChild(addBtn());
    // el.textContent = task.text; 
    container.appendChild(el);

    toDoList.forEach((todo, index) => {
        container.appendChild(todoElement(todo, index));
    });
}

main();

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const text = input.value.trim();
        if (text) {
            toDoList.push(text);
            input.value = "";
            renderTodoList();
        }
    }
});
