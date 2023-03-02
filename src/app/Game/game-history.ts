import { Piece } from "./piece";
import { Tile } from "./tile/tile";

export class GameHistory {
    prevTile: Tile;
    newTile: Tile;
    eatenPiece: Piece;

    constructor(prevTile: Tile, newTile: Tile, eatenPiece: Piece){
        this.prevTile = prevTile;
        this.newTile = newTile;
        this.eatenPiece = eatenPiece;
    }
}
