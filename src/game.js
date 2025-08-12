/**
 * @file game.js
 * @description Contém toda a lógica principal do jogo da velha.
 */

// Estado inicial do jogo
const state = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    isGameActive: true,
    scores: {
        X: 0,
        O: 0
    }
};

// Combinações de vitória
const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
];

/**
 * Retorna o estado atual do jogo.
 * @returns {object} O estado do jogo.
 */
export function getGameState() {
    return state;
}

/**
 * Processa a jogada de um jogador em uma determinada célula.
 * @param {number} cellIndex - O índice da célula clicada (0-8).
 * @returns {boolean} Retorna true se a jogada for válida, false caso contrário.
 */
export function handleMove(cellIndex) {
    if (state.board[cellIndex] || !state.isGameActive) {
        return false;
    }
    state.board[cellIndex] = state.currentPlayer;
    return true;
}

/**
 * Verifica se há um vencedor.
 * @returns {object|null} Retorna um objeto com o vencedor e a combinação vencedora, ou null se não houver vencedor.
 */
export function checkWinner() {
    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
            state.isGameActive = false;
            state.scores[state.currentPlayer]++;
            return { winner: state.currentPlayer, combination };
        }
    }
    return null;
}

/**
 * Verifica se o jogo terminou em empate.
 * @returns {boolean} Retorna true se for um empate, false caso contrário.
 */
export function isDraw() {
    if (!state.board.includes(null) && state.isGameActive) {
        state.isGameActive = false;
        return true;
    }
    return false;
}

/**
 * Alterna o jogador atual (de X para O e vice-versa).
 */
export function switchPlayer() {
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
}

/**
 * Reinicia o estado do jogo para uma nova partida, mantendo os placares.
 */
export function resetGame() {
    state.board = Array(9).fill(null);
    state.currentPlayer = 'X';
    state.isGameActive = true;
}

/**
 * Carrega os placares do localStorage.
 */
export function loadScores() {
    const savedScores = localStorage.getItem('ticTacToeScores');
    if (savedScores) {
        state.scores = JSON.parse(savedScores);
    }
}

/**
 * Salva os placares no localStorage.
 */
export function saveScores() {
    localStorage.setItem('ticTacToeScores', JSON.stringify(state.scores));
}
