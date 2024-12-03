var turnOf = "X";
var cells = [];
var disabled_cells = [];
var board = Array(9).fill('');
const winningPatterns = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6]
];

for (let i = 1; i <= 9; i++) {
    cells[i - 1] = document.getElementById("box-" + i);
    cells[i - 1].addEventListener("click", e => onClick(cells[i - 1]));
}

let hasWon = false;

let onClick = (cell) => {
    if (!disabled_cells.includes(cell.id)) {
        makeMove(turnOf, cell);
        let num = cell.id.charAt(cell.id.length - 1) - 1;
        board[num] = turnOf;
        hasWon = hasWonCheck(turnOf, board);

        if (hasWon) {
            document.getElementById("winh1").innerText = "Congrats! Player " + turnOf + " has won!";
        } else if (!board.includes('')) {
            document.getElementById("winh1").innerText = "It's a Tie!";
        }

        turnOf = turnOf === 'X' ? 'O' : 'X';
        disabled_cells.push(cell.id);

        if (document.getElementById("isMinMax").checked && turnOf === "O") {
            let bestMove = findBestMove(board);
            if (bestMove !== -1) {
                makeArtificialMove(board, bestMove, "O");
                cells[bestMove].innerHTML = "O";
                disabled_cells.push(cells[bestMove].id);
                hasWon = hasWonCheck("O", board);

                if (hasWon) {
                    document.getElementById("winh1").innerText = "Congrats! Player O has won!";
                } else if (!board.includes('')) {
                    document.getElementById("winh1").innerText = "It's a Tie!";
                }

                turnOf = "X";
            }
        }
    }
};

let makeMove = (player, cell) => {
    cell.innerHTML = player;
};

let hasWonCheck = (player, board_state) => {
    for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (board_state[a] === player && board_state[b] === player && board_state[c] === player) {
            return true;
        }
    }
    return false;
};

let resetGame = () => {
    for (let cell of cells) {
        cell.innerHTML = "";
    }
    document.getElementById("winh1").innerText = "";
    board = Array(9).fill('');
    disabled_cells = [];
    turnOf = "X";
};

// Minimax Bot with Depth Control

const MAX_DEPTH = 5;

function minimax(board, depth, isMaximizingPlayer) {
    let score = evaluateBoard(board);

    if (score !== 0) {
        return score - depth; // Subtract depth to prioritize quicker wins
    }

    if (!board.includes('')) {
        return 0; // Tie
    }

    if (depth === 0) {
        return score; // Return the heuristic score when depth limit is reached
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (let move of findAvailableMoves(board)) {
            board[move] = 'O';
            let eval = minimax(board, depth - 1, false);
            board[move] = ''; // Undo move
            maxEval = Math.max(maxEval, eval);
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let move of findAvailableMoves(board)) {
            board[move] = 'X';
            let eval = minimax(board, depth - 1, true);
            board[move] = ''; // Undo move
            minEval = Math.min(minEval, eval);
        }
        return minEval;
    }
}

function findAvailableMoves(board) {
    let moves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] == '') {
            moves.push(i);
        }
    }
    return moves;
}

function evaluateBoard(board) {
    for (let pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === 'X' ? -10 : 10;
        }
    }

    if (!board.includes('')) {
        return 0; // Tie
    }

    return 0; // Game still ongoing
}

function findBestMove(board) {
    let bestMove = -1;
    let bestValue = -Infinity;

    for (let move of findAvailableMoves(board)) {
        board[move] = 'O';
        let moveValue = minimax(board, MAX_DEPTH, false);
        board[move] = ''; // Undo move

        if (moveValue > bestValue) {
            bestMove = move;
            bestValue = moveValue;
        }
    }

    return bestMove;
}

function makeArtificialMove(board, move, player) {
    board[move] = player;
}
