
export const templates = {
  web: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>To-Do List</title>
</head>
<body>
  <div class="container">
    <h1>My To-Do List</h1>
    <div class="input-container">
      <input type="text" id="todo-input" placeholder="Add a new task...">
      <button id="add-task-btn">Add</button>
    </div>
    <ul id="task-list">
      <!-- Tasks will be added here -->
    </ul>
  </div>
</body>
</html>`,
    css: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  margin: 0;
  padding-top: 4rem;
  background-color: #f0f2f5;
  color: #333;
}

.container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #1c1e21;
  margin-bottom: 1.5rem;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

#todo-input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

#add-task-btn {
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

#add-task-btn:hover {
  background-color: #0056b3;
}

#task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.task-item:last-child {
  border-bottom: none;
}

.task-item.completed span {
  text-decoration: line-through;
  color: #aaa;
}

.task-item:hover {
  background-color: #f9f9f9;
}

.task-item button {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #dc3545;
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.task-item:hover button {
  opacity: 1;
}`,
    js: `document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('todo-input');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskList = document.getElementById('task-list');

  // Function to add a new task
  const addTask = () => {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
      alert('Please enter a task!');
      return;
    }

    // Create list item
    const li = document.createElement('li');
    li.className = 'task-item';

    // Create span for task text
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    li.appendChild(taskSpan);

    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      taskList.removeChild(li);
    };
    li.appendChild(deleteBtn);
    
    // Add click event to toggle completion
    li.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            li.classList.toggle('completed');
        }
    });

    taskList.appendChild(li);
    taskInput.value = '';
    taskInput.focus();
  };

  // Event Listeners
  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  // Add a few initial tasks for demonstration
  const initialTasks = ['Learn HTML', 'Learn CSS', 'Learn JavaScript'];
  initialTasks.forEach(task => {
      taskInput.value = task;
      addTask();
  });

});`,
  },
  python: `# Welcome to CodeX!
# Try asking the AI to 'create a class for a Dog with a bark method'.

def greet(name):
    print(f"Hello, {name}!")

greet("World")
`,
  javascript: `// Welcome to CodeX!
// Try asking the AI to 'create a function to sort an array'.

function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet("World");
`,
  react: `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem' }}>
      <h1>React Counter</h1>
      <p>You clicked {count} times</p>
      <button 
        style={{ 
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: '#f0f0f0'
        }}
        onClick={() => setCount(count + 1)}
      >
        Click me
      </button>
    </div>
  );
}`,
  vue: `<template>
  <div :style="{ fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem' }">
    <h1>{{ message }}</h1>
    <button @click="changeMessage" :style="buttonStyle">Click Me</button>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const message = ref('Hello Vue!');
    
    const changeMessage = () => {
      message.value = 'You clicked the button!';
    };

    const buttonStyle = {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      cursor: 'pointer',
      borderRadius: '4px',
      border: '1px solid #ccc',
      backgroundColor: '#f0f0f0'
    };

    return {
      message,
      changeMessage,
      buttonStyle
    };
  }
}
</script>`,
  java: `// Welcome to CodeX!
// Try asking the AI to 'write a method to find the largest number in an array'.

class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
  go: `// Welcome to CodeX!
// Try asking the AI to 'write a function that returns a slice of strings'.

package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}`,
  csharp: `// Welcome to CodeX!
// Try asking the AI to 'create a Person class with Name and Age properties'.

using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
    }
}`,
};
