
export const templates = {
  web: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Click Counter</title>
</head>
<body>
  <div class="container">
    <h1>Colorful Counter</h1>
    <p>Click the button to increase the count and change the color.</p>
    <div id="counter-display">0</div>
    <button id="click-btn">Click Me!</button>
  </div>
</body>
</html>`,
    css: `body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  background-color: #f0f2f5;
  color: #333;
  text-align: center;
}

.container {
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #1c1e21;
  margin-bottom: 0.5rem;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

#counter-display {
  font-size: 5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
  transition: color 0.3s ease;
}

#click-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.1s;
}

#click-btn:hover {
  background-color: #0056b3;
}

#click-btn:active {
  transform: scale(0.98);
}`,
    js: `document.addEventListener('DOMContentLoaded', () => {
  const counterDisplay = document.getElementById('counter-display');
  const clickBtn = document.getElementById('click-btn');

  let count = 0;
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];
  let colorIndex = 0;

  clickBtn.addEventListener('click', () => {
    // Increment count
    count++;
    counterDisplay.textContent = count;

    // Change color
    colorIndex = (colorIndex + 1) % colors.length;
    counterDisplay.style.color = colors[colorIndex];
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
