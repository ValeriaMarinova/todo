const input = document.querySelector("[data-text-field]");
const container = document.querySelector("[data-todo-container]");
const deletedContainer = document.querySelector("[data-deleted-container]"); 

let testList = [];
let deletedTasks = [];
let returnTask = [];

function addBtn() {
    const addElement = document.createElement("button");
    addElement.textContent = "Добавить задачу";
    addElement.className = "add-btn";

    addElement.addEventListener("click", () => {
        const newText = input.value.trim();
        if (newText === "") return;
        const timeAdd = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        testList.push(`${newText} (${timeAdd})`);
        input.value = "";
        renderTodoList();
    })
    return addElement;
}

function createDeleteButton() {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.className = "delete-btn";
    return deleteBtn;
}

function deleteClick(index) {
    const timeDel = new Date().toLocaleDateString([], { hour: '2-digit', minute: '2-digit'});
    deletedTasks.push(`${testList[index]} (${timeDel})`);
    testList.splice(index, 1);
    renderTodoList();
    renderDeletedTasks();
}

function delBtn(index, todoElement) {
    const deleteBtn = createDeleteButton();
    deleteBtn.addEventListener("click", () => deleteClick(index));
    todoElement.appendChild(deleteBtn);
}

function retBtn(index, todoElementRet) {
    const returnBtn = document.createElement("button");
    returnBtn.textContent = "Вернуть";
    returnBtn.className = "edit-btn";

    returnBtn.addEventListener("click", () => {
        testList.push(deletedTasks[index]);
        deletedTasks.splice(index, 1);
        console.log(returnTask);
        renderTodoList();
        renderDeletedTasks();
    });
    todoElementRet.appendChild(returnBtn);
}

function createEditInput(currentText) {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = currentText;
    return editInput;
}

function editSave(e, editInput, index, timeEdit, listElement) {
    if (e.key === "Enter") {
        const newText = editInput.value.trim();
        if (newText) {
            testList[index] = `${newText} (${timeEdit})`;
            renderTodoList();
        }
    }
}

function editClick(index, listElement) {
    const timeEdit = new Date().toLocaleDateString([], { hour: '2-digit', minute: '2-digit'});
    const nowText = listElement.querySelector("span").textContent;

    const editInput = createEditInput(nowText);
    listElement.innerHTML = "";
    listElement.appendChild(editInput);

    editInput.focus();
    editInput.addEventListener("keydown", (e) => {
        editSave(e, editInput, index, timeEdit, listElement);
    });
}

function editBtn(index, listElement) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "Редактировать";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => {
        editClick(index, listElement);
    });
    return editBtn;
}

function renderDeletedTasks() {
    deletedContainer.innerHTML = "<h3>Удаленные задачи:</h3>";
    const headerRow = document.createElement("div");
    deletedContainer.appendChild(headerRow);
    deletedTasks.forEach((task, index) => {
        const taskContainer = document.createElement("div");
        taskContainer.className = "deleted-task";
        const taskEl = document.createElement("div");
        taskEl.className = "deleted-task";
        taskEl.textContent = task;
        taskContainer.appendChild(taskEl);
        retBtn(index, taskContainer);
        deletedContainer.appendChild(taskContainer);
    });
}

function todoText(todo) {
    const todolistText = document.createElement("span");
    todolistText.textContent = todo;
    return todolistText;
}

function todoElement(todo, index) {
    const todolistElement = document.createElement("div");
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
    container.appendChild(el);

    testList.forEach((todo, index) => {
        container.appendChild(todoElement(todo, index));
    });
}
renderTodoList();
renderDeletedTasks();

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const text = input.value.trim();
        if (text) {
            testList.push(text);
            input.value = "";
            renderTodoList();
        }
    }
});
