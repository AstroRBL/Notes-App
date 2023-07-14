const exitButton = document.querySelector('.exit');
const card = document.querySelector('.card');
const open = document.querySelector('.open');
const create = document.querySelector('.note');
const notesContainer = document.querySelector('.fake-note');
const textarea = document.querySelector('.note-textarea');
const noNotesMessage = document.querySelector('.no-notes');

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
    let noteContainer = document.createElement("div");
    let inputBox = document.createElement("button");
    let img = document.createElement("img");

    inputBox.textContent = noteText;
    inputBox.className = "fake-button";
    inputBox.setAttribute('data-full-text', noteText); 
    inputBox.setAttribute('title', noteText); 

    img.src = "images/garbage-removebg-preview (1).png";
    img.className = "garbage-img";
    inputBox.appendChild(img);
    noteContainer.appendChild(inputBox);
    notesContainer.appendChild(noteContainer);
    textarea.value = ""; 

    img.addEventListener("click", () => {
      event.stopPropagation(); 
      noteContainer.remove(); 
      saveNotes();
      if (notesContainer.children.length === 0) {
        noNotesMessage.style.display = 'block'; 
      }
    });

    inputBox.addEventListener("click", () => {
      card.style.display = 'block'; 
      textarea.value = inputBox.getAttribute('data-full-text'); 
    });

    card.style.display = 'none';

    saveNotes();

    noNotesMessage.style.display = 'none';
  }

  if (notesContainer.children.length === 0) {
    noNotesMessage.style.display = 'block'; 
  }
});

textarea.addEventListener('input', () => {
  saveNotes(); 
});


function saveNotes() {
  const noteContainers = Array.from(notesContainer.children);
  const notes = noteContainers.map((container) => {
    const noteText = container.firstChild.getAttribute('data-full-text');
    return { truncatedText: truncateText(noteText), fullText: noteText };
  });
  localStorage.setItem('notes', JSON.stringify(notes));
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
      inputBox.setAttribute('title', note.fullText); 

      img.src = "images/garbage-removebg-preview (1).png";
      img.className = "garbage-img";
      inputBox.appendChild(img);
      noteContainer.appendChild(inputBox);
      notesContainer.appendChild(noteContainer);

      img.addEventListener("click", () => {
        noteContainer.remove(); 
        saveNotes(); 
        if (notesContainer.children.length === 0) {
          noNotesMessage.style.display = 'block'; 
        }
      });

      inputBox.addEventListener("click", () => {
        card.style.display = 'block'; 
        textarea.value = inputBox.getAttribute('data-full-text'); 
      });
    }
  }

  if (notesContainer.children.length === 0) {
    noNotesMessage.style.display = 'block'; 
  } else {
    noNotesMessage.style.display = 'none'; 
  }
}


function truncateText(text) {
  if (text.length > 10) {
    return text.slice(0, 10) + '...'; 
  }
  return text;
}

window.addEventListener('load', () => {
  loadNotes();
  card.style.display = 'none'; 
});
