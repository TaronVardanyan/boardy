<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
  <h1>Boardy</h1>
  <p>Boardy is a project aimed at creating a collaborative whiteboard tool similar to Miro. It leverages modern web technologies to offer a reliable platform for real-time collaboration and content creation.</p>

  <h2>Features</h2>
  <ul>
    <li><strong>Authentication</strong>: Integrate robust authentication with <code>@clerk/nextjs</code>.</li>
    <li><strong>Real-time Collaboration</strong>: Implement real-time features with <code>@liveblocks/client</code>, <code>@liveblocks/node</code>, and <code>@liveblocks/react</code>.</li>
    <li><strong>UI Components</strong>: Access a collection of UI components from Radix UI for building modern interfaces.</li>
    <li><strong>State Management</strong>: Utilize <code>zustand</code> for state management.</li>
    <li><strong>Styling</strong>: Use Tailwind CSS and related plugins for styling and animations.</li>
    <li><strong>Type Safety</strong>: Ensure type safety with TypeScript.</li>
  </ul>

  <h2>Getting Started</h2>
  <ol>
    <li><strong>Installation</strong>: Clone the repository and install dependencies.</li>
    <pre><code>git clone https://github.com/TaronVardanyan/boardy.git
cd boardy
bun install
</code></pre>
    <li><strong>Development</strong>: Start the development server.</li>
    <pre><code>bun dev
</code></pre>
    <li><strong>Building</strong>: Build the project for production.</li>
    <pre><code>bun build
</code></pre>
    <li><strong>Start</strong>: Start the production server.</li>
    <pre><code>bun start
</code></pre>
    <li><strong>Lint</strong>: Lint the codebase.</li>
    <pre><code>bun lint
</code></pre>
    <li><strong>Format</strong>: Check the codebase formatting.</li>
    <pre><code>bun format
</code></pre>
    <li><strong>Format Fix</strong>: Fix the codebase formatting.</li>
    <pre><code>bun format:fix
</code></pre>
  </ol>

  <h2>Scripts</h2>
  <ul>
    <li><code>dev</code>: Start the development server using Next.js.</li>
    <li><code>build</code>: Build the project using Next.js for production.</li>
    <li><code>start</code>: Start the production server using Next.js.</li>
    <li><code>lint</code>: Lint the codebase using ESLint.</li>
    <li><code>format</code>: Check the codebase formatting using Prettier.</li>
    <li><code>format:fix</code>: Fix the codebase formatting using Prettier.</li>
  </ul>

  <h2>Contributing</h2>
  <p>We welcome contributions to Boardy! To contribute:</p>
  <ol>
    <li>Fork the repository.</li>
    <li>Create a new branch (<code>git checkout -b feature/my-feature</code>).</li>
    <li>Commit your changes (<code>git commit -am 'Add new feature'</code>).</li>
    <li>Push to the branch (<code>git push origin feature/my-feature</code>).</li>
    <li>Create a new Pull Request.</li>
  </ol>

  <h2>License</h2>
  <p>This project is licensed under the <a href="LICENSE">MIT License</a>.</p>
</body>
</html>
