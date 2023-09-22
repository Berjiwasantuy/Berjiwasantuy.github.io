document.getElementById('createTaskButton').addEventListener('click', createNew);
document.getElementById('close').addEventListener('click', closeDialog);

function createNew() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    
    if (taskText === "") {
        showMessage("Input is empty. Please enter a task.");
        return;
    }

    const taskId = generateRandomId();
    const task = createTaskElement(taskId, taskText);

    const backlog = document.getElementById('backlog');
    backlog.appendChild(task);

    taskInput.value = "";
}

function createTaskElement(taskId, taskText) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.id = taskId;
    task.draggable = true;
    task.addEventListener("dragstart", drag);

    const span = document.createElement("span");
    span.textContent = taskText;

    const deleteButton = createButton("Delete", "hapus", taskId);
    const editButton = createButton("Edit", "edit", taskId);
    const moveButton = createButton("Move", "move", taskId);

    task.appendChild(span);
    task.appendChild(deleteButton);
    task.appendChild(editButton);
    task.appendChild(moveButton);

    return task;
}

function createButton(text, functionName, taskId) {
    const button = document.createElement("button");
    button.textContent = text;
    button.title = `Tombol ${text.toLowerCase()} item`;
    button.addEventListener("click", () => window[functionName](taskId));
    return button;
}

function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
}

function showMessage(message) {
    const msgElement = document.querySelector('.msg');
    const dialogElement = document.querySelector('.dialog');
    
    msgElement.textContent = message;
    dialogElement.style.right = '.5rem';
}

function closeDialog() {
    const dialogElement = document.querySelector('.dialog');
    dialogElement.style.right = '-15rem';
}

function move(taskId) {
    const task = document.getElementById(taskId);
    const backlog = document.getElementById('backlog');
    const onProgress = document.getElementById('onprogress');
    const done = document.getElementById('done');

    const currentColumn = task.parentElement;

    if (currentColumn === backlog) {
        backlog.removeChild(task);
        onProgress.appendChild(task);
    } else if (currentColumn === onProgress) {
        onProgress.removeChild(task);
        done.appendChild(task);
    } else if (currentColumn === done) {
        done.removeChild(task);
        backlog.appendChild(task);
    }
}

function hapus(taskId) {
    const task = document.getElementById(taskId);
    task.parentElement.removeChild(task);
}

function edit(taskId) {
    const task = document.getElementById(taskId);
    const editTaskInput = document.getElementById("editTaskInput");
    const saveEditButton = document.getElementById("saveEditButton");
    const cancelEditButton = document.getElementById("cancelEditButton");

    // Populate the edit input with the task text
    editTaskInput.value = task.querySelector("span").textContent;

    // Show the edit dialog
    const dialogElement = document.querySelector('.dialog');
    dialogElement.style.display = 'block';

    // Save the edited task
    saveEditButton.addEventListener("click", () => {
        const editedText = editTaskInput.value.trim();
        if (editedText !== "") {
            task.querySelector("span").textContent = editedText;
            closeEditDialog();
        } else {
            showMessage("Edited input is empty. Please enter a task.");
        }
    });

    // Cancel the edit
    cancelEditButton.addEventListener("click", () => {
        closeEditDialog();
    });
}

function closeEditDialog() {
    const dialogElement = document.querySelector('.dialog');
    dialogElement.style.display = 'none';
}


function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    event.currentTarget.appendChild(document.getElementById(data));
}