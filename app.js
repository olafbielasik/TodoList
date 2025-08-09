const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const activeList = document.getElementById('active-list');
const completedList = document.getElementById('completed-list');
const activeCount = document.getElementById('active-count');
const completedCount = document.getElementById('completed-count');
const remainingText = document.getElementById('remaining-text');

const storageKey = 'todolist-items-v1';

function load() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : [];
}

function save(items) {
  localStorage.setItem(storageKey, JSON.stringify(items));
  render(items);
}

function addTask(title) {
  const trimmed = title.trim();
  if (!trimmed) return;
  const items = load();
  items.push({ id: crypto.randomUUID(), title: trimmed, done: false, createdAt: Date.now() });
  save(items);
  input.value = '';
  input.focus();
}

function removeTask(id) {
  const items = load().filter(t => t.id !== id);
  save(items);
}

function toggleTask(id) {
  const items = load().map(t => t.id === id ? { ...t, done: !t.done } : t);
  save(items);
}

function itemNode(item) {
  const li = document.createElement('li');
  li.className = 'todo-item';

  const btn = document.createElement('button');
  btn.className = 'check' + (item.done ? ' completed' : '');
  btn.setAttribute('aria-label', item.done ? 'Mark as active' : 'Mark as completed');
  btn.addEventListener('click', () => toggleTask(item.id));
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  const span = document.createElement('span');
  span.className = 'label' + (item.done ? ' completed' : '');
  span.textContent = item.title;

  const del = document.createElement('button');
  del.className = 'remove';
  del.setAttribute('aria-label', 'Remove task');
  del.textContent = '×';
  del.addEventListener('click', () => removeTask(item.id));

  li.append(btn, span, del);
  return li;
}

function render(items = load()) {
  const active = items.filter(t => !t.done).sort((a,b)=>a.createdAt-b.createdAt);
  const completed = items.filter(t => t.done).sort((a,b)=>a.createdAt-b.createdAt);

  activeList.innerHTML = '';
  completedList.innerHTML = '';

  active.forEach(t => activeList.appendChild(itemNode(t)));
  completed.forEach(t => completedList.appendChild(itemNode(t)));

  activeCount.textContent = `(${active.length})`;
  completedCount.textContent = `(${completed.length})`;
  remainingText.textContent = `${active.length} of ${items.length} tasks remaining`;
}

addBtn.addEventListener('click', () => addTask(input.value));
input.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(input.value) });

render();
