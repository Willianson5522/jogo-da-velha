/**
 * @file app.js
 * @description Ponto de entrada principal. Inicializa o jogo e gerencia os eventos.
 */

import * as Game from './game.js';
import * as UI from './ui.js';

const restartButton = document.getElementById('restart-button');

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
    UI.renderBoard(handleCellClick);
    UI.updateStatusMessage(Game.getGameState().currentPlayer);
    UI.updateScores(Game.getGameState().scores);
    restartButton.addEventListener('click', handleRestartClick);
}

// Inicia o jogo quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', initializeGame);
