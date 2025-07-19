export const templates = {
  web: `<!-- 
  Welcome to your Web Project!
  
  This editor currently handles one file at a time.
  To work on your project:
  1. Paste the HTML content here to see the structure.
  2. To edit CSS, replace the content with your CSS code.
  3. To edit JS, replace the content with your JavaScript code.
  
  The 'Website Output' will render this HTML, which links to style.css and script.js.
  For a true multi-file experience, this functionality would need to be built out.
-->

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GenEdit Web Project</title>
  <!-- The editor doesn't host separate files, so these links are for structure. -->
  <!-- <link rel="stylesheet" href="style.css"> -->
  <style>
    /* CSS */
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
      display: grid;
      place-content: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f0f2f5;
      color: #1c1e21;
      transition: background-color 0.3s ease;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    button {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <!-- HTML -->
  <div class="container">
    <h1>Hello, Web!</h1>
    <p>This is your sandboxed environment for HTML, CSS, and JavaScript.</p>
    <button id="action-btn">Click Me!</button>
  </div>

  <!-- <script src="script.js"></script> -->
  <script>
    // JavaScript
    const button = document.getElementById('action-btn');
    const heading = document.querySelector('h1');
    const colors = ['#e0f7fa', '#e8eaf6', '#fce4ec', '#f3e5f5', '#fff3e0'];
    
    let clickCount = 0;

    button.addEventListener('click', () => {
      clickCount++;
      heading.textContent = \`Clicked \${clickCount} times\`;
      document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    });
  </script>
</body>
</html>
`,
  python: `# Welcome to GenEdit!
# Try asking the AI to 'create a class for a Dog with a bark method'.

def greet(name):
    print(f"Hello, {name}!")

greet("World")
`,
  react: `import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// NOTE: This is a simulated React environment. 
// For a full Next.js app, use a proper setup.

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>React Counter</h1>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
`,
  vue: `<div id="app">
  <h1>{{ message }}</h1>
  <button @click="reverseMessage">Reverse Message</button>
</div>

<script src="https://unpkg.com/vue@3"></script>
<script>
  Vue.createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    },
    methods: {
      reverseMessage() {
        this.message = this.message.split('').reverse().join('')
      }
    }
  }).mount('#app')
</script>
`,
};
