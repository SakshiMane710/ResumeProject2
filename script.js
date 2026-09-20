// ====================
// CLEANUP (safety)
// ====================
document.querySelectorAll('span.delete-btn').forEach(btn => {
  if (!btn.closest('.card')) btn.remove();
});

// ====================
// DRAG & DROP SETUP
// ====================

const lists = document.querySelectorAll('.list');

function initCard(card) {
  card.addEventListener('dragstart', dragStart);
  card.addEventListener('dragend', dragEnd);
  
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) return;
    activeCard = card;
    modalTitle.textContent = card.querySelector('.card-text')?.textContent || '';
    modalDescription.value = card.dataset.description || '';
    const dueDateInput = document.getElementById('modalDueDate');
    if (dueDateInput) dueDateInput.value = card.dataset.dueDate || '';
    document.getElementById('cardModal').classList.remove('hidden');
  });

  addDeleteButton(card);
  updateDueDateBadge(card);
}

document.querySelectorAll('.card').forEach(initCard);

lists.forEach(list => {
  list.addEventListener('dragover', dragOver);
  list.addEventListener('dragenter', dragEnter);
  list.addEventListener('dragleave', dragLeave);
  list.addEventListener('drop', dragDrop);
});

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
  setTimeout(() => e.target.classList.add('dragging'), 0);
}

function dragEnd(e) {
  e.target.classList.remove('dragging');
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add('over');
}

function dragLeave(e) {
  this.classList.remove('over');
}

function dragDrop(e) {
  e.preventDefault();

  const id = e.dataTransfer.getData('text/plain');
  const card = document.getElementById(id);

  let target = e.target;
  while (!target.classList.contains('list')) {
    target = target.parentNode;
  }

  target.insertBefore(card, target.querySelector('.add-card'));
  target.classList.remove('over');

  updateDueDateBadge(card);
  saveBoardToLocalStorage();
  updateCounts();
}

// ====================
// ADD CARD
// ====================

document.querySelectorAll('.add-card button').forEach(button => {
  button.addEventListener('click', () => {
    const wrapper = button.parentElement;
    const input = wrapper.querySelector('.card-input');
    const priority = wrapper.querySelector('.card-priority').value;
    const dueDateInput = wrapper.querySelector('.card-due-date');
    const text = input.value.trim();
    const dueDate = dueDateInput ? dueDateInput.value : '';

    if (!text) return;

    const card = document.createElement('div');
    card.className = `card ${priority}`;
    card.draggable = true;
    card.id = `card-${Date.now()}`;

    const textSpan = document.createElement('span');
    textSpan.className = 'card-text';
    textSpan.textContent = text;

    card.appendChild(textSpan);
    
    if (dueDate) {
      card.dataset.dueDate = dueDate;
    }
    
    initCard(card);

    wrapper.closest('.list').insertBefore(card, wrapper);
    input.value = '';
    if (dueDateInput) dueDateInput.value = '';

    saveBoardToLocalStorage();
    updateCounts();
  });
});

// ====================
// DELETE CARD
// ====================

function addDeleteButton(card) {
  if (card.querySelector('.delete-btn')) return;

  const btn = document.createElement('span');
  btn.className = 'delete-btn';
  btn.textContent = '❌';

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this card?')) {
      card.remove();
      saveBoardToLocalStorage();
      updateCounts();
    }
  });

  card.appendChild(btn);
}

// ====================
// LOCAL STORAGE
// ====================

function saveBoardToLocalStorage() {
  const data = [];

  document.querySelectorAll('.card').forEach(card => {
    const textSpan = card.querySelector('.card-text');
    if (!textSpan) return;

    data.push({
      id: card.id,
      text: textSpan.textContent,
      priority: card.classList.contains('high')
        ? 'high'
        : card.classList.contains('medium')
        ? 'medium'
        : 'low',
      listId: card.closest('.list').id,
      description: card.dataset.description || '',
      dueDate: card.dataset.dueDate || ''
    });
  });

  localStorage.setItem('kanbanBoard', JSON.stringify(data));
}

function loadBoardFromLocalStorage() {
  const saved = localStorage.getItem('kanbanBoard');
  if (!saved) return;

  // Remove existing cards
  document.querySelectorAll('.card').forEach(card => card.remove());

  JSON.parse(saved).forEach(item => {
    const card = document.createElement('div');
    card.className = `card ${item.priority}`;
    card.draggable = true;
    card.id = item.id;

    const textSpan = document.createElement('span');
    textSpan.className = 'card-text';
    textSpan.textContent = item.text;

    card.appendChild(textSpan);
    if (item.description) card.dataset.description = item.description;
    if (item.dueDate) card.dataset.dueDate = item.dueDate;
    
    initCard(card);

    const list = document.getElementById(item.listId);
    list.insertBefore(card, list.querySelector('.add-card'));
  });
  updateCounts();
}

loadBoardFromLocalStorage();



