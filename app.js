/**
 * @file app.js
 * @description Ponto de entrada principal. Inicializa o jogo e gerencia os eventos.
 */

import * as Game from './game.js';
import * as UI from './ui.js';

// Firebase Configuration (REPLACE WITH YOUR ACTUAL CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyDNfnp6wCq31UdgxfV0ya1B_w4Oq-CTnRQ",
  authDomain: "jogo-da-velha-8978b.firebaseapp.com",
  projectId: "jogo-da-velha-8978b",
  storageBucket: "jogo-da-velha-8978b.firebasestorage.app",
  messagingSenderId: "237351816033",
  appId: "1:237351816033:web:a01cdb987935700ffa9320",
  measurementId: "G-P6GT98ZBST"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const restartButton = document.getElementById('restart-button');
const clearScoresButton = document.getElementById('clear-scores-button');
const themeToggle = document.getElementById('checkbox');
const body = document.body;

// New elements for player setup
const playerSetupContainer = document.getElementById('player-setup');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const startGameButton = document.getElementById('start-game-button');
const gameContainer = document.getElementById('game-container');

// Online Multiplayer Elements
const onlineModeButton = document.getElementById('online-mode-button');
const localModeButton = document.getElementById('local-mode-button');
const modeSelectionContainer = document.getElementById('mode-selection');
const onlineGameContainer = document.getElementById('online-game-setup');
const createGameButton = document.getElementById('create-game-button');
const joinGameButton = document.getElementById('join-game-button');
const gameIdInput = document.getElementById('game-id-input');
const onlinePlayerNameInput = document.getElementById('online-player-name');
const gameIdDisplay = document.getElementById('game-id-display');

// Back buttons
const backToModeLocalButton = document.getElementById('back-to-mode-local');
const backToModeOnlineButton = document.getElementById('back-to-mode-online');
const backToModeGameButton = document.getElementById('back-to-mode-game'); // New button

let gameId = null;
let playerSymbol = null; // 'X' or 'O' for the current user
let unsubscribe = null; // Firestore listener unsubscribe function

/**
 * Aplica o tema salvo ou o tema padrão.
 */
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light-mode') {
        body.classList.add('light-mode');
        themeToggle.checked = true;
    } else {
        body.classList.remove('light-mode');
        themeToggle.checked = false;
    }
}

/**
 * Alterna entre o modo claro e escuro.
 */
function toggleTheme() {
    if (themeToggle.checked) {
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    } else {
        body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark-mode');
    }
}

/**
 * Lida com o clique em uma célula do tabuleiro.
 * @param {number} cellIndex - O índice da célula clicada.
 */
async function handleCellClick(cellIndex) {
    if (!gameId) { // Local game logic
        const gameState = Game.getGameState();

        if (!gameState.isGameActive || !Game.handleMove(cellIndex)) {
            return; // Ignora o clique se a jogada for inválida ou o jogo acabou
        }

        UI.updateCell(cellIndex, gameState.currentPlayer);

        const winnerInfo = Game.checkWinner();
        if (winnerInfo) {
            UI.showWinner(winnerInfo.winner, winnerInfo.combination);
            Game.saveScores();
            UI.updateScores(Game.getGameState().scores);
            return;
        }

        if (Game.isDraw()) {
            UI.showDraw();
            return;
        }

        Game.switchPlayer();
        UI.updateStatusMessage(Game.getGameState().currentPlayer);
    } else { // Online game logic
        const gameRef = db.collection('games').doc(gameId);
        const gameDoc = await gameRef.get();
        const gameData = gameDoc.data();

        if (!gameData || gameData.status !== 'playing' || gameData.board[cellIndex] !== null || gameData.currentPlayer !== playerSymbol) {
            return; // Invalid move
        }

        const newBoard = [...gameData.board];
        newBoard[cellIndex] = playerSymbol;

        const nextPlayer = playerSymbol === 'X' ? 'O' : 'X';

        // Check for winner or draw locally before updating Firestore
        // Temporarily set game state for local check
        const tempGameState = Game.getGameState();
        tempGameState.board = newBoard;
        tempGameState.currentPlayer = playerSymbol;

        let winner = null;
        let draw = false;

        const winnerInfo = Game.checkWinner(); // This will use tempGameState
        if (winnerInfo) {
            winner = winnerInfo.winner;
        } else if (Game.isDraw()) {
            draw = true;
        }

        await gameRef.update({
            board: newBoard,
            currentPlayer: nextPlayer,
            winner: winner,
            draw: draw,
            status: winner || draw ? 'finished' : 'playing'
        });
    }
}

/**
 * Lida com o clique no botão de reiniciar.
 */
