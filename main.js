const taskList = document.querySelector(".task-list");
const addTaskForm = document.querySelector(".add-task form");
const taskNameInput = document.querySelector(".add-task input[name='task-name']");
const taskPriorityInput = document.querySelector(".add-task select[name='task-priority']");
const taskListFilters = document.querySelectorAll(".task-list-filters input[type='checkbox']");
const sortSelect = document.querySelector(".task-list-filters select");
const progressButtons = document.querySelectorAll(".task-list-filters button");

let tasks = [];

// Load tasks from local storage or use default tasks
if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
} else {
    tasks = [
        { name: "サンプルタスク1", priority: "high", progress: "これから", createdAt: Date.now(), updatedAt: Date.now() },
        { name: "サンプルタスク2", priority: "medium", progress: "進行中", createdAt: Date.now(), updatedAt: Date.now() },
        { name: "サンプルタスク3", priority: "low", progress: "完了", createdAt: Date.now(), updatedAt: Date.now() },
    ];
}

// Save tasks to local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add task to list
function addTask(name, priority) {
    const task = {
        name,
        priority,
        progress: "これから",
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    tasks.push(task);
    saveTasks();
    showTasks();
}

// Edit task in list
function editTask(index, name, priority, progress) {
    tasks[index].name = name;
    tasks[index].priority = priority;
    tasks[index].progress = progress;
    tasks[index].updatedAt = Date.now();
    saveTasks();
    showTasks();
}

// Delete task from list
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    showTasks();
}

// Show tasks in list
function showTasks() {
    // Clear task list
    taskList.innerHTML = "";

    // Sort tasks based on selected option
    const sortOption = sortSelect.value;
    switch (sortOption) {
        case "name":
            tasks.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "priority":
            tasks.sort((a, b) => {
                if (a.priority === b.priority) {
                    return a.name.localeCompare(b.name);
                }
                return a.priority.localeCompare(b.priority);
            });
            break;
        case "status":
            tasks.sort((a, b) => {
                if (a.progress === b.progress) {
                    return a.name.localeCompare(b.name);
                }
                return a.progress.localeCompare(b.progress);
            });
            break;
        case "updated":
            tasks.sort((a, b) => b.updatedAt - a.updatedAt);
            break;
        default:
            tasks.sort((a, b) => b.createdAt - a.createdAt);
            break;
    }

    // Filter tasks based on checkbox selection
    const showCompleted = !taskListFilters[0].checked;
    const showHigh = taskListFilters[1].checked;
    const showMedium = taskListFilters[2].checked;
    const showLow = taskListFilters[3].checked;

    // Filter tasks based on progress button selection
    const progressOption = document.querySelector(".task-list-filters button.selected").getAttribute("data-progress");
    let filteredTasks = tasks.filter((task) => {
        if (progressOption === "all") {
            return true;
        } else if (progressOption === "todo") {
            return task.progress === "Todo";
        } else if (progressOption === "in-progress") {
            return task.progress === "In Progress";
        } else if (progressOption === "done") {
            return task.progress === "Done";
        }
    });

    // Hide completed tasks if checkbox is checked
    const hideCompleted = document.querySelector("#hide-completed").checked;
    if (hideCompleted) {
        filteredTasks = filteredTasks.filter((task) => !task.completed);
    }

    // Sort tasks based on selected option
    sortOption = document.querySelector("#sort-tasks").value;
    if (sortOption === "name") {
        filteredTasks.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (sortOption === "priority") {
        filteredTasks.sort((a, b) => b.priority - a.priority);
    } else if (sortOption === "progress") {
        filteredTasks.sort((a, b) => (a.progress > b.progress ? 1 : -1));
    } else if (sortOption === "updated") {
        filteredTasks.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortOption === "created") {
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Clear task list
    taskList.innerHTML = "";

    // Render filtered tasks
    filteredTasks.forEach((task) => {
        const taskEl = createTaskElement(task);
        taskList.appendChild(taskEl);
    });
};

