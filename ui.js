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
    }
}

/**
 * Atualiza a mensagem de status para indicar o jogador atual.
 * @param {string} player - O jogador atual.
 */
export function updateStatusMessage(player) {
    statusMessageElement.textContent = `Jogador ${player}, é a sua vez!`;
}

/**
 * Exibe a mensagem de vitória e destaca as células vencedoras.
 * @param {string} winner - O jogador vencedor.
 * @param {number[]} combination - A combinação de células vencedora.
 */
export function showWinner(winner, combination) {
    statusMessageElement.textContent = `Jogador ${winner} venceu!`;
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
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
}
