import { Inject } from "@angular/core";
import { pieceColor, pieceName } from "../constants";
import { Tile } from "../tile/tile";
import { Piece } from "./piece";

export class Chess {
    chessboard: Tile[][];
    moves: number[][] | null;
    whitePieces: Tile[];
    blackPieces: Tile[];
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
    // also adds the move to moves (can change if needed)
    legalMove(piece: Piece, i: number, j: number) {
      if (this.inBounds([i, j])) {
        if (this.chessboard[i][j].piece.name == null) {
          this.moves?.push([i, j]);
          return true
        }
      }
      return false
    }

    canEat(piece: Piece, i: number, j: number) {
      if (this.inBounds([i, j])) {
        let color = this.chessboard[i][j].piece.color;
        if (color != null && color != piece.color) {
          this.moves?.push([i, j]);
          return true
        }
      }
      return false
    }

    linearMoves(tile: Tile) {
      let [i,j] = tile.position;
      let piece = tile.piece
      for (let dir = 0; dir < 4; dir++){
        for (let ii = tile.position[dir%2]; ii < 8; dir<2 ? ii++ : ii--) {
          if (dir%2 == 0 && ii != i) {
            if(this.canEat(piece, ii, j) || !this.legalMove(piece, ii, j)) {
              break;
            }
          }
          else if (dir%2 == 1 && ii != j) {
            if (this.canEat(piece, i, ii) || !this.legalMove(piece, i, ii)) {
              break;
            }
          }
        }
      }
    }

    diagonalMoves(tile: Tile){
      let [i,j] = tile.position;
      let dirs = [[-1, 1], [1, 1], [1, -1], [-1, -1]]
      for (let dir of dirs) {
        for (let ii = 1; ii < 8; ii++) {
          if (this.canEat(tile.piece, i + dir[0]*ii, j + dir[1]*ii) || !this.legalMove(tile.piece, i + dir[0]*ii, j + dir[1]*ii)) {
            break
          }
        }
      }
    }

    knightMoves(tile: Tile) {
      let [i,j] = tile.position;
      let dirs = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
      for (let dir of dirs) {
        this.legalMove(tile.piece, i + dir[0], j + dir[1])
        this.canEat(tile.piece, i + dir[0], j + dir[1])
      }
    }

    kingMoves(tile: Tile) {
      let [i,j] = tile.position;
      let dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
      for (let dir of dirs) {
        this.legalMove(tile.piece, i + dir[0], j + dir[1]);
        this.canEat(tile.piece, i + dir[0], j + dir[1])
      }
    }

    pawnMoves(tile: Tile) {
      let [i,j] = tile.position;
      let d = tile.piece.color == pieceColor.WHITE ? 1 : -1;
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
      this.piecePositions();
      this.moves = [];
      let piece = tile.piece;
      if (piece.name == pieceName.PAWN) {
        this.pawnMoves(tile);
      }
      else if (piece.name == pieceName.KNIGHT) {
        this.knightMoves(tile);
      }
      else if (piece.name == pieceName.BISHOP) {
        this.diagonalMoves(tile);
      }
      else if (piece.name == pieceName.ROOK) {
        this.linearMoves(tile);
      }
      else if (piece.name == pieceName.QUEEN) {
        this.linearMoves(tile);
        this.diagonalMoves(tile);
      }
      else if (piece.name == pieceName.KING) {
        this.kingMoves(tile);
      }
    }
  }
