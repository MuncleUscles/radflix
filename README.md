## Introduction

- This boilerplate just uses TypeScript 2.4, Express 4, and Webpack 4
  to print a "hello world" on a default port (3001).
- For development, it uses `nodemon` to monitor source file changes.
- For production, it uses `webpack` to bundle source files.

## Installation

- `npm install -g nodemon ts-node typescript`
- `npm install`
- `npm start` for development; `npm run build` for production

## Rationale

- Minimal: Only include necessary packages and settings for printing "hello world".
- Hot reload: Use `nodemon` instead of `webpack` HMR since `nodemon` is easier and more flexible.
