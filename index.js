const exitButton = document.querySelector('.exit');
const card = document.querySelector('.card');
const open = document.querySelector('.open');
const create = document.querySelector('.note');
const notesContainer = document.querySelector('.fake-note');
const textarea = document.querySelector('.note-textarea');
const noNotesMessage = document.querySelector('.no-notes');
let editingNote = null;

exitButton.addEventListener('click', () => {
  card.style.display = 'none';
});

open.addEventListener('click', () => {
  card.style.display = 'block';
  textarea.value = ""; 
});

create.addEventListener("click", () => {
  const noteText = textarea.value;
  if (noteText.trim() !== '') {
    if (editingNote) {
      editingNote.firstChild.textContent = noteText;
      editingNote.firstChild.setAttribute('data-full-text', noteText);
      editingNote = null;
    } else {
      let noteContainer = document.createElement("div");
      let inputBox = document.createElement("button");
      let img = document.createElement("img");

      if (noteText.length > 20) {
        inputBox.textContent = noteText.slice(0, 20 - 3) + '...';
      } else {
        inputBox.textContent = noteText;
      }

      inputBox.className = "fake-button";
      inputBox.setAttribute('data-full-text', noteText);

      img.src = "images/garbage-removebg-preview (1).png";
      img.className = "garbage-img";
      inputBox.appendChild(img);
      noteContainer.appendChild(inputBox);
      notesContainer.appendChild(noteContainer);

      img.addEventListener("click", (event) => {
        event.stopPropagation();
        const confirmDelete = window.confirm("Are you sure you want to delete this note?");
        if (confirmDelete) {
          noteContainer.remove();
          saveNotes();
          checkNoteAvailability();
        }
      });

      inputBox.addEventListener("click", () => {
        card.style.display = 'block';
        textarea.value = inputBox.getAttribute('data-full-text');
        editingNote = noteContainer;
      });
    }

    textarea.value = "";
    card.style.display = 'none';
    saveNotes();
    location.reload();
  }
});

function saveNotes() {
  const noteContainers = Array.from(notesContainer.children);
  const notes = noteContainers.map((container) => {
    const noteText = container.firstChild.getAttribute('data-full-text');
    return { truncatedText: truncateText(noteText), fullText: noteText };
  });
  localStorage.setItem('notes', JSON.stringify(notes));
  checkNoteAvailability();
}

function loadNotes() {
  const savedNotes = localStorage.getItem('notes');
  if (savedNotes) {
    const notes = JSON.parse(savedNotes);
    for (const note of notes) {
      let noteContainer = document.createElement("div");
      let inputBox = document.createElement("button");
      let img = document.createElement("img");

      inputBox.textContent = truncateText(note.fullText);
      inputBox.className = "fake-button";
      inputBox.setAttribute('data-full-text', note.fullText);

      img.src = "images/garbage-removebg-preview (1).png";
      img.className = "garbage-img";
      inputBox.appendChild(img);
      noteContainer.appendChild(inputBox);
      notesContainer.appendChild(noteContainer);

      img.addEventListener("click", (event) => {
        event.stopPropagation();
        const confirmDelete = window.confirm("Are you sure you want to delete this note?");
        if (confirmDelete) {
          document.title = "Note Deletion Confirmation"; // Change the pop-up window title
          noteContainer.remove();
          saveNotes();
        }
      });

      inputBox.addEventListener("click", () => {
        card.style.display = 'block';
        textarea.value = inputBox.getAttribute('data-full-text');
        editingNote = noteContainer;
      });
    }
  }
  checkNoteAvailability();
}

function truncateText(text) {
  const maxLength = 20;
  if (text.length > maxLength) {
    return text.slice(0, maxLength - 3) + '...';
  }
  return text;
}

function checkNoteAvailability() {
  const noteContainers = Array.from(notesContainer.children);
  if (noteContainers.length > 0) {
    noNotesMessage.style.display = 'none';
  } else {
    noNotesMessage.style.display = 'block';
  }
}

window.addEventListener('load', () => {
  loadNotes();
  card.style.display = 'none';
});
