/**
 * @file game.test.js
 * @description Testes para a lógica do jogo da velha (game.js).
 */

import { getGameState, handleMove, checkWinner, isDraw, resetGame, switchPlayer } from '../src/game';

// Mock para o estado inicial antes de cada teste
beforeEach(() => {
    resetGame();
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
});
