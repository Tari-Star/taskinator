var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskInProgressEl = document.querySelector("#tasks-in-progress");
var taskCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    //formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
        };

        createTaskEl(taskDataObj);
    }
};
var createTaskEl = function (taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML =
        "<h3 class='task-name'>" +
        taskDataObj.name +
        "</h3><span class='task-type'>" +
        taskDataObj.type +
        "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionEl);
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonel = document.createElement("button");
    editButtonel.textContent = "Edit";
    editButtonel.className = "btn edit-btn";
    editButtonel.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonel);
    //create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);
    // create change status dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.className = "select-status";
    actionContainerEl.appendChild(statusSelectEl);
    // create status options
    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusOptionEl.textContent = statusChoices[i];
        
        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};
var completeEditTask = function (taskName, taskType, taskId) {
    //find task list item with taskId value
    var taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );
    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");
    // remove data attribute from form
    formEl.removeAttribute("data-task-id");
    // update formEl button to go back to saying "Add Task" istead of "Edit Task"
    formEl.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function (event) {
    // get target element from event
    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};
var taskStatusChangeHandler = function (event) {
    console.log(event.target.value);
    var taskId = event.target.getAttribute("data-task-id");

    var taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );
    
    var statusValue = event.target.value.toLowerCase();
  
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === " in progress") {
        taskInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        taskCompletedEl.appendChild(taskSelected);
    }
};

var editTask = function (taskId) {
    console.log(taskId);

    var taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    formEl.setAttribute("data-task-id", taskId);
    formEl.querySelector("#save-task").textContent = "Save Task"
};
var deleteTask = function (taskId) {
    console.log(taskId);

    var taskSelected = document.querySelector(
        ".task-item[data-task-id='" + taskId + "']"
    );
    taskSelected.remove();
};
//create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

//for changing  the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);
