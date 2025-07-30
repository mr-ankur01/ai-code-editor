
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
  background-color: #e3f2fd;
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
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];

  const increment = () => {
    setCount(prevCount => prevCount + 1);
    setColorIndex(prevIndex => (prevIndex + 1) % colors.length);
  };

  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      textAlign: 'center', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8'
    }}>
      <h1>React Colorful Counter</h1>
      <p>Click the button to count and change colors.</p>
      <div style={{
        fontSize: '5rem',
        fontWeight: 'bold',
        margin: '1rem 0',
        color: colors[colorIndex],
        transition: 'color 0.3s ease'
      }}>
        {count}
      </div>
      <button 
        style={{ 
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          cursor: 'pointer',
          borderRadius: '8px',
          border: 'none',
          color: 'white',
          backgroundColor: '#007bff'
        }}
        onClick={increment}
      >
        Click me
      </button>
    </div>
  );
}`,
  vue: `import { createApp, ref } from 'vue';

const App = {
  setup() {
    const count = ref(0);
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6', '#1abc9c'];
    const colorIndex = ref(0);

    const increment = () => {
      count.value++;
      colorIndex.value = (colorIndex.value + 1) % colors.length;
    };

    return { 
      count,
      colors,
      colorIndex,
      increment,
    };
  },
  template: \`
    <div :style="{ 
      fontFamily: 'sans-serif', 
      textAlign: 'center', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8'
    }">
      <h1>Vue Colorful Counter</h1>
      <p>Click the button to count and change colors.</p>
      <div :style="{
        fontSize: '5rem',
        fontWeight: 'bold',
        margin: '1rem 0',
        color: colors[colorIndex],
        transition: 'color 0.3s ease'
      }">
        {{ count }}
      </div>
      <button 
        @click="increment"
        :style="{ 
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          cursor: 'pointer',
          borderRadius: '8px',
          border: 'none',
          color: 'white',
          backgroundColor: '#007bff'
        }"
      >
        Click me
      </button>
    </div>
  \`
};

createApp(App).mount('#app');`,
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