async function handleRestartClick() {
    if (!gameId) { // Local game logic
        Game.resetGame();
        UI.clearBoard();
        UI.updateStatusMessage(Game.getGameState().currentPlayer);
    } else { // Online game logic
        const gameRef = db.collection('games').doc(gameId);
        await gameRef.update({
            board: Array(9).fill(null),
            currentPlayer: 'X',
            winner: null,
            draw: false,
            status: 'playing' // Or 'waiting' if we want to wait for 2 players again
        });
    }
}

/**
 * Lida com o clique no botão Limpar Placar.
 */
function handleClearScoresClick() {
    Game.clearScores();
    UI.updateScores(Game.getGameState().scores);
}

/**
 * Inicializa o jogo (UI e event listeners).
 */
function initializeGameUI() {
    applyTheme(); // Apply theme on load
    UI.renderBoard(handleCellClick);
    restartButton.addEventListener('click', handleRestartClick);
    clearScoresButton.addEventListener('click', handleClearScoresClick);
    backToModeGameButton.addEventListener('click', () => {
        if (unsubscribe) {
            unsubscribe(); // Unsubscribe from Firestore listener
        }
        showModeSelection();
    });
    themeToggle.addEventListener('change', toggleTheme);
}

/**
 * Atualiza a UI do jogo com base nos dados do Firestore.
 * @param {object} gameData - Dados do documento do jogo no Firestore.
 */
function updateOnlineGameUI(gameData) {
    // Update local game state based on Firestore data
    const gameState = Game.getGameState();
    gameState.board = gameData.board;
    gameState.currentPlayer = gameData.currentPlayer;
    gameState.isGameActive = gameData.status === 'playing';

    // Update UI
    UI.clearBoard(); // Clear board first
    gameData.board.forEach((cell, index) => {
        if (cell) {
            UI.updateCell(index, cell);
        }
    });

    if (gameData.winner) {
        UI.showWinner(gameData.winner, Game.checkWinner().combination); // Re-check winner locally to get combination
    } else if (gameData.draw) {
        UI.showDraw();
    } else {
        UI.updateStatusMessage(gameData.currentPlayer);
    }

    // Update scores (online games don't persist scores in localStorage directly, but we can display them)
    // For simplicity, online scores are not persisted across sessions in this version
    // You would need a more robust user system for that.
    UI.updateScores({ X: 0, O: 0 }); // Reset displayed scores for online game
}

/**
 * Escuta por mudanças no documento do jogo no Firestore.
 * @param {string} id - O ID do jogo.
 */
function listenForGameChanges(id) {
    if (unsubscribe) {
        unsubscribe(); // Unsubscribe from previous listener if any
    }
    const gameRef = db.collection('games').doc(id);
    unsubscribe = gameRef.onSnapshot(doc => {
        if (doc.exists) {
            const gameData = doc.data();
            updateOnlineGameUI(gameData);
        } else {
            alert('Jogo não encontrado ou foi excluído.');
            // Handle game not found (e.g., return to mode selection)
            showModeSelection();
        }
    });
}

/**
 * Gera um ID de jogo único.
 * @returns {string} Um ID de jogo único.
 */
function generateGameId() {
    return Math.random().toString(36).substring(2, 9); // Simple unique ID
}

/**
 * Lida com o clique no botão Criar Novo Jogo.
 */
async function handleCreateGameClick() {
    const playerName = onlinePlayerNameInput.value.trim();
    if (!playerName) {
        alert('Por favor, insira seu nome.');
        return;
    }

    gameId = generateGameId();
    playerSymbol = 'X'; // Creator is always X

    const gameRef = db.collection('games').doc(gameId);
    await gameRef.set({
        board: Array(9).fill(null),
        currentPlayer: 'X',
        status: 'waiting',
        players: {
            X: { id: playerSymbol, name: playerName }
        },
        winner: null,
        draw: false
    });

    localStorage.setItem('onlineGameId', gameId);
    localStorage.setItem('onlinePlayerSymbol', playerSymbol);

    gameIdDisplay.textContent = `ID do Jogo: ${gameId}`; // Display game ID
    gameIdDisplay.style.display = 'block';

    listenForGameChanges(gameId);
    showGameContainer();
    Game.initializePlayers(playerName, 'Aguardando Jogador...'); // Initialize local game state for UI
    UI.updateScores(Game.getGameState().scores);
}

/**
 * Lida com o clique no botão Entrar no Jogo.
 */
