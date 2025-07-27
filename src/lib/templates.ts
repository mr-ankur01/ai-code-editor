export const templates = {
  web: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeX Web Project</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>`,
    css: `body { 
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
}`,
    js: `const button = document.createElement('button');
button.textContent = 'Click Me!';
document.getElementById('root').appendChild(button);

const heading = document.createElement('h1');
heading.textContent = 'Hello, Web!';
document.getElementById('root').prepend(heading);

const colors = ['#e0f7fa', '#e8eaf6', '#fce4ec', '#f3e5f5', '#fff3e0'];

let clickCount = 0;

button.addEventListener('click', () => {
  clickCount++;
  heading.textContent = \`Clicked \${clickCount} times\`;
  document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
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
