import {
	pieceName,
	pieceColor} 
from "./constants"

export class Piece {
    color: pieceColor | null;
    name: pieceName | null;
    img: string | null;
    moved: boolean = false;

    constructor(color: pieceColor | null, name: pieceName | null, img: string | null) {
        this.color = color;
        this.name = name;
        this.img = img
    }
}
