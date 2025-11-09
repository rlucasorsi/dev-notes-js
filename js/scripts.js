// Elementos
const notesContainer = document.querySelector(".notes-container");

const noteInput = document.querySelector("#note-content");

const addNoteBtn = document.querySelector(".add-note");

const searchInput = document.querySelector("#search-input");

const exportBtn = document.querySelector("#exports-notes");

// Funçoes
const showNotes = () => {
  cleanNotes();
  getNotes().forEach((note) => {
    const noteElement = createNote(note.id, note.content, note.fixed);
    notesContainer.appendChild(noteElement);
  });
};

const cleanNotes = () => {
  notesContainer.replaceChildren([]);
};

const addNote = () => {
  const notes = getNotes();

  const noteObject = {
    id: generateId(),
    content: noteInput.value,
    fixed: false,
  };

  const noteElement = createNote(noteObject.id, noteObject.content);

  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  saveNotes(notes);

  noteInput.value = "";
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

  const pinIcon = document.createElement("i");
  pinIcon.classList.add(...["bi", "bi-pin"]);
  element.appendChild(pinIcon);

  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add(...["bi", "bi-x-lg"]);
  element.appendChild(deleteIcon);

  const duplicateIcon = document.createElement("i");
  duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"]);
  element.appendChild(duplicateIcon);

  if (fixed) {
    element.classList.add("fixed");
  }

  // Eventos do elemento
  element.querySelector("textarea").addEventListener("keyup", (e) => {
    const noteContent = e.target.value;

    updateNote(id, noteContent);
  });

  element.querySelector(".bi-pin").addEventListener("click", () => {
    toggleFixNote(id);
  });

  element.querySelector(".bi-x-lg").addEventListener("click", () => {
    deleteNote(id, element);
  });

  element
    .querySelector(".bi-file-earmark-plus")
    .addEventListener("click", () => {
      copyNote(id);
    });
  return element;
};

const deleteNote = (id, element) => {
  const notes = getNotes().filter((note) => note.id !== id);

  saveNotes(notes);

  notesContainer.removeChild(element);
};

const updateNote = (id, newContent) => {
  const notes = getNotes();

  const targetNote = notes.filter((note) => note.id === id)[0];

  targetNote.content = newContent;

  saveNotes(notes);
};

const copyNote = (id) => {
  const notes = getNotes();

  const targetNote = notes.filter((note) => notes.id === id)[0];

  const noteObject = {
    id: generateId(),
    content: targetNote.content,
    fixed: false,
  };

  const noteElement = createNote(
    noteObject.id,
    noteObject.content,
    noteObject.fixed
  );

  notesContainer.appendChild(noteElement);

  notes.push(noteObject);

  saveNotes(notes);
};

const toggleFixNote = (id) => {
  const notes = getNotes();

  const targetNotes = notes.filter((note) => note.id === id)[0];

  targetNotes.fixed = !targetNotes.fixed;

  saveNotes(notes);

  showNotes();
};

// Local Storage
const getNotes = () => {
  const notes = JSON.parse(localStorage.getItem("notes") || "[]");

  const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));
  return orderedNotes;
};

const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

const searchNotes = (search) => {
  const searchResult = getNotes().filter((note) => {
    return note.content.includes(search);
  });

  if (search !== "") {
    cleanNotes();

    searchResult.forEach((note) => {
      const noteElement = createNote(note.id, note.content);
      notesContainer.appendChild(noteElement);
    });

    return;
  }

  cleanNotes();
  showNotes();
};

const exportData = () => {
  const notes = getNotes();

  const csvString = [
    ["ID", "Conteudo", "Fixado"],
    ...notes.map((note) => [note.id, note.content, note.fixed]),
  ]
    .map((e) => e.join(","))
    .join("\n");

  const element = document.createElement("a");
  element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

  element.target = "_blank";

  element.download = "notes.csv";
  element.click();
};

// Eventos
addNoteBtn.addEventListener("click", () => {
  addNote();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;

  searchNotes(search);
});

noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNote();
  }
});

exportBtn.addEventListener("click", () => {
  exportData();
});
// Inicializaçao
showNotes();
