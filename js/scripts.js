// Elementos
const notesContainer = document.querySelector(".notes-container");

const notesInput = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

// Funçoes
const showNotes = () => {
  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);
    notesContainer.appendChild(noteElement);
  });
};

const addNote = () => {
  const notes = getNotes();

  const noteObject = {
    id: generateId(),
    content: notesInput.value,
    fixed: false,
  };

  const noteElement = createNote(noteObject.id, noteObject.content);

  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  saveNotes(notes);

  notesInput.value = "";
};

const generateId = () => {
  return Math.floor(Math.random() * 5000);
};

const createNote = (id, content, fixed) => {
  const element = document.createElement("div");
  element.classList.add("note");

  const textArea = document.createElement("textarea");

  textArea.value = content;

  textArea.placeholder = "Adicione algum texto";

  element.appendChild(textArea);

  return element;
};

// Local Storage
const getNotes = () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  return notes;
};

const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

// Eventos
addNoteBtn.addEventListener("click", () => {
  addNote();
});

// Inicializaçao
showNotes();
