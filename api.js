const API_URL = "https://jsonplaceholder.typicode.com/posts";

let notesData = [];

// DOM Elements
const loadBtn = document.getElementById("load-btn");
const statusEl = document.getElementById("status");
const noteForm = document.getElementById("note-form");
const titleInput = document.getElementById("title-input");
const bodyInput = document.getElementById("body-input");
const submitBtn = document.getElementById("submit-btn");
const notesList = document.getElementById("notes-list");

// Reusable async fetch wrapper with error checking
async function request(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// Task 1: GET (Load 10 notes)
async function loadNotes() {
  statusEl.textContent = "Loading notes...";
  statusEl.className = "loading";
  loadBtn.disabled = true;
  notesList.innerHTML = "";

  try {
    const data = await request(`${API_URL}?_limit=10`);
    notesData = data;
    statusEl.textContent = "Loaded 10 notes from the server.";
    statusEl.className = "success";
    renderNotes();
  } catch (error) {
    statusEl.textContent = `Failed to load notes. Please check your connection.`;
    statusEl.className = "error";
  } finally {
    loadBtn.disabled = false;
  }
}

// Render Notes Function (Handles Empty States & Delete Buttons)
function renderNotes() {
  notesList.innerHTML = "";

  if (notesData.length === 0) {
    notesList.innerHTML = "<p class='empty'>No notes available at the moment.</p>";
    return;
  }

  notesData.forEach((note) => {
    const li = document.createElement("li");
    li.className = "note-card";

    const titleH3 = document.createElement("h3");
    titleH3.textContent = note.title;

    const bodyP = document.createElement("p");
    bodyP.textContent = note.body;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.onclick = () => deleteNote(note.id, li);

    li.appendChild(titleH3);
    li.appendChild(bodyP);
    li.appendChild(deleteBtn);
    notesList.appendChild(li);
  });
}

// Task 2: POST (Create Note)
async function handleCreateNote(e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title || title.length > 100) {
    alert("Title is required and must be under 100 characters.");
    return;
  }

  submitBtn.disabled = true;
  statusEl.textContent = "Publishing note...";
  statusEl.className = "loading";

  try {
    const newNote = { title, body, userId: 1 };
    const response = await request(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });

    // JSONPlaceholder returns id 101 for mock creations
    notesData.unshift(response);
    renderNotes();

    statusEl.textContent = `Note created (status 201, id ${response.id})`;
    statusEl.className = "success";
    noteForm.reset();
  } catch (error) {
    statusEl.textContent = "Error creating note.";
    statusEl.className = "error";
  } finally {
    submitBtn.disabled = false;
  }
}

// Task 3: DELETE (Remove Note)
// Note: JSONPlaceholder is a mock API. It returns a success status (200) 
// but does not actually persist deletions on their backend server. 
// We handle this sensibly by removing the item locally from our array UI.
async function deleteNote(id, element) {
  try {
    await request(`${API_URL}/${id}`, { method: "DELETE" });
    
    // Remove locally from state array
    notesData = notesData.filter((note) => note.id !== id);
    renderNotes();

    statusEl.textContent = `Note ${id} deleted successfully (Mock API).`;
    statusEl.className = "success";
  } catch (error) {
    statusEl.textContent = `Failed to delete note ${id}.`;
    statusEl.className = "error";
  }
}

// Event Listeners
loadBtn.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", handleCreateNote);
