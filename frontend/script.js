const API_BASE = "http://localhost:5000/api";

const state = {
  tasks: [],
  filter: "all",
  search: ""
};

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function labelStatus(status) {
  return {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed"
  }[status] || status;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

async function loadTasks() {
  try {
    const query = new URLSearchParams();

    if (state.filter !== "all") query.set("status", state.filter);
    if (state.search.trim()) query.set("search", state.search.trim());

    const queryString = query.toString();
    state.tasks = await apiRequest(`/tasks${queryString ? `?${queryString}` : ""}`);

    render();
  } catch (error) {
    $("#taskList").innerHTML = `
      <div class="empty-state">
        <div>⚠️</div>
        <strong>Could not load tasks</strong>
        <span>${escapeHtml(error.message)}</span>
      </div>`;
    showToast(error.message);
  }
}

function render() {
  const allTasks = state.tasks;

  $("#totalCount").textContent = allTasks.length;
  $("#pendingCount").textContent = allTasks.filter(t => t.status === "pending").length;
  $("#progressCount").textContent = allTasks.filter(t => t.status === "in-progress").length;
  $("#completedCount").textContent = allTasks.filter(t => t.status === "completed").length;

  $("#resultText").textContent = `${allTasks.length} task${allTasks.length === 1 ? "" : "s"}`;

  const list = $("#taskList");
  $("#emptyState").classList.toggle("hidden", allTasks.length !== 0);

  list.innerHTML = allTasks.map(task => `
    <div class="task-row">
      <input
        class="task-check"
        type="checkbox"
        ${task.status === "completed" ? "checked" : ""}
        onchange="toggleTask('${task._id}', this.checked)"
        title="Mark completed"
      />

      <div>
        <div class="task-title">${escapeHtml(task.title)}</div>
        <div class="task-description">${escapeHtml(task.description || "No description")}</div>
      </div>

      <span class="badge priority-${task.priority}">${escapeHtml(task.priority)}</span>
      <span class="badge status-${task.status}">${labelStatus(task.status)}</span>

      <div class="row-actions">
        <button class="row-action" onclick="openEdit('${task._id}')" title="Edit">✎</button>
        <button class="row-action delete" onclick="deleteTask('${task._id}')" title="Delete">♜</button>
      </div>
    </div>
  `).join("");
}

async function addTask(event) {
  event.preventDefault();

  const payload = {
    title: $("#titleInput").value,
    description: $("#descriptionInput").value,
    priority: $("#priorityInput").value,
    status: $("#statusInput").value
  };

  try {
    await apiRequest("/tasks", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    $("#taskForm").reset();
    $("#priorityInput").value = "medium";
    $("#statusInput").value = "pending";
    showToast("Task added successfully");
    await loadTasks();
  } catch (error) {
    showToast(error.message);
  }
}

async function toggleTask(id, completed) {
  try {
    await apiRequest(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        status: completed ? "completed" : "pending"
      })
    });
    await loadTasks();
  } catch (error) {
    showToast(error.message);
  }
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  try {
    await apiRequest(`/tasks/${id}`, { method: "DELETE" });
    showToast("Task deleted");
    await loadTasks();
  } catch (error) {
    showToast(error.message);
  }
}

function openEdit(id) {
  const task = state.tasks.find(item => item._id === id);
  if (!task) return;

  $("#editId").value = task._id;
  $("#editTitle").value = task.title;
  $("#editDescription").value = task.description || "";
  $("#editPriority").value = task.priority;
  $("#editStatus").value = task.status;
  $("#editModal").classList.remove("hidden");
}

function closeEdit() {
  $("#editModal").classList.add("hidden");
}

async function saveEdit(event) {
  event.preventDefault();

  const id = $("#editId").value;

  try {
    await apiRequest(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: $("#editTitle").value,
        description: $("#editDescription").value,
        priority: $("#editPriority").value,
        status: $("#editStatus").value
      })
    });

    closeEdit();
    showToast("Task updated");
    await loadTasks();
  } catch (error) {
    showToast(error.message);
  }
}

function setFilter(filter) {
  state.filter = filter;

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });

  loadTasks();
}

$("#taskForm").addEventListener("submit", addTask);
$("#editForm").addEventListener("submit", saveEdit);
$("#closeModal").addEventListener("click", closeEdit);

$("#editModal").addEventListener("click", (event) => {
  if (event.target.id === "editModal") closeEdit();
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelectorAll('[data-action="focus-add"]').forEach(button => {
  button.addEventListener("click", () => {
    $("#titleInput").focus();
    $("#addPanel").scrollIntoView({ behavior: "smooth", block: "center" });
  });
});

let searchTimer;
$("#searchInput").addEventListener("input", (event) => {
  clearTimeout(searchTimer);
  state.search = event.target.value;
  searchTimer = setTimeout(loadTasks, 250);
});

$("#themeButton").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("task-manager-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("task-manager-theme") === "dark") {
  document.body.classList.add("dark");
}

loadTasks();
