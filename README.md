# How To Start the React App

1. **Install Dependencies**  
   ```bash
   npm install
   ```  
   This pulls in React, Vite (or CRA), and any other packages listed in `package.json`.

2. **Run the Dev Server**  
   ```bash
   npm run dev
   ```  
   By default, the app will open on [http://localhost:5173](http://localhost:5173) if using Vite, or [http://localhost:3000](http://localhost:3000) if using CRA.

3. **Preview**  
   - A local URL is printed in the terminal.  
   - Open it in a browser to see the chatbot UI.

---

# Connecting to the Backend

Inside **`App.jsx`**, there’s a **fetch** call for the main chat endpoint:

```jsx
const response = await fetch("/api/v1/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "YOUR_API_KEY_HERE"
  },
  body: JSON.stringify({
    messages: [...],
    context: {
      job_title: ...
    },
    sessionState: null
  })
});
```

### Which Lines to Change

1. **Endpoint URL**  
   If your backend is **not** at the same origin (e.g., `localhost:3000` vs. `localhost:8080`), you need to provide the full path, like:
   ```js
   fetch("http://localhost:8080/api/v1/chat", { ... })
   ```
   or
   ```js
   fetch("https://mybackend.example.com/api/v1/chat", { ... })
   ```

2. **API Key Header**  
   - If your backend requires an API key, replace `"YOUR_API_KEY_HERE"` with the correct key.  
   - If it doesn’t require a key, remove the `X-API-KEY` line altogether:
     ```js
     headers: {
       "Content-Type": "application/json"
     }
     ```

3. **Body JSON**  
   - Make sure `messages`, `context`, and `sessionState` are structured the way the backend expects.  
   - If you rename fields (e.g., `job_title` to something else), update them here.

**Example** of a changed snippet in `App.jsx`:

```jsx
const response = await fetch("http://localhost:8080/api/v1/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // Remove or update if not needed
    "X-API-KEY": "my-real-api-key-123"
  },
  body: JSON.stringify({
    messages: [
      { content: userText, role: "user" }
    ],
    context: {
      job_title: jobTitle
    },
    sessionState: null
  })
});
```

---

## Summary

- **Start**: `npm install` + `npm run dev` or `npm start`.  
- **Change**: In **`App.jsx`**, locate the `fetch("/api/v1/chat", { ... })` lines. That’s where you:  
  1) Replace `"/api/v1/chat"` with your **real server** URL.  
  2) Adjust **API key** if your server requires one.  
  3) Update the **body** structure if your backend’s contract is different (field names, optional overrides, etc.).
