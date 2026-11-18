
const STORAGE_KEY = "school-helpdesk-tasks";

export function saveTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return true;
    } catch (error) {
        console.error("Błąd zapisu danych:", error);
        return false;
    }
}

export function loadTasks() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
        return [];
    }

    return JSON.parse(savedData);
}
