// ================== SAMPLE DATA ==================

const complaints = [
  {
    id: "C-001",
    title: "Broken Streetlight",
    category: "Streetlight",
    status: "Pending",
    priority: "Normal",
    location: "Purok 2",
    date: "2025-12-01",
    description: "The streetlight near the barangay hall is not working.",
  },
  {
    id: "C-002",
    title: "Loud Karaoke at Night",
    category: "Noise",
    status: "In Progress",
    priority: "Urgent",
    location: "Purok 5",
    date: "2025-12-02",
    description: "Neighbors play loud karaoke past midnight.",
  },
  {
    id: "C-003",
    title: "Uncollected Garbage",
    category: "Garbage",
    status: "Resolved",
    priority: "Normal",
    location: "Purok 1",
    date: "2025-11-29",
    description: "Garbage has not been collected for 3 days.",
  },
];

let currentComplaint = null;

// ================== HELPERS ==================

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.remove("active-screen");
  });
  const target = document.getElementById(id);
  if (target) target.classList.add("active-screen");
}

function statusClass(status) {
  if (status === "Resolved") return "status-resolved";
  if (status === "Pending") return "status-pending";
  if (status === "In Progress") return "status-progress";
  return "";
}

function updateStats() {
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-pending").textContent = pending;
  document.getElementById("stat-resolved").textContent = resolved;
}

function renderComplaints() {
  const recentContainer = document.getElementById("recent-complaints");
  const listContainer = document.getElementById("complaints-container");
  const adminTableBody = document.getElementById("admin-table-body");

  recentContainer.innerHTML = "";
  listContainer.innerHTML = "";
  adminTableBody.innerHTML = "";

  // Dashboard: show up to 3 recent complaints
  complaints.slice(0, 3).forEach((c) => {
    const card = document.createElement("div");
    card.className = "complaint-card";
    card.innerHTML = `
      <div class="complaint-header">
        <h3>${c.title}</h3>
        <span class="status-chip ${statusClass(c.status)}">${c.status}</span>
      </div>
      <p class="complaint-meta">${c.category} • ${c.location} • ${c.date}</p>
      <p class="complaint-desc">${c.description}</p>
      <button class="btn-secondary btn-small" data-id="${c.id}" data-goto="complaint-details">
        View Details
      </button>
    `;
    recentContainer.appendChild(card);
  });

  // Full complaint list
  complaints.forEach((c) => {
    const card = document.createElement("div");
    card.className = "complaint-card";
    card.dataset.status = c.status;
    card.innerHTML = `
      <div class="complaint-header">
        <h3>${c.title}</h3>
        <span class="status-chip ${statusClass(c.status)}">${c.status}</span>
      </div>
      <p class="complaint-meta">ID: ${c.id} • ${c.category} • ${c.location}</p>
      <p class="complaint-meta">Date: ${c.date} • Priority: ${c.priority}</p>
      <p class="complaint-desc">${c.description}</p>
      <button class="btn-secondary btn-small" data-id="${c.id}" data-goto="complaint-details">
        View Details
      </button>
    `;
    listContainer.appendChild(card);
  });

  // Admin table
  complaints.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>Sample Resident</td>
      <td>${c.category}</td>
      <td>${c.priority}</td>
      <td>${c.status}</td>
      <td>${c.date}</td>
    `;
    tr.addEventListener("click", () => openComplaintDetails(c.id));
    adminTableBody.appendChild(tr);
  });

  updateStats();
}

function openComplaintDetails(id) {
  const c = complaints.find((x) => x.id === id);
  if (!c) return;
  currentComplaint = c;

  document.getElementById("detail-complaint-title").textContent = c.title;
  document.getElementById("detail-title").textContent = `Complaint: ${c.id}`;
  document.getElementById("detail-id").textContent = c.id;
  document.getElementById("detail-category").textContent = c.category;
  document.getElementById("detail-location").textContent = c.location;
  document.getElementById("detail-date").textContent = c.date;
  document.getElementById("detail-description").textContent = c.description;

  const statusChip = document.getElementById("detail-status");
  statusChip.textContent = c.status;
  statusChip.className = `status-chip ${statusClass(c.status)}`;

  const timeline = document.getElementById("detail-timeline");
  timeline.innerHTML = `
    <li><span>${c.date}</span> Complaint submitted</li>
    <li><span>${c.date}</span> Current status: ${c.status}</li>
  `;

  showScreen("complaint-details");
}

// Filter list by status
function applyStatusFilter() {
  const value = document.getElementById("status-filter").value;
  const cards = document.querySelectorAll("#complaints-container .complaint-card");
  cards.forEach((card) => {
    const s = card.dataset.status;
    if (value === "all" || value === s) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

// ================== EVENT WIRING ==================

document.addEventListener("DOMContentLoaded", () => {
  renderComplaints();

  // navigation buttons (top nav + others with data-screen)
  document.querySelectorAll("[data-screen]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = btn.getAttribute("data-screen");
      if (target) {
        e.preventDefault();
        showScreen(target);
      }
    });
  });

  // buttons that open complaint details from cards
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-goto='complaint-details']");
    if (btn) {
      const id = btn.getAttribute("data-id");
      openComplaintDetails(id);
    }
  });

  // auth tab switching
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const mode = tab.getAttribute("data-auth");
      const loginForm = document.getElementById("login-form");
      const regForm = document.getElementById("register-form");

      if (mode === "login") {
        loginForm.classList.remove("hidden");
        regForm.classList.add("hidden");
      } else {
        regForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
      }
    });
  });

  // fake login: just go to dashboard
  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    showScreen("resident-dashboard");
  });

  // fake register: after register, go to dashboard
  document.getElementById("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    showScreen("resident-dashboard");
  });

  // submit complaint: add to local list only
  document.getElementById("complaint-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("cf-title").value.trim();
    const category = document.getElementById("cf-category").value;
    const desc = document.getElementById("cf-desc").value.trim();
    const location = document.getElementById("cf-location").value.trim();
    const priority = document.querySelector("input[name='priority']:checked").value;

    if (!title || !category || !desc) return;

    const id = `C-${String(complaints.length + 1).padStart(3, "0")}`;
    const today = new Date().toISOString().slice(0, 10);

    complaints.unshift({
      id,
      title,
      category,
      status: "Pending",
      priority,
      location: location || "N/A",
      date: today,
      description: desc,
    });

    // reset form
    e.target.reset();
    document.querySelector("input[name='priority'][value='Normal']").checked = true;

    renderComplaints();
    showScreen("complaint-list");
    alert("Complaint submitted.");
  });

  // status filter
  document.getElementById("status-filter").addEventListener("change", applyStatusFilter);

  // simple profile save + logout
  const profileForm = document.getElementById("profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Profile saved (demo only).");
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      alert("Logged out (demo only).");
      showScreen("login-screen");
    });
  }
});
