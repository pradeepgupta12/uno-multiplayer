# 🎴 UNO Multiplayer Game

A full-stack real-time multiplayer UNO game built with React, Node.js, Express, and Socket.IO.

---

## 🛠️ Tech Stack

| Layer    | Tech                        |
| -------- | --------------------------- |
| Frontend | React 18, Vite, Tailwind CSS |
| Backend  | Node.js, Express.js          |
| Realtime | Socket.IO                    |
| Fonts    | Boogaloo + Nunito (Google)   |

---

## 📁 Project Structure

```
uno-game/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Card.jsx         # UNO card renderer
│   │   │   ├── CardBoard.jsx    # Main game board
│   │   │   ├── PlayerHand.jsx   # Your cards in hand
│   │   │   ├── PlayerList.jsx   # All players list
│   │   │   ├── ColorPicker.jsx  # Wild card color picker
│   │   │   └── Lobby.jsx        # Pre-game lobby
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Join / Create room
│   │   │   └── Game.jsx         # Game orchestrator
│   │   ├── socket/
│   │   │   └── socket.js        # Socket.IO client singleton
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── game/
│   │   ├── deck.js            # Card generation + Fisher-Yates shuffle
│   │   ├── rules.js           # UNO rules & validation
│   │   ├── player.js          # Player model
│   │   └── gameManager.js     # Room & game state management
│   ├── socket/
│   │   └── gameSocket.js      # All Socket.IO event handlers
│   └── index.js               # Express server entry point
│
├── package.json               # Root (server) dependencies
└── README.md
```

---

## 🚀 Setup & Run

### 1. Install all dependencies

```bash
# Install server dependencies (from root)
npm install

# Install client dependencies
cd client && npm install && cd ..
```

Or use the convenience script:

```bash
npm run install:all
```

### 2. Start the backend server

```bash
# From root directory
node server/index.js
```

Server runs on → **http://localhost:3001**

### 3. Start the frontend (new terminal)

```bash
cd client
npm run dev
```

Frontend runs on → **http://localhost:5173**

---

## 🎮 How to Play

1. Open **http://localhost:5173** in your browser
2. Enter your name and click **Create Room**
3. Share the Room ID or the copied link with friends
4. Friends open the same URL, enter their name, select **Join Room**, and paste the Room ID
5. Once 2+ players are in the lobby, the **host** clicks **Start Game**
6. Play UNO!

---

## 🃏 Card Types

| Type    | Cards                                          |
| ------- | ---------------------------------------------- |
| Number  | 0–9 in Red, Green, Blue, Yellow                |
| Action  | Skip, Reverse, Draw 2, Draw 3 (custom)         |
| Wild    | Wild (choose color), Wild +4 (draw 4 + color)  |

---

## ⚙️ Game Rules Implemented

- ✅ Valid move: match color, match value, or wild card
- ✅ Skip: next player loses turn
- ✅ Reverse: direction flips (acts like Skip with 2 players)
- ✅ Draw 2: next player draws 2 and loses turn
- ✅ Draw 3: next player draws 3 and loses turn
- ✅ Wild: choose any color
- ✅ Wild +4: next player draws 4, choose color
- ✅ UNO button when 1 card left
- ✅ Win condition: first player to empty their hand
- ✅ Empty deck reshuffles discard pile automatically
- ✅ All validation on **server side** (no cheating)
- ✅ Multiple isolated rooms supported

---

## 📡 Socket Events

| Direction        | Event          | Payload                            |
| ---------------- | -------------- | ---------------------------------- |
| Client → Server  | `joinRoom`     | `{ roomId, playerName }`           |
| Client → Server  | `startGame`    | `{ roomId }`                       |
| Client → Server  | `playCard`     | `{ roomId, cardId }`               |
| Client → Server  | `drawCard`     | `{ roomId }`                       |
| Client → Server  | `chooseColor`  | `{ roomId, color }`                |
| Client → Server  | `sayUno`       | `{ roomId }`                       |
| Server → Client  | `gameState`    | Full game state (per-player)       |
| Server → Client  | `gameStarted`  | `{ message }`                      |
| Server → Client  | `cardPlayed`   | `{ playerId, card, waitingForColor }` |
| Server → Client  | `cardDrawn`    | `{ card, canPlay }`                |
| Server → Client  | `colorChosen`  | `{ color, playerId }`              |
| Server → Client  | `unoSaid`      | `{ playerId, playerName }`         |
| Server → Client  | `gameOver`     | `{ winner, message }`              |
| Server → Client  | `error`        | `{ message }`                      |

---

## 🌐 Ports

| Service  | Port  | URL                        |
| -------- | ----- | -------------------------- |
| Backend  | 3001  | http://localhost:3001       |
| Frontend | 5173  | http://localhost:5173       |

---

## 🏗️ Multi-Player Testing (Same Machine)

Open multiple browser tabs at **http://localhost:5173** to simulate multiple players. Use different names for each tab.
