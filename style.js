// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
  projectId: "YOUR_FIREBASE_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Google Login
const loginSection = document.getElementById("login-section");
const gameSection = document.getElementById("game-section");
const loginBtn = document.getElementById("google-login");
const playerInfo = document.getElementById("player-info");

loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(result => {
    loginSection.classList.add("hidden");
    gameSection.classList.remove("hidden");
    playerInfo.textContent = Welcome, ${result.user.displayName};
  });
});

// Tic Tac Toe logic
const cells = document.querySelectorAll(".cell");
const restartBtn = document.getElementById("restart");
const switchModeBtn = document.getElementById("switch-mode");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let vsAI = false;

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(bd, player) {
  return winCombos.some(combo => combo.every(idx => bd[idx] === player));
}

function checkTie(bd) {
  return bd.every(cell => cell !== "");
}

function aiMove() {
  let emptyIndices = board.map((v,i) => v === "" ? i : null).filter(v=>v!==null);
  let move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  board[move] = "O";
  cells[move].textContent = "O";
}

function handleClick(e) {
  const idx = e.target.dataset.index;
  if(board[idx] !== "") return;

  board[idx] = currentPlayer;
  e.target.textContent = currentPlayer;

  if(checkWinner(board, currentPlayer)){
    alert(${currentPlayer} wins!);
    return;
  }

  if(checkTie(board)){
    alert("Tie game!");
    return;
  }

  if(vsAI && currentPlayer === "X"){
    aiMove();
    if(checkWinner(board, "O")){
      alert("AI wins!");
      return;
    }
    if(checkTie(board)){
      alert("Tie game!");
      return;
    }
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

cells.forEach(cell => cell.addEventListener("click", handleClick));

restartBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
});

switchModeBtn.addEventListener("click", () => {
  vsAI = !vsAI;
  switchModeBtn.textContent = vsAI ? "Switch to Multiplayer" : "Switch to AI";
  restartBtn.click();
});
