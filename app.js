/**
 * @file app.js
 * @description Ponto de entrada principal. Inicializa o jogo e gerencia os eventos.
 */

import * as Game from './game.js';
import * as UI from './ui.js';

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
function handleCellClick(cellIndex) {
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
}

/**
 * Lida com o clique no botão de reiniciar.
 */
function handleRestartClick() {
    Game.resetGame();
    UI.clearBoard();
    UI.updateStatusMessage(Game.getGameState().currentPlayer);
}

/**
 * Inicializa o jogo.
 */
function initializeGame() {
    applyTheme(); // Apply theme on load
    UI.renderBoard(handleCellClick);
    UI.updateStatusMessage(Game.getGameState().currentPlayer);
    UI.updateScores(Game.getGameState().scores);
    restartButton.addEventListener('click', handleRestartClick);
    clearScoresButton.addEventListener('click', handleClearScoresClick); // New event listener
    themeToggle.addEventListener('change', toggleTheme);
}

/**
 * Lida com o clique no botão Limpar Placar.
 */
function handleClearScoresClick() {
    Game.clearScores();
    UI.updateScores(Game.getGameState().scores);
}

/**
 * Lida com o clique no botão Iniciar Jogo.
 */
function handleStartGameClick() {
    const player1Name = player1NameInput.value.trim();
    const player2Name = player2NameInput.value.trim();

    if (!player1Name || !player2Name) {
        alert('Por favor, insira o nome de ambos os jogadores.');
        return;
    }

    Game.initializePlayers(player1Name, player2Name);
    Game.loadScores(); // Load scores after players are initialized

    playerSetupContainer.style.display = 'none';
    gameContainer.style.display = 'flex'; // Show game container
    gameContainer.classList.add('active'); // Add active class for styling

    initializeGame(); // Initialize the game board and UI
}

// Inicia o jogo quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    playerSetupContainer.style.display = 'flex'; // Show setup by default
    gameContainer.style.display = 'none'; // Hide game by default
    startGameButton.addEventListener('click', handleStartGameClick);
});
