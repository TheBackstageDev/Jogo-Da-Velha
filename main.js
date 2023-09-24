
var turnOf = "X";
var cells = [];
var disabled_cells = [];
var board = Array(9).fill('')
const winningPatterns = [
    [1, 2, 3], // columns
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7], // rows
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9], // diagonals
    [3, 5, 7]
];

//Gets all the cells from the table.
for (let i = 1; i <= 9; i++) {
    const image = document.createElement("img");
    cells[i - 1] = document.getElementById("box-" + i);
    cells[i - 1].insertAdjacentElement("afterbegin", image);
    cells[i - 1].addEventListener("click", e => onClick(document.getElementById("box-" + i).firstElementChild,document.getElementById("box-" + i)));
}

//Every time an cell is clicked
let onClick = (img_id,cell_id) => {
    if (!disabled_cells.includes(cell_id.id)){
        makeMove(turnOf,img_id);
        turnOf = turnOf === 'X' ? 'O' : 'X';
    }

    if (!disabled_cells.includes(cell_id.id)) {
        disabled_cells.push(cell_id.id);
        let num = cell_id.id.charAt(cell_id.id.length - 1);
        board[num - 1] = turnOf;
        hasWon(turnOf,board);
    }

    //Checks for Ties.
    let num = '';
    for (let house of board) {
        num += house;
    }
    if (num.length === 9 && !makeMove(turnOf, board)) {
        document.getElementById("winh1").innerText = "Its A Tie!";
    }
}

//Makes a move on the board.
let makeMove = (player, img) => {
    img.src = "images/" + player + "plr.png";
}

//Checks if someone has won.
let hasWon = (player, board_state) => {
    for (let pattern of winningPatterns) {
        const [a,b,c] = pattern.map(index => index - 1);
        if (board_state[a] === player && board_state[b] === player && board_state[c] === player) {
            player = player === 'X' ? 'O' : 'X';
            document.getElementById("winh1").innerText = "Congrats! player " + player + " Has Won!";
            return true;
        } 
    }
    return false;
}

//Resets the game when the Button is pressed.
let resetGame = () => {
    for (let i = 0; i < cells.length; i++) {
        cells[i].firstElementChild.src = "";
    }
    document.getElementById("winh1").innerText = "";
    board = Array(9).fill('')
    disabled_cells = [];
}



