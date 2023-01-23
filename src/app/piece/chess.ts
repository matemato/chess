import { Inject } from "@angular/core";
import { pieceColor, pieceName } from "../constants";
import { Tile } from "../tile/tile";
import { Piece } from "./piece";

export class Chess {
    chessboard: Tile[][];
    moves: number[][] | null;
    whitePositions: number[][];
    blackPositions: number[][];
  
    constructor(@Inject('Tile[]') chessboard: Tile[][]){
      this.chessboard = chessboard;
    }
  
    piecePositions() {
      this.blackPositions = [];
      this.whitePositions = [];
      for (let row of this.chessboard){
        for (let t of row) {
          if (t.piece.name != null) {
            if (t.piece.color == pieceColor.BLACK) {
              this.blackPositions.push(t.position)
            }
            else {
              this.whitePositions.push(t.position)
            }
          }
        }
      }
    }

    inBounds(pos: number[]) {
      for (let i = 0; i < pos.length; i++) {
          if (pos[i] < 0 || pos[i] > 7) {
              return false;
          }
      }
      return true;
    }

    legalMove(piece: Piece, i: number, j: number) {
      if (this.inBounds([i, j])) {
        if (this.chessboard[i][j].piece.name == null) {
          this.moves?.push([i, j]);
          return false
        }
        else if (this.chessboard[i][j].piece.color != piece.color) {
          this.moves?.push([i, j]);
        }
      }
      return true
    }

    linearMoves(tile: Tile, i: number, j: number) {
      for (let dir = 0; dir < 4; dir++){
        for (let ii = tile.position[dir%2]; ii < 8; dir<2 ? ii++ : ii--) {
          if (dir%2 == 0 && ii != i) {
            if(this.legalMove(tile.piece, ii, j)) {
              break;
            }
          }
          else if (dir%2 == 1 && ii != j) {
            if (this.legalMove(tile.piece, i, ii)) {
              break;
            }
          }
        }
      }
    }

    pawnMoves(tile: Tile, i: number, j: number, d:number) {
      if (tile.piece.color == pieceColor.WHITE) {
        this.moves = [[i+1,j]]
        // white start
        if (i == 1 && this.chessboard[2][j].piece.name == null){
          this.moves.push([3,j])
        }
      }
      else if (tile.piece.color = pieceColor.BLACK){
        this.moves = [[tile.position[0]-1,tile.position[1]]]
        // black start
        if (i == 6 && this.chessboard[5][j].piece.name == null){
          this.moves.push([4,j])
        }
      }
      this.moves = this.moves?.filter
      (pos => !JSON.stringify(
        this.whitePositions.concat(this.blackPositions)).includes(JSON.stringify(pos))) || []

      // eat right
      if (this.inBounds([i+d, j+1]) && this.chessboard[i+d][j+1].piece.color != tile.piece.color &&
          this.chessboard[i+d][j+1].piece.color != null){
        this.moves.push([i+d,j+1]);
      }
      // eat left
      if (this.inBounds([i+d, j-1]) &&  this.chessboard[i+d][j-1].piece.color != tile.piece.color &&
              this.chessboard[i+d][j-1].piece.color != null) {
        this.moves.push([i+d,j-1]);
      }
    }

    availableMoves(tile: Tile) {
      this.piecePositions()
      this.moves = [];
      let [i,j] = tile.position;
      let d = tile.piece.color == pieceColor.WHITE ? 1 : -1;
      let piece = tile.piece
      if (piece.name == pieceName.PAWN) {
        this.pawnMoves(tile, i, j ,d)
      }
      else if (piece.name == pieceName.ROOK) {
        this.linearMoves(tile, i, j)
      }
    }
  }
