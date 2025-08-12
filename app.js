/**
 * @file app.js
 * @description Ponto de entrada principal. Inicializa o jogo e gerencia os eventos.
 */

import * as Game from './game.js';
import * as UI from './ui.js';

const restartButton = document.getElementById('restart-button');
const themeToggle = document.getElementById('checkbox');
const body = document.body;

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
    Game.loadScores();
    applyTheme(); // Apply theme on load
    UI.renderBoard(handleCellClick);
    UI.updateStatusMessage(Game.getGameState().currentPlayer);
    UI.updateScores(Game.getGameState().scores);
    restartButton.addEventListener('click', handleRestartClick);
    themeToggle.addEventListener('change', toggleTheme); // Add theme toggle listener
}

// Inicia o jogo quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', initializeGame);
