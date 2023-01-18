import {
	pieceName,
    tileColor, 
	pieceColor} 
from "../constants"

export class Tile {
    pieceColor: pieceColor | null;
    piece: pieceName | null;
    position: string;
    tileColor: tileColor;
    img: string | null;

    constructor(pieceColor: pieceColor | null, piece: pieceName | null, position: string, tileColor: tileColor, img: string | null) {
        this.pieceColor = pieceColor;
        this.piece = piece;
        this.position = position;
        this.tileColor = tileColor;
        this.img = img
    }
}
