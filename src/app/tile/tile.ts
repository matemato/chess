import { tileColor } from "../constants"
import { Piece } from "../piece/piece";

export class Tile {
    piece: Piece;
    position: number[];
    color: tileColor;

    constructor(piece: Piece, position: number[], color: tileColor) {
        this.piece = piece;
        this.position = position;
        this.color = color;
    }
}