async function handleJoinGameClick() {
    const playerName = onlinePlayerNameInput.value.trim();
    const inputGameId = gameIdInput.value.trim();

    if (!playerName || !inputGameId) {
        alert('Por favor, insira seu nome e o ID do Jogo.');
        return;
    }

    const gameRef = db.collection('games').doc(inputGameId);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
        alert('Jogo não encontrado.');
        return;
    }

    const gameData = gameDoc.data();

    if (gameData.players.O) {
        alert('Este jogo já tem dois jogadores.');
        return;
    }

    gameId = inputGameId;
    playerSymbol = 'O'; // Joiner is always O

    await gameRef.update({
        'players.O': { id: playerSymbol, name: playerName },
        status: 'playing' // Game starts when second player joins
    });

    localStorage.setItem('onlineGameId', gameId);
    localStorage.setItem('onlinePlayerSymbol', playerSymbol);

    gameIdDisplay.textContent = `ID do Jogo: ${gameId}`; // Display game ID
    gameIdDisplay.style.display = 'block';

    listenForGameChanges(gameId);
    showGameContainer();
    Game.initializePlayers(gameData.players.X.name, playerName); // Initialize local game state for UI
    UI.updateScores(Game.getGameState().scores);
}

/**
 * Mostra a seleção de modo de jogo.
 */
function showModeSelection() {
    modeSelectionContainer.style.display = 'flex';
    playerSetupContainer.style.display = 'none';
    onlineGameContainer.style.display = 'none';
    gameContainer.style.display = 'none';
    gameContainer.classList.remove('active');
    gameIdDisplay.style.display = 'none'; // Ensure hidden
    gameId = null;
    playerSymbol = null;
    if (unsubscribe) unsubscribe();
}

/**
 * Mostra a configuração do jogo local.
 */
function showLocalSetup() {
    modeSelectionContainer.style.display = 'none';
    playerSetupContainer.style.display = 'flex';
    onlineGameContainer.style.display = 'none';
    gameContainer.style.display = 'none';
    gameContainer.classList.remove('active');
    gameIdDisplay.style.display = 'none'; // Ensure hidden
    gameId = null;
    playerSymbol = null;
    if (unsubscribe) unsubscribe();
}

/**
 * Mostra a configuração do jogo online.
 */
function showOnlineSetup() {
    modeSelectionContainer.style.display = 'none';
    playerSetupContainer.style.display = 'none';
    onlineGameContainer.style.display = 'flex';
    gameContainer.style.display = 'none';
    gameContainer.classList.remove('active');
    gameIdDisplay.style.display = 'none'; // Ensure hidden
    gameId = null;
    playerSymbol = null;
    if (unsubscribe) unsubscribe();
}

/**
 * Mostra o container do jogo.
 */
function showGameContainer() {
    modeSelectionContainer.style.display = 'none';
    playerSetupContainer.style.display = 'none';
    onlineGameContainer.style.display = 'none';
    gameContainer.style.display = 'flex';
    gameContainer.classList.add('active');
    gameIdDisplay.style.display = 'block'; // Ensure visible when game container is shown
}

/**
 * Lida com o clique no botão Iniciar Jogo Local.
 */
function handleStartLocalGameClick() {
    const player1Name = player1NameInput.value.trim();
    const player2Name = player2NameInput.value.trim();

    if (!player1Name || !player2Name) {
        alert('Por favor, insira o nome de ambos os jogadores.');
        return;
    }

    Game.initializePlayers(player1Name, player2Name);
    Game.loadScores(); // Load scores after players are initialized

    showGameContainer();
    initializeGameUI(); // Initialize the game board and UI
    UI.updateStatusMessage(Game.getGameState().currentPlayer);
}

// Event Listeners for mode selection
localModeButton.addEventListener('click', showLocalSetup);
onlineModeButton.addEventListener('click', showOnlineSetup);

// Event Listener for local game start
startGameButton.addEventListener('click', handleStartLocalGameClick);

// Event Listeners for back buttons
backToModeLocalButton.addEventListener('click', showModeSelection);
backToModeOnlineButton.addEventListener('click', showModeSelection);

// Event Listeners for online game
createGameButton.addEventListener('click', handleCreateGameClick);
joinGameButton.addEventListener('click', handleJoinGameClick);

// Initial setup on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeGameUI(); // Initialize common UI elements and listeners
    showModeSelection(); // Start with mode selection

    // Check for existing online game in localStorage
    const savedGameId = localStorage.getItem('onlineGameId');
    const savedPlayerSymbol = localStorage.getItem('onlinePlayerSymbol');

    if (savedGameId && savedPlayerSymbol) {
        gameId = savedGameId;
        playerSymbol = savedPlayerSymbol;
        gameIdDisplay.textContent = `ID do Jogo: ${gameId}`; // Display game ID
        gameIdDisplay.style.display = 'block';
        listenForGameChanges(gameId);
        showGameContainer();
        // Re-initialize local game state for UI based on online game data (will be updated by listener)
        Game.initializePlayers('Jogador X', 'Jogador O'); // Placeholder names
    }
});
