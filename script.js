// DOM elements
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Initialize the app
function init() {
    renderTodos();
    updateStats();
    
    // Event listeners
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTodo();
    });
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTodos();
        });
    });
}

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();
    if (text) {
        const newTodo = {
            id: Date.now(),
            text,
            completed: false
        };
        
        todos.push(newTodo);
        saveTodos();
        todoInput.value = '';
        renderTodos();
        updateStats();
    }
}

// Render todos based on current filter
function renderTodos() {
    todoList.innerHTML = '';
    
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });
    
    if (filteredTodos.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = currentFilter === 'all' ? 
            'No tasks yet. Add one above!' : 
            currentFilter === 'active' ? 
            'No active tasks!' : 
            'No completed tasks!';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        emptyMessage.style.color = '#95a5a6';
        todoList.appendChild(emptyMessage);
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item' + (todo.completed ? ' completed' : '');
            li.dataset.id = todo.id;
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">Delete</button>
            `;
            
            const checkbox = li.querySelector('.checkbox');
            const deleteBtn = li.querySelector('.delete-btn');
            
            checkbox.addEventListener('change', function() {
                toggleComplete(todo.id);
            });
            
            deleteBtn.addEventListener('click', function() {
                deleteTodo(todo.id);
            });
            
            todoList.appendChild(li);
        });
    }
}

// Toggle todo completion status
function toggleComplete(id) {
    todos = todos.map(todo => 
        todo.id === id ? {...todo, completed: !todo.completed} : todo
    );
    saveTodos();
    renderTodos();
    updateStats();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
}

// Update stats
function updateStats() {
    totalCount.textContent = todos.length;
    completedCount.textContent = todos.filter(todo => todo.completed).length;
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Initialize the app
init();
