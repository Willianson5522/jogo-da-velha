import { getGameState } from './game.js';

/**
 * @file ui.js
 * @description Manipula todos os elementos da interface do usuário (DOM).
 */

const boardElement = document.getElementById('board');
const statusMessageElement = document.getElementById('status-message');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');

/**
 * Renderiza o tabuleiro do jogo na página.
 * @param {function} onCellClick - A função a ser chamada quando uma célula é clicada.
 */
export function renderBoard(onCellClick) {
    boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => onCellClick(i));
        boardElement.appendChild(cell);
    }
}

/**
 * Atualiza a exibição de uma célula específica com 'X' ou 'O'.
 * @param {number} index - O índice da célula.
 * @param {string} player - O jogador ('X' ou 'O').
 */
export function updateCell(index, player) {
    const cell = boardElement.querySelector(`[data-index='${index}']`);
    if (cell) {
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        // Add click animation
        cell.classList.add('clicked');
        cell.addEventListener('animationend', () => {
            cell.classList.remove('clicked');
        }, { once: true });
    }
}

/**
 * Atualiza a mensagem de status para indicar o jogador atual.
 * @param {string} currentPlayerSymbol - O símbolo do jogador atual.
 */
export function updateStatusMessage(currentPlayerSymbol) {
    const gameState = getGameState();
    const currentPlayer = gameState.players.find(p => p.symbol === currentPlayerSymbol);
    if (currentPlayer) {
        statusMessageElement.textContent = `${currentPlayer.name}, é a sua vez!`;
        statusMessageElement.style.animation = 'none'; // Reset animation
        void statusMessageElement.offsetWidth; // Trigger reflow
        statusMessageElement.style.animation = null; // Re-apply animation
    }
}

/**
 * Exibe a mensagem de vitória e destaca as células vencedoras.
 * @param {string} winnerSymbol - O símbolo do jogador vencedor.
 * @param {number[]} combination - A combinação de células vencedora.
 */
export function showWinner(winnerSymbol, combination) {
    const gameState = getGameState();
    const winnerPlayer = gameState.players.find(p => p.symbol === winnerSymbol);
    if (winnerPlayer) {
        statusMessageElement.textContent = `${winnerPlayer.name} venceu!`;
        statusMessageElement.style.animation = 'none'; // Reset animation
        void statusMessageElement.offsetWidth; // Trigger reflow
        statusMessageElement.style.animation = null; // Re-apply animation
    }
    combination.forEach(index => {
        const cell = boardElement.querySelector(`[data-index='${index}']`);
        cell.classList.add('winner');
    });
}

/**
 * Exibe a mensagem de empate.
 */
export function showDraw() {
    statusMessageElement.textContent = 'O jogo empatou!';
    statusMessageElement.style.animation = 'none'; // Reset animation
    void statusMessageElement.offsetWidth; // Trigger reflow
    statusMessageElement.style.animation = null; // Re-apply animation
}

/**
 * Limpa o tabuleiro visual para uma nova partida.
 */
export function clearBoard() {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
}

/**
 * Atualiza a exibição dos placares.
 * @param {object} scores - O objeto de placares { X: scoreX, O: scoreO }.
 */
export function updateScores(scores) {
    const gameState = getGameState();
    const playerX = gameState.players.find(p => p.symbol === 'X');
    const playerO = gameState.players.find(p => p.symbol === 'O');

    if (playerX) {
        scoreXElement.textContent = `${playerX.name}: ${scores.X}`;
    }
    if (playerO) {
        scoreOElement.textContent = `${playerO.name}: ${scores.O}`;
    }
}