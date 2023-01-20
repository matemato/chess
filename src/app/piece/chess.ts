import { Inject } from "@angular/core";
import { pieceColor, pieceName } from "../constants";
import { Tile } from "../tile/tile";

export class Chess {
    chessboard: Tile[][];
    moves: number[][] | null;
  
    constructor(@Inject('Tile[]') chessboard: Tile[][]){
      this.chessboard = chessboard;
    }
  
    piecePositions() {
      var piecePositions = []
      for (let row of this.chessboard){
        for (let t of row) {
          if (t.piece != null) {
            piecePositions.push(t.position)
          }
        }
      }
      return piecePositions;
    }
    // need to do this with positions like (i,j) not like ("A7")
    availableMoves(tile: Tile) {
      var possibleOptions = []
      var piecePositions = this.piecePositions()
      let [i,j] = tile.position;
      if (tile.piece.name == pieceName.PAWN) {
        if (tile.piece.color == pieceColor.WHITE) {
          this.moves = [[i+1,j]]
          if (i == 1){
            this.moves.push([3,j])
          }
        }
        else if (tile.piece.color = pieceColor.BLACK){
          this.moves = [[tile.position[0]-1,tile.position[1]]]
          if (i == 6){
            this.moves.push([4,j])
          }
        }
      }
    }
  }
