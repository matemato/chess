import { tileColor } from "../constants"
import { Piece } from "../piece";

export class Tile {
    piece: Piece;
    position: number[];
    color: tileColor;
    promotion: boolean = false;
    promotionImage: string;

    constructor(piece: Piece, position: number[], color: tileColor, promotionImage: string) {
        this.piece = piece;
        this.position = position;
        this.color = color;
        this.promotionImage = promotionImage;
    }
}
