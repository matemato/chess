export enum pieceNames {
    PAWN = "p",
    ROOK = "r", 
    KNIGHT = "n", 
    BISHOP = "b", 
    QUEEN = "q",
    KING = "k"
}

export enum colors {
    BLACK = "b",
    WHITE = "w",
    SELECTED = "yellow"
}

export const pieceOrder = [    
    pieceNames.ROOK,
    pieceNames.KNIGHT,
    pieceNames.BISHOP,
    pieceNames.KING,
    pieceNames.QUEEN,
    pieceNames.BISHOP,
    pieceNames.KNIGHT,
    pieceNames.ROOK
]