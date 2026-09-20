# TaskFlow – Kanban Task Manager

A responsive Kanban board to organise tasks across To Do, In Progress and Done columns. Built with plain HTML, CSS and JavaScript, with no frameworks or libraries.

🔗 **Live Demo:** [https://SakshiMane710.github.io/ResumeProject2/](https://SakshiMane710.github.io/ResumeProject2/)  
📁 **Repository:** [https://github.com/SakshiMane710/ResumeProject2](https://github.com/SakshiMane710/ResumeProject2)

<img width="1917" height="922" alt="image" src="https://github.com/user-attachments/assets/59149375-9535-4d72-9704-8220d3b61775" />


## Features
- Drag and drop tasks between columns (HTML5 Drag and Drop API)
- Add, edit and delete tasks with a modal form
- Priority levels (Low / Medium / High) with colour-coded cards
- Due dates with overdue (red) and due today (orange) badges
- Live search by title or description
- Filter tasks by priority, working together with search
- Task count shown on each column
- Export the board as a JSON file and import it back
- Light / dark theme
- Data saved automatically in the browser using localStorage
- Fully responsive layout for desktop, tablet and mobile

## Tech Stack
| Technology | Usage |
|---|---|
| HTML5 | Semantic structure, modal form, Drag and Drop API |
| CSS3 | Flexbox, Grid, CSS variables, media queries, transitions |
| JavaScript (ES6) | DOM manipulation, event delegation, array methods, localStorage, File API |
| Git & GitHub | Version control and hosting (GitHub Pages) |

## How It Works
- Tasks are stored as an array of objects: `{ id, title, description, priority, dueDate, status }`.
- A render function rebuilds each column from the array using filter() and map().
- When a card is dropped in a new column, its status is updated, the data is saved to localStorage, and the board is re-rendered.
- Search and priority filters run on the array before rendering, so the board updates instantly.
- Export uses a Blob to download the data as JSON. Import reads the file with FileReader, validates it, and loads the tasks.

## Project Structure
```text
├── index.html
├── style.css
├── script.js
├── screenshots/
└── README.md
```

## What I Learned
- Handling DOM events efficiently with event delegation
- Using the HTML5 Drag and Drop API
- Saving and loading data with localStorage and JSON
- Building responsive layouts and a dark mode with CSS variables
- Working with files in the browser using Blob and FileReader
- Managing changes with Git commits and deploying with GitHub Pages

## Future Improvements
- Connect to a Spring Boot + MySQL backend using REST APIs
- User login and authentication
- Reordering cards within a column
- Touch-screen drag and drop support
