export const templates = {
  js: `// Welcome to GenEdit!
// Try asking the AI to 'create a function that calculates fibonacci sequence'.

function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
`,
  python: `# Welcome to GenEdit!
# Try asking the AI to 'create a class for a Dog with a bark method'.

def greet(name):
    print(f"Hello, {name}!")

greet("World")
`,
  html: `<!-- Welcome to GenEdit! -->
<!-- Your HTML, CSS, and JS will render in the 'Website Output' tab below. -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GenEdit Sandbox</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
      display: grid;
      place-content: center;
      min-height: 100vh;
      margin: 0;
      background-color: #f0f2f5;
      color: #1c1e21;
    }
    .container {
      text-align: center;
    }
    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      background-color: white;
      cursor: pointer;
      font-size: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello, World!</h1>
    <p>This is your sandboxed environment.</p>
    <button id="color-btn">Change Color</button>
  </div>
  <script>
    const btn = document.getElementById('color-btn');
    const colors = ['#e0f7fa', '#e8eaf6', '#fce4ec', '#f3e5f5'];
    btn.addEventListener('click', () => {
      document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    });
  </script>
</body>
</html>
`,
};
