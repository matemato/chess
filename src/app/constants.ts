export enum pieceName {
    PAWN = "p",
    ROOK = "r", 
    KNIGHT = "n", 
    BISHOP = "b", 
    QUEEN = "q",
    KING = "k"
}

export enum pieceColor {
    BLACK = "b",
    WHITE = "w",
}

export enum tileColor {
    LIGHTBROWN = 'rgb(240,217,181)',
    DARKBROWN = 'rgb(181,136,99)',
    LIGHTSELECTED = 'rgb(236,121,100)',
    DARKSELECTED = 'rgb(224,105,84)',
    PREVIOUS = 'rgb(218,195,50)',
    MOVED = 'rgb(247,236,91)',
    AVAILABLE = 'rgb(0,128,0)'
}

export const tileColors = [
    tileColor.LIGHTBROWN,
    tileColor.DARKBROWN
]

export const pieceOrder = [    
    pieceName.ROOK,
    pieceName.KNIGHT,
    pieceName.BISHOP,
    pieceName.KING,
    pieceName.QUEEN,
    pieceName.BISHOP,
    pieceName.KNIGHT,
    pieceName.ROOK
]