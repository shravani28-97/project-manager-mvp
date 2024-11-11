export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    console.log("Received request for:", pathname);

    // Serve the main HTML, CSS, and JS directly
    if (pathname === "/") {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Project Manager</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f0f0f0; padding: 20px; }
            .container { max-width: 600px; margin: auto; background: #fff; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
            button, input { width: 100%; padding: 10px; margin: 5px 0; }
            ul { list-style: none; padding: 0; }
            li { padding: 10px; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Project Manager</h1>

            <!-- Task Management -->
            <h2>Tasks</h2>
            <form id="task-form">
              <input type="text" id="task-input" placeholder="Enter a task" required>
              <button type="submit">Add Task</button>
            </form>
            <button id="view-tasks">View Tasks</button>
            <button id="delete-task">Delete Task</button>
            <ul id="task-list"></ul>

            <!-- Event Management -->
            <h2>Events</h2>
            <form id="event-form">
              <input type="text" id="event-title" placeholder="Event Title" required>
              <input type="date" id="event-date" required>
              <button type="submit">Add Event</button>
            </form>
            <button id="view-events">View Events</button>
            <button id="delete-event">Delete Event</button>
            <ul id="event-list"></ul>

            <!-- Social Media Assets -->
            <h2>Social Media Assets</h2>
            <form id="asset-form">
              <input type="url" id="asset-url" placeholder="Enter asset URL" required>
              <button type="submit">Add Asset</button>
            </form>
            <button id="view-assets">View Assets</button>
            <button id="delete-asset">Delete Asset</button>
            <ul id="asset-list"></ul>

            <script>
              // Add Task
              document.getElementById('task-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const task = document.getElementById('task-input').value;
                const res = await fetch('/add-task', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ task })
                });
                alert(await res.text());
              });

              // View Tasks
              document.getElementById('view-tasks').addEventListener('click', async () => {
                const res = await fetch('/view-tasks');
                const tasks = await res.json();
                document.getElementById('task-list').innerHTML = tasks.map(task => \`<li>\${task}</li>\`).join('');
              });

              // Delete Task
              document.getElementById('delete-task').addEventListener('click', async () => {
                const task = prompt("Enter the task to delete:");
                if (task) {
                  const res = await fetch('/delete-task', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ task })
                  });
                  alert(await res.text());
                }
              });

              // Add Event
              document.getElementById('event-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const title = document.getElementById('event-title').value;
                const date = document.getElementById('event-date').value;
                const res = await fetch('/add-event', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title, date })
                });
                alert(await res.text());
              });

              // View Events
              document.getElementById('view-events').addEventListener('click', async () => {
                const res = await fetch('/view-events');
                const events = await res.json();
                document.getElementById('event-list').innerHTML = events.map(event => \`<li>\${event.title} on \${event.date}</li>\`).join('');
              });

              // Delete Event
              document.getElementById('delete-event').addEventListener('click', async () => {
                const title = prompt("Enter the event title to delete:");
                if (title) {
                  const res = await fetch('/delete-event', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title })
                  });
                  alert(await res.text());
                }
              });

              // Add Asset
              document.getElementById('asset-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const url = document.getElementById('asset-url').value;
                const res = await fetch('/add-asset', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ url })
                });
                alert(await res.text());
              });

              // View Assets
              document.getElementById('view-assets').addEventListener('click', async () => {
                const res = await fetch('/view-assets');
                const assets = await res.json();
                document.getElementById('asset-list').innerHTML = assets.map(asset => \`<li>\${asset}</li>\`).join('');
              });

              // Delete Asset
              document.getElementById('delete-asset').addEventListener('click', async () => {
                const url = prompt("Enter the asset URL to delete:");
                if (url) {
                  const res = await fetch('/delete-asset', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                  });
                  alert(await res.text());
                }
              });
            </script>
          </div>
        </body>
        </html>
      `;
      return new Response(htmlContent, { headers: { 'Content-Type': 'text/html' } });
    }

    // API Routes for Tasks
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

    // API Routes for Events
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

    // API Routes for Assets
    if (pathname === "/add-asset" && request.method === "POST") {
      const { url } = await request.json();
      await env.ASSETS.put(url, url);
      return new Response(`Asset "${url}" added!`);
    }
    if (pathname === "/view-assets") {
      const assets = await env.ASSETS.list();
      return new Response(JSON.stringify(assets.keys.map(asset => asset.name)));
    }
    if (pathname === "/delete-asset" && request.method === "POST") {
      const { url } = await request.json();
      await env.ASSETS.delete(url);
      return new Response(`Asset "${url}" deleted!`);
    }

    return new Response("Unknown route", { status: 404 });
  },
};

