import { Tile } from "./tile/tile";

export class GameHistory {
    prevTile: Tile;
    newTile: Tile;

    constructor(prevTile: Tile, newTile: Tile){
        this.prevTile = prevTile;
        this.newTile = newTile;
    }
}
