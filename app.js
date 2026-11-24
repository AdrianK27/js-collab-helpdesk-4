
import { validateTasks } from "./domain.js";
import { loadTasks, saveTasks } from "./storage.js";
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const importStatus = document.getElementById("importStatus");
const taskForm = document.getElementById("taskForm");
const listDom = document.getElementById("lista");
const submitBtn = document.getElementById("submitbtn");
const filterCheckboxes = document.querySelectorAll(
    '.filters-container input[type="checkbox"]'
);
const importLocalBtn = document.getElementById("importLocalBtn");
let tasks = [];

let isImporting = false;

function setImportBusy(busy) {
    taskForm.querySelectorAll("input, select, button").forEach(element => {
        element.disabled = busy;
    });

    filterCheckboxes.forEach(checkbox => {
        checkbox.disabled = busy;
    });

    document.querySelectorAll(".status-select").forEach(select => {
        select.disabled = busy;
    });

    importFile.disabled = busy;
    importLocalBtn.disabled = busy;
}

try {
    tasks = loadTasks();
} catch (error) {
    console.error("Nie udało się wczytać zgłoszeń:", error);
    document.getElementById("errorContainer").textContent =
        "Nie udało się odczytać zapisanych zgłoszeń!";
}

const renderTasks = (tasksRender) => {
    tasksRender.forEach(elem => {
        const li = document.createElement("li");
        li.innerHTML = `
            <p>Zadanie: ${elem.title}</p>
            <p>Priorytet: ${elem.priority}</p>
            <label for="status-${elem.id}">Status: </label>
            <select class="status-select" data-id="${elem.id}" id="status-${elem.id}">
                <option value="new" ${elem.status === 'new' ? 'selected' : ''}>New</option>
                <option value="doing" ${elem.status === 'doing' ? 'selected' : ''}>Doing</option>
                <option value="done" ${elem.status === 'done' ? 'selected' : ''}>Done</option>
            </select>
        `;
        listDom.appendChild(li);
    });

    statusHandlers();
    visibleTasks(tasksRender, tasks);
};

function filtering() {
    const all = document.getElementById("all").checked;
    const isNew = document.getElementById("new").checked;
    const doing = document.getElementById("doing").checked;
    const done = document.getElementById("done").checked;

    const filteredTasks = tasks.filter(task => {
        if (all) return true;
        if (task.status === "new" && isNew) return true;
        if (task.status === "doing" && doing) return true;
        if (task.status === "done" && done) return true;
        return false;
    });

    listDom.innerHTML = "";
    renderTasks(filteredTasks);
}

const addTask = (title, priority) => {
    if (isImporting) {
    return;
    }

    if (!title || title.trim() === "") {
        console.error("Title cant be empty");
        return;
    }

    if (tasks.length >= 1000) {
        console.error("You cant add more than 1000 tasks");
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        title,
        status: "new",
        priority
    };

 tasks.push(newTask);

if (!saveTasks(tasks)) {
    tasks.pop();
    throw new Error("Nie udało się zapisać danych!");
}

listDom.innerHTML = "";
filtering();
};

const changeStatus = (id, newStatus) => {

    if (isImporting) {
    return;
    }

    const task = tasks.find(task => task.id === id);

    if (!task) {
        console.error("NO such status");
        return;
    }

    task.status = newStatus;
    saveTasks(tasks);
    filtering();
};

const statusHandlers = () => {
    const statusSelects = document.querySelectorAll(".status-select");

    statusSelects.forEach(select => {
        select.addEventListener("change", (e) => {
            const taskId = e.target.getAttribute("data-id");
            const newStatus = e.target.value;
            changeStatus(taskId, newStatus);
        });
    });
};

const visibleTasks = (visible, tasks) => {
    const komunikat = document.getElementById("ilosc");

    if (visible.length === 0) {
        komunikat.innerText = "Brak pasujacych rekordow";
    } else {
        komunikat.innerText =
            `Wyswietlono ${visible.length} z ${tasks.length} rekordow`;
    }
};

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", (e) => {
        const isNew = document.getElementById("new");
        const doing = document.getElementById("doing");
        const done = document.getElementById("done");
        const all = document.getElementById("all");

        if (e.target.id === "all" && e.target.checked) {
            isNew.checked = false;
            doing.checked = false;
            done.checked = false;
        } else if (e.target.checked) {
            all.checked = false;
        }

        if (!isNew.checked && !doing.checked && !done.checked) {
            all.checked = true;
        }

        filtering();
    });
});

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const priority = document.getElementById("priority").value;
    const errorContainer = document.getElementById("errorContainer");

    if (errorContainer) {
        errorContainer.textContent = "";
    }

    try {
        if (!title || title.trim() === "") {
            throw new Error("Wpisz tytuł zadania!");
        }

        if (!priority || priority === "") {
            throw new Error("Wybierz poprawny priorytet z listy!");
        }

        if (title.trim().length < 3 || title.trim().length > 80) {
            throw new Error("Tytuł musi mieć od 3 do 80 znaków!");
        }

        addTask(title, priority);
        document.getElementById("title").value = "";
    } catch (err) {
        console.error("Error:", err.message);
        errorContainer.textContent = err.message;
        errorContainer.style.color = "red";
    }
});

filtering();



async function importFrom(load) {
    if (isImporting) return;

    isImporting = true;
    setImportBusy(true);

    importStatus.textContent = "Trwa importowanie...";
    importStatus.className = "loading";

    try {
        const data = await load();

        const validatedTasks = validateTasks(data);

        const confirmed = confirm(
            "Czy na pewno chcesz zastąpić aktualną listę zgłoszeń?"
        );

        if (!confirmed) {
            importStatus.textContent = "Import anulowany.";
            return;
        }

        if (!saveTasks(validatedTasks)) {
            throw new Error("Nie udało się zapisać danych!");
        }

        tasks = validatedTasks;
        filtering();

        importStatus.textContent =
            `Import zakończony pomyślnie! Liczba zgłoszeń: ${tasks.length}`;

        importStatus.className = "success";

    } catch (error) {
        console.error("Błąd importu:", error);

        importStatus.textContent = error.message;
        importStatus.className = "error";

    } finally {
        isImporting = false;
        setImportBusy(false);
    }
}

importFile.addEventListener("change", async () => {
    const file = importFile.files[0];

    if (!file) return;

    await importFrom(async () => {
        const text = await file.text();
        return JSON.parse(text);
    });

    importFile.value = "";
});

async function loadLocalTasks() {
    const response = await fetch("./tickets.json");

    if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
    }

    return await response.json();
}


importLocalBtn.addEventListener("click", () => {
    importFrom(loadLocalTasks);
});

exportBtn.addEventListener("click", () => {
    const json = JSON.stringify(tasks, null, 4);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tickets-backup.json";

    link.click();

    URL.revokeObjectURL(url);
});