// dark mode toggle
const themeToggle = document.getElementById('toggleTheme');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '🌞 Toggle Light Mode';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '🌞 Toggle Light Mode' : '🌙 Toggle Dark Mode';
});




// ====================
// MODAL SETUP
// ====================

// Open modal logic is now handled in initCard() so it works for all new cards


const modal = document.getElementById('cardModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalDueDate = document.getElementById('modalDueDate');
const saveBtn = document.getElementById('saveCardDetails');
const closeBtn = document.querySelector('.close-btn');

let activeCard = null; // the card being edited

// Save card details
saveBtn.addEventListener('click', () => {
  if (!activeCard) return;

  // Save title
  const textSpan = activeCard.querySelector('.card-text');
  if (textSpan) {
    textSpan.textContent = modalTitle.textContent.trim();
  }

  // Save description and due date as dataset
  activeCard.dataset.description = modalDescription.value.trim();
  activeCard.dataset.dueDate = modalDueDate.value;
  updateDueDateBadge(activeCard);

  modal.classList.add('hidden');
  saveBoardToLocalStorage(); // include description in save later
  updateCounts();
});

// Close modal
closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// ====================
// NEW FEATURES
// ====================

// Updates or creates the due date badge on a card
function updateDueDateBadge(card) {
  let badge = card.querySelector('.due-date-badge');
  const dueDate = card.dataset.dueDate;
  
  if (!dueDate) {
    if (badge) badge.remove();
    return;
  }
  
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'due-date-badge';
    card.appendChild(badge);
  }
  
  badge.textContent = dueDate;
  badge.className = 'due-date-badge'; // reset classes
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // parse the date from input which is YYYY-MM-DD
  const [year, month, day] = dueDate.split('-');
  const due = new Date(year, month - 1, day);
  
  const isDone = card.closest('.list')?.id === 'list3';
  
  if (isDone) {
    badge.classList.add('future');
  } else if (due < today) {
    badge.classList.add('overdue');
  } else if (due.getTime() === today.getTime()) {
    badge.classList.add('today');
  } else {
    badge.classList.add('future');
  }
}

// Updates the card count next to each column title
function updateCounts() {
  document.querySelectorAll('.list').forEach(list => {
    // Count all cards that are not hidden by the filter
    const count = list.querySelectorAll('.card:not(.hidden-filter)').length;
    const countSpan = list.querySelector('.count');
    if (countSpan) countSpan.textContent = count;
  });
}

// Search and Priority Filter
const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
let searchTimeout;

// Filters cards by title, description and priority dropdown
function filterCards() {
  const text = searchInput.value.toLowerCase();
  const priority = priorityFilter.value;
  
  document.querySelectorAll('.card').forEach(card => {
    const title = card.querySelector('.card-text').textContent.toLowerCase();
    const desc = (card.dataset.description || '').toLowerCase();
    const matchText = title.includes(text) || desc.includes(text);
    const matchPriority = priority === 'all' || card.classList.contains(priority);
    
    if (matchText && matchPriority) {
      card.classList.remove('hidden-filter');
    } else {
      card.classList.add('hidden-filter');
    }
  });
  updateCounts();
}

if(searchInput) {
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterCards, 300);
  });
}

if(priorityFilter) {
  priorityFilter.addEventListener('change', filterCards);
}

// Export / Import Board
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

// Exports the current board as board.json
if(exportBtn) {
  exportBtn.addEventListener('click', () => {
    const data = localStorage.getItem('kanbanBoard') || '[]';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'board.json';
    a.click();
    URL.revokeObjectURL(url);
  });
}

if(importBtn) {
  // Triggers the hidden file input
  importBtn.addEventListener('click', () => importFile.click());
}

if(importFile) {
  // Reads and loads a JSON file when selected
  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!Array.isArray(data)) throw new Error('Not an array');
        localStorage.setItem('kanbanBoard', JSON.stringify(data));
        loadBoardFromLocalStorage();
      } catch (err) {
        alert('Invalid file format. Please upload a valid board.json file.');
      }
      importFile.value = ''; // Reset input
    };
    reader.readAsText(file);
  });
}

// Checks for any overdue tasks on page load and shows a popup alert
function checkOverdueTasks() {
  const overdueCards = [];
  
  document.querySelectorAll('.card').forEach(card => {
    // Skip if task is in "done" column
    if (card.closest('.list')?.id === 'list3') return;
    
    const dueDate = card.dataset.dueDate;
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [year, month, day] = dueDate.split('-');
      const due = new Date(year, month - 1, day);
      
      if (due < today) {
        const title = card.querySelector('.card-text')?.textContent || 'Untitled Task';
        overdueCards.push(title);
      }
    }
  });

  if (overdueCards.length > 0) {
    // Show alert slightly after page load so it doesn't block rendering
    setTimeout(() => {
      alert(`You have ${overdueCards.length} overdue task(s)!\n\n` + overdueCards.map(t => `- ${t}`).join('\n'));
    }, 500);
  }
}

// Run the check when the page loads
checkOverdueTasks();


