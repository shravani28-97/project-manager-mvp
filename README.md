# Project Manager MVP

This repository contains the backend code for a **Project Manager MVP** built using Cloudflare Workers. The project includes features for task management, event scheduling, and social media asset organization, tailored to meet the needs of a band manager.

## Features

- Add, view, and delete tasks.
- Add, view, and delete events.
- Add, view, and delete social media asset URLs.

## Backend Code Overview

The backend is implemented using Cloudflare Workers, which provides a serverless environment for handling API requests. It uses Cloudflare’s KV namespace storage for persistent data management.

### Key Sections of the Backend Code

#### 1. Initialization and Main Fetch Handler

The `fetch` function is the main entry point that processes all incoming HTTP requests and directs them to the appropriate route.

#### 2. HTML Response for the User Interface

Serves the main HTML page with a form-based user interface for managing tasks, events, and assets.

#### 3. Task Management API Endpoints

- **`/add-task`**: Adds a new task to the KV namespace.
- **`/view-tasks`**: Retrieves a list of all tasks.
- **`/delete-task`**: Deletes a specified task.

#### 4. Event Scheduling API Endpoints

- **`/add-event`**: Adds a new event with a title and date.
- **`/view-events`**: Retrieves a list of all scheduled events.
- **`/delete-event`**: Deletes a specified event.

#### 5. Social Media Asset Management API Endpoints

- **`/add-asset`**: Adds a new social media asset URL.
- **`/view-assets`**: Retrieves a list of all stored asset URLs.
- **`/delete-asset`**: Deletes a specified asset URL.

#### 6. Default Response for Unknown Routes

Handles unknown routes with a 404 response, ensuring stability and security.

### **Backend Code**

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    console.log("Received request for:", pathname);

    // Serve the main HTML page
    if (pathname === "/") {
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Manager</title>
        </head>
        <body>
          <h1>Project Manager</h1>
          <h2>Task Management</h2>
          <form id="add-task-form">
            <input type="text" id="task-input" placeholder="Enter a task" required>
            <button type="submit">Add Task</button>
          </form>
          <button id="view-tasks-button">View Tasks</button>
          <ul id="task-list"></ul>
        </body>
        </html>
      `, { headers: { "Content-Type": "text/html" } });
    }

    // Task Management API Endpoints
    if (pathname === "/add-task" && request.method === "POST") {
      const { task } = await request.json();
      await env.TASKS.put(task, task);
      return new Response(`Task "${task}" added!`);
    }

    if (pathname === "/view-tasks") {
      const tasks = await env.TASKS.list();
      return new Response(JSON.stringify(tasks.keys.map(task => task.name)));
    }

    if (pathname === "/delete-task" && request.method === "POST") {
      const { task } = await request.json();
      await env.TASKS.delete(task);
      return new Response(`Task "${task}" deleted!`);
    }

    // Event Scheduling API Endpoints
    if (pathname === "/add-event" && request.method === "POST") {
      const { title, date } = await request.json();
      await env.EVENTS.put(title, JSON.stringify({ title, date }));
      return new Response(`Event "${title}" added!`);
    }

    if (pathname === "/view-events") {
      const events = await env.EVENTS.list();
      return new Response(JSON.stringify(events.keys.map(event => event.name)));
    }

    if (pathname === "/delete-event" && request.method === "POST") {
      const { title } = await request.json();
      await env.EVENTS.delete(title);
      return new Response(`Event "${title}" deleted!`);
    }

    // Social Media Asset Management API Endpoints
    if (pathname === "/add-asset" && request.method === "POST") {
      const { url } = await request.json();
      await env.ASSETS.put(url, url);
      return new Response(`Asset URL "${url}" added!`);
    }

    if (pathname === "/view-assets") {
      const assets = await env.ASSETS.list();
      return new Response(JSON.stringify(assets.keys.map(asset => asset.name)));
    }

    if (pathname === "/delete-asset" && request.method === "POST") {
      const { url } = await request.json();
      await env.ASSETS.delete(url);
      return new Response(`Asset URL "${url}" deleted!`);
    }

    // Default response for unknown routes
    return new Response("Unknown route", { status: 404 });
  },
};
