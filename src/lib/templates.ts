
export const templates = {
  web: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
</head>
<body>
  <h1>Hello, World!</h1>
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
}

h1 {
  color: #1c1e21;
  font-size: 3rem;
}`,
    js: `// This is a simple Hello World example, no JavaScript needed.`,
  },
  python: `print("Hello, World!")
`,
  javascript: `console.log("Hello, World!");
`,
  react: `import React from 'react';

export default function App() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif',
    }}>
      <h1>Hello, World!</h1>
    </div>
  );
}`,
  vue: `import { createApp } from 'vue';

const App = {
  template: \`
    <div :style="{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif',
    }">
      <h1>Hello, World!</h1>
    </div>
  \`
};

createApp(App).mount('#app');`,
  java: `class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`,
  go: `package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}`,
  csharp: `using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, World!");
    }
}`,
};
