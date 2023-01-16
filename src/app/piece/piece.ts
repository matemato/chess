import {
	pieceNames, 
	colors} 
from "../constants"

export class Piece {
    color: colors | null;
    name: pieceNames | null;
    position: string | null;
    img: string | null;

    constructor(color: colors | null, name: pieceNames | null, position: string, img: string | null) {
        this.color = color;
        this.name = name;
        this.position = position;
        this.img = img
    }
}
