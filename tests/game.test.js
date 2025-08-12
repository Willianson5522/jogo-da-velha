/**
 * @file game.test.js
 * @description Testes para a lógica do jogo da velha (game.js).
 */

import { getGameState, handleMove, checkWinner, isDraw, resetGame, switchPlayer, initializePlayers, loadScores, saveScores } from '../game';

// Mock para o estado inicial antes de cada teste
beforeEach(() => {
    // Clear localStorage mock before each test
    localStorage.clear();
    resetGame();
});

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value; }),
        clear: jest.fn(() => { store = {}; })
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('Lógica do Jogo da Velha', () => {

    test('deve reiniciar o jogo corretamente', () => {
        // Faz uma jogada e depois reinicia
        handleMove(0);
        resetGame();
        const state = getGameState();

        expect(state.board).toEqual(Array(9).fill(null));
        expect(state.currentPlayer).toBe('X');
        expect(state.isGameActive).toBe(true);
    });

    test('deve detectar uma vitória em linha', () => {
        // Simula uma vitória de 'X'
        handleMove(0); // X
        switchPlayer();
        handleMove(3); // O
        switchPlayer();
        handleMove(1); // X
        switchPlayer();
        handleMove(4); // O
        switchPlayer();
        handleMove(2); // X (vitória)

        const winnerInfo = checkWinner();
        expect(winnerInfo).not.toBeNull();
        expect(winnerInfo.winner).toBe('X');
        expect(winnerInfo.combination).toEqual([0, 1, 2]);
        expect(getGameState().isGameActive).toBe(false);
    });

    test('deve detectar uma vitória em coluna', () => {
        handleMove(0); // X
        switchPlayer();
        handleMove(1); // O
        switchPlayer();
        handleMove(3); // X
        switchPlayer();
        handleMove(2); // O
        switchPlayer();
        handleMove(6); // X (vitória)

        const winnerInfo = checkWinner();
        expect(winnerInfo).not.toBeNull();
        expect(winnerInfo.winner).toBe('X');
        expect(winnerInfo.combination).toEqual([0, 3, 6]);
    });

    test('deve detectar uma vitória na diagonal', () => {
        handleMove(0); // X
        switchPlayer();
        handleMove(1); // O
        switchPlayer();
        handleMove(4); // X
        switchPlayer();
        handleMove(2); // O
        switchPlayer();
        handleMove(8); // X (vitória)

        const winnerInfo = checkWinner();
        expect(winnerInfo).not.toBeNull();
        expect(winnerInfo.winner).toBe('X');
        expect(winnerInfo.combination).toEqual([0, 4, 8]);
    });

    test('deve detectar um empate', () => {
        const moves = [0, 1, 2, 3, 5, 4, 6, 8, 7];
        moves.forEach((move, index) => {
            handleMove(move);
            if (index < moves.length - 1) switchPlayer();
        });

        expect(checkWinner()).toBeNull();
        expect(isDraw()).toBe(true);
        expect(getGameState().isGameActive).toBe(false);
    });

    test('não deve permitir uma jogada em uma célula ocupada', () => {
        handleMove(0); // X joga
        const result = handleMove(0); // Tenta jogar novamente
        expect(result).toBe(false);
        expect(getGameState().board[0]).toBe('X');
    });

    test('não deve detectar vencedor quando não há um', () => {
        handleMove(0);
        switchPlayer();
        handleMove(1);
        const winnerInfo = checkWinner();
        expect(winnerInfo).toBeNull();
        expect(getGameState().isGameActive).toBe(true);
    });

    // New tests for 100% coverage

    test('handleMove deve retornar true para uma jogada válida', () => {
        const result = handleMove(0);
        expect(result).toBe(true);
        expect(getGameState().board[0]).toBe('X');
    });

    test('handleMove não deve permitir jogada se o jogo não estiver ativo', () => {
        const state = getGameState();
        state.isGameActive = false;
        const result = handleMove(0);
        expect(result).toBe(false);
        expect(state.board[0]).toBeNull();
    });

    test('switchPlayer deve alternar o jogador corretamente', () => {
        const state = getGameState();
        expect(state.currentPlayer).toBe('X');
        switchPlayer();
        expect(state.currentPlayer).toBe('O');
        switchPlayer();
        expect(state.currentPlayer).toBe('X');
    });

    test('initializePlayers deve configurar os jogadores e resetar scores se novos', () => {
        localStorage.setItem('ticTacToeScores', JSON.stringify({ X: 5, O: 3, playerXName: 'Old X', playerOName: 'Old O' }));
        initializePlayers('Alice', 'Bob');
        const state = getGameState();
        expect(state.players[0].name).toBe('Alice');
        expect(state.players[0].symbol).toBe('X');
        expect(state.players[1].name).toBe('Bob');
        expect(state.players[1].symbol).toBe('O');
        expect(state.scores.X).toBe(0);
        expect(state.scores.O).toBe(0);
    });

    test('initializePlayers deve carregar scores se os jogadores forem os mesmos', () => {
        localStorage.setItem('ticTacToeScores', JSON.stringify({ X: 5, O: 3, playerXName: 'Alice', playerOName: 'Bob' }));
        initializePlayers('Alice', 'Bob');
        const state = getGameState();
        expect(state.scores.X).toBe(5);
        expect(state.scores.O).toBe(3);
    });

    test('saveScores deve salvar os placares e nomes dos jogadores no localStorage', () => {
        initializePlayers('Charlie', 'David');
        const state = getGameState();
        state.scores.X = 10;
        state.scores.O = 7;
        saveScores();
        expect(localStorage.setItem).toHaveBeenCalledWith('ticTacToeScores', JSON.stringify({ X: 10, O: 7, playerXName: 'Charlie', playerOName: 'David' }));
    });

    test('loadScores deve carregar os placares do localStorage', () => {
        localStorage.setItem('ticTacToeScores', JSON.stringify({ X: 20, O: 15, playerXName: 'Eve', playerOName: 'Frank' }));
        // initializePlayers is called first in app.js, so loadScores is mostly for internal re-sync
        initializePlayers('Eve', 'Frank'); // Ensure players are set for loadScores to work with names
        loadScores();
        const state = getGameState();
        expect(state.scores.X).toBe(20);
        expect(state.scores.O).toBe(15);
    });

    test('getGameState deve retornar o estado atual do jogo', () => {
        const state = getGameState();
        expect(state).toBeDefined();
        expect(state.board).toEqual(Array(9).fill(null));
    });
});