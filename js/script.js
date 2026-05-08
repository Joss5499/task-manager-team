// ===============================
// 🚀 TASK MANAGER TEAM
// Archivo: script.js
// ===============================

// ---------- ELEMENTOS DOM ----------
const taskInput = document.getElementById("taskInput");
const prioritySelect = document.getElementById("priority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const filterButtons = document.querySelectorAll(".filters button");

const totalTasksEl = document.querySelectorAll(".card p")[0];
const completedTasksEl = document.querySelectorAll(".card p")[1];
const urgentTasksEl = document.querySelectorAll(".card p")[2];

// ---------- ESTADO ----------
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "Todas";

// ---------- INICIALIZAR ----------
renderTasks();
updateDashboard();

// ===============================
// AGREGAR TAREA
// ===============================
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {

    const text = taskInput.value.trim();
    const priority = prioritySelect.value;

    if (text === "") {
        shakeInput();
        return;
    }

    const newTask = {
        id: Date.now(),
        text,
        priority,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("✅ Tarea agregada");

    taskInput.value = "";
}

// ===============================
// RENDERIZAR TAREAS
// ===============================
function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    // ---------- FILTROS ----------
    if (currentFilter === "Pendientes") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "Completadas") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // ---------- ORDENAR ----------
    filteredTasks.sort((a, b) => {
        const priorities = {
            "Alta": 1,
            "Media": 2,
            "Baja": 3
        };

        return priorities[a.priority] - priorities[b.priority];
    });

    // ---------- SI NO HAY TAREAS ----------
    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <div class="empty-message">
                <h2>📭 No hay tareas</h2>
            </div>
        `;

        return;
    }

    // ---------- CREAR TARJETAS ----------
    filteredTasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.classList.add("task-card");

        if (task.completed) {
            taskCard.classList.add("completed");
        }

        // ---------- COLOR PRIORIDAD ----------
        let priorityColor = "";

        if (task.priority === "Alta") {
            priorityColor = "#ff4d4d";
        }

        if (task.priority === "Media") {
            priorityColor = "#ffaa00";
        }

        if (task.priority === "Baja") {
            priorityColor = "#00c853";
        }

        taskCard.innerHTML = `
        
            <div class="task-info">

                <div class="task-header">
                    <h3>${task.text}</h3>

                    <span class="priority"
                        style="background:${priorityColor}">
                        ${task.priority}
                    </span>
                </div>

                <small>
                    📅 ${task.createdAt}
                </small>

            </div>

            <div class="task-actions">

                <button class="complete-btn">
                    ${task.completed ? "↩️" : "✅"}
                </button>

                <button class="delete-btn">
                    🗑️
                </button>

            </div>
        
        `;

        // ---------- EVENTOS ----------
        const completeBtn = taskCard.querySelector(".complete-btn");

        completeBtn.addEventListener("click", () => {
            toggleTask(task.id);
        });

        const deleteBtn = taskCard.querySelector(".delete-btn");

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskList.appendChild(taskCard);

        // ---------- ANIMACIÓN ----------
        setTimeout(() => {
            taskCard.classList.add("show");
        }, 50);

    });
}

// ===============================
// COMPLETAR TAREA
// ===============================
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("🎯 Estado actualizado");
}

// ===============================
// ELIMINAR TAREA
// ===============================
function deleteTask(id) {

    const confirmDelete = confirm("¿Eliminar esta tarea?");

    if (!confirmDelete) return;

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

    updateDashboard();

    showToast("🗑️ Tarea eliminada");
}

// ===============================
// FILTROS
// ===============================
filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        // quitar activos
        filterButtons.forEach(btn => {
            btn.classList.remove("active-filter");
        });

        // activar actual
        button.classList.add("active-filter");

        currentFilter = button.textContent;

        renderTasks();
    });

});

// ===============================
// DASHBOARD
// ===============================
function updateDashboard() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const urgent = tasks.filter(task =>
        task.priority === "Alta"
    ).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalTasksEl.textContent = total;

    completedTasksEl.textContent = `${percentage}%`;

    urgentTasksEl.textContent = urgent;
}

// ===============================
// LOCAL STORAGE
// ===============================
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ===============================
// SHAKE INPUT
// ===============================
function shakeInput() {

    taskInput.classList.add("shake");

    setTimeout(() => {
        taskInput.classList.remove("shake");
    }, 500);

    showToast("⚠️ Escribe una tarea");
}

// ===============================
// TOAST NOTIFICATION
// ===============================
function showToast(message) {

    const toast = document.createElement("div");

    toast.classList.add("toast");

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show-toast");
    }, 100);

    setTimeout(() => {

        toast.classList.remove("show-toast");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 2500);
}

// ===============================
// MODO OSCURO AUTOMÁTICO
// ===============================
const darkMode = window.matchMedia("(prefers-color-scheme: dark)");

if (darkMode.matches) {
    document.body.classList.add("dark-mode");
}

// ===============================
// EFECTO PARALLAX SUAVE
// ===============================
document.addEventListener("mousemove", (e) => {

    const cards = document.querySelectorAll(".card");

    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    cards.forEach(card => {

        card.style.transform = `
            rotateY(${x * 8}deg)
            rotateX(${y * -8}deg)
        `;
    });
});

// ===============================
// SONIDO INTERACTIVO OPCIONAL
// ===============================
function playClickSound() {

    const audio = new Audio(
        "https://www.soundjay.com/buttons/sounds/button-16.mp3"
    );

    audio.volume = 0.1;

    audio.play();
}

document.addEventListener("click", () => {
    playClickSound();
});

// ===============================
// BUSCADOR DINÁMICO (SE CREA SOLO)
// ===============================
const searchInput = document.createElement("input");

searchInput.placeholder = "🔍 Buscar tareas...";

searchInput.classList.add("search-input");

document.querySelector("main")
    .insertBefore(searchInput, document.querySelector(".filters"));

searchInput.addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const cards = document.querySelectorAll(".task-card");

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if (text.includes(value)) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
});

// ===============================
// FRASE MOTIVACIONAL
// ===============================
const motivationalMessages = [
    "🚀 Sigue avanzando",
    "🔥 Tú puedes",
    "📚 Un paso a la vez",
    "💡 Organiza y conquista",
    "🎯 Mantén el enfoque",
    "⚡ Productividad máxima"
];

const randomMessage = motivationalMessages[
    Math.floor(Math.random() * motivationalMessages.length)
];

const messageEl = document.createElement("h2");

messageEl.textContent = randomMessage;

messageEl.style.textAlign = "center";
messageEl.style.marginBottom = "20px";
messageEl.style.opacity = "0.8";

document.querySelector("main")
    .prepend(messageEl);

// ===============================
// ANIMACIÓN SCROLL
// ===============================
window.addEventListener("scroll", () => {

    const scroll = window.scrollY;

    document.body.style.backgroundPositionY =
        `${scroll * 0.5}px`;
});

// ===============================
// WELCOME
// ===============================
setTimeout(() => {

    showToast("👋 Bienvenido al Task Manager");

}, 1000);
// =========================
// DARK MODE
// =========================

const themeToggle = document.getElementById("themeToggle");

// Verificar tema guardado
if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";

}

// Evento click
themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    // Guardar tema
    if(document.body.classList.contains("dark-mode")){

        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";

    }else{

        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";

    }

});