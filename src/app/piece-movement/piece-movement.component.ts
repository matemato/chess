import { Component, Inject } from '@angular/core';
import { pieceName, pieceColor} from "../constants"
import { Tile } from '../tile/tile';

@Component({
  selector: 'app-piece-movement',
  template: ` `,
  styles: [],
})
export class PieceMovementComponent {
  chessboard: Tile[][];

  constructor(@Inject('Tile[]') chessboard: Tile[][]){
    this.chessboard = chessboard;
  }

  colToIndex: { [key: string]: number } = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5 , "G": 6, "H": 7};

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
  availableMoves(piece: Tile) {
    var possibleOptions = []
    var piecePositions = this.piecePositions()
    if (piece.piece == pieceName.PAWN) {
      if (piece.pieceColor == pieceColor.WHITE) {
        return "A3"
      }
    }
    return null
  }
}
