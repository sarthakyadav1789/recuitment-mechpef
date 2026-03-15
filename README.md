# recuitment-mechpef
# MechaPEF — Web Team Recruitment Task

**Mechanical & Production Engineering Forum**
Motilal Nehru National Institute of Technology, Allahabad · Prayagraj

---

## Project Structure

```
mechapef/
├── frontend/
│   ├── index.html    ← Mechanical Showcase Webpage
│   ├── style.css     ← Styles (dark industrial theme)
│   └── app.js        ← Frontend logic (registration form + table)
├── backend/
│   ├── server.js     ← Express API server
│   └── package.json  ← Backend dependencies
└── README.md
```

---

## Frontend

Open `frontend/index.html` directly in a browser **or** serve with any static server:

```bash
# Option A – Python
cd frontend
python3 -m http.server 8080

# Option B – VS Code Live Server
# Right-click index.html → Open with Live Server
```

### Features
- 6 interactive mechanical concept cards (flip on hover)
  - Gear Systems, IC Engine, CNC Machines, Robotics, Hydraulics, Thermodynamics
- Animated SVG visuals for each concept (piston, rotating gears, CNC path, robot arm, fluid flow, heat particles)
- Live event registration form connected to backend
- Registrations table with real-time refresh
- Fully responsive — works on desktop and mobile

---

## Backend

### Prerequisites
- Node.js v18+
- MongoDB running locally on `mongodb://localhost:27017` **or** provide a MongoDB Atlas URI

### Setup & Run

```bash
cd backend
npm install
npm start
```

Server starts at: **http://localhost:3000**

### Environment Variables (optional)

| Variable    | Default                                   | Description              |
|-------------|-------------------------------------------|--------------------------|
| `PORT`      | `3000`                                    | HTTP port                |
| `MONGO_URI` | `mongodb://localhost:27017/mechapef`      | MongoDB connection string |

To use a custom URI:
```bash
MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/mechapef" node server.js
```

---

## API Endpoints

### `POST /register`
Register a participant for an event.

**Request Body (JSON):**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@mnnit.ac.in",
  "eventName": "RoboWars Championship"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful.",
  "registration": { "_id": "...", "name": "...", "email": "...", "eventName": "...", "createdAt": "..." }
}
```

---

### `GET /registrations`
Fetch all registrations.

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "registrations": [ { ... }, { ... } ]
}
```

---

## Tech Stack

| Layer    | Technology               |
|----------|--------------------------|
| Frontend | HTML5, CSS3, Vanilla JS  |
| Backend  | Node.js, Express.js      |
| Database | MongoDB (via Mongoose)   |

---

## Connect Frontend to Backend

The frontend defaults to `http://localhost:3000`. To change this, edit the first line of `frontend/app.js`:

```js
const API_BASE = 'http://localhost:3000'; // ← change to your deployed URL
```

---

*MechaPEF · MNNIT Allahabad · @mechapef_mnnit*
