const fs = require('fs');

fs.readFile('data.txt', 'utf8', (err, data) => {

    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const lines = data.split('\n');
    const drawNumbersIndex = lines.findIndex(line => line.startsWith('Draw numbers:'));
    const drawNumbersLine = lines[drawNumbersIndex + 1];
    const drawNumbers = drawNumbersLine.trim().split(',').map(Number);

    const boardsStartIndex = lines.findIndex(line => line.trim() === 'Boards:');
    const boardLines = lines.slice(boardsStartIndex + 1);

    const boards = [];
    let currentBoard = [];

    boardLines.forEach(line => {
        if (line.trim() !== '') {
            let lineArr = line.trim().match(/\S+/g).map(Number);
            currentBoard.push(lineArr);

            if (currentBoard.length === 5) {
                boards.push(currentBoard);
                currentBoard = [];
            }
        }
    });

    let winningBoards = [];
    let winningBoardScores = [];
    let lastDrawnNr;

    for (let k = 0; k < drawNumbers.length; k++) {
        const n = drawNumbers[k];

        for (let j = 0; j < boards.length; j++) {
            if (winningBoards.includes(j)) {
                continue;
            }

            let board = boards[j];
            let match = -1;

            for (let i = 0; i < board.length; i++) {
                if (match !== -1) {
                    break;
                }
                for (let j = 0; j < board[i].length; j++) {
                    if (board[i][j] === n) {
                        match = [i, j];
                        break;
                    }
                }
            }

            if (match[0] >= 0) {
                let [row, col] = match;
                board[row][col] = `X${board[row][col]}`;
                let winningRow = board[row].every(cell => cell.toString().startsWith('X'));
                let winningCol = board.every(row => row[col].toString().startsWith('X'));
                if (winningRow || winningCol) {
                    let validNumbers = board.flat(1).filter(cell => !cell.toString().startsWith('X'));
                    let sum = validNumbers.reduce((a, c) => a + c, 0);
                    let score = sum * n;
                    winningBoards.push(j);
                    winningBoardScores.push(score);
                    lastDrawnNr = n;
                }
            }
        }
    }

    console.log(`The last winning board score is:`, winningBoardScores[winningBoardScores.length - 1])
});
