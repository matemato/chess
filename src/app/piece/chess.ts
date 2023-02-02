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

    tileAttacked(pieceColor: pieceColor | null, pos: number[]) {
      let tempMoves = JSON.parse(JSON.stringify(this.moves));
      // console.log("before: ", this.moves)
      for (let row of this.chessboard){
        for (let t of row) {
          if (t.piece.color != null && t.piece.color != pieceColor) {
            this.getMoves(t, pieceColor!, false);
            if (JSON.stringify(this.moves).includes(JSON.stringify(pos))){
              this.moves = JSON.parse(JSON.stringify(tempMoves))
              return true;
            }
          }
        }
      }
      this.moves = JSON.parse(JSON.stringify(tempMoves))
      // console.log("after: ", this.moves)
      return false
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
    legalMove(i: number, j: number) {
      if (this.inBounds([i, j])) {
        if (this.chessboard[i][j].piece.name == null) {
          this.moves?.push([i, j]);
          return true
        }
      }
      return false
    }

    kingLegalMove(color: pieceColor, i: number, j: number){
      if (this.inBounds([i, j])) {
        if (this.chessboard[i][j].piece.color != color &&
          !this.tileAttacked(color, [i,j])) {
            this.moves?.push([i, j])
        }
      }
    }

    kingProtect(tile: Tile, i: number, j: number) {
      if (this.inBounds([i,j]) && tile.piece.color == this.chessboard[i][j].piece.color) {
        this.moves?.push([i, j]);
      }
    }

    canEat(attackerColor: pieceColor, i: number, j: number) {
      if (this.inBounds([i, j])) {
        let color = this.chessboard[i][j].piece.color;
        if (color != null && attackerColor != color) {
          // console.log(i, j)
          this.moves?.push([i, j]);
          return true
        }
      }
      return false
    }

    linearMoves(tile: Tile, color: pieceColor) {
      let [i,j] = tile.position;
      let piece = tile.piece
      for (let dir = 0; dir < 4; dir++){
        for (let ii = tile.position[dir%2]; ii < 8; dir<2 ? ii++ : ii--) {
          if (dir%2 == 0 && ii != i) {
            if(this.canEat(color, ii, j) || !this.legalMove(ii, j)) {
              break;
            }
          }
          else if (dir%2 == 1 && ii != j) {
            if (this.canEat(color, i, ii) || !this.legalMove(i, ii)) {
              break;
            }
          }
        }
      }
    }

    diagonalMoves(tile: Tile, color: pieceColor){
      let [i,j] = tile.position;
      let dirs = [[-1, 1], [1, 1], [1, -1], [-1, -1]]
      for (let dir of dirs) {
        for (let ii = 1; ii < 8; ii++) {
          if (this.canEat(color, i + dir[0]*ii, j + dir[1]*ii) || !this.legalMove(i + dir[0]*ii, j + dir[1]*ii)) {
            break
          }
        }
      }
    }

    knightMoves(tile: Tile, color: pieceColor) {
      let [i,j] = tile.position;
      let dirs = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
      for (let dir of dirs) {
        this.legalMove(i + dir[0], j + dir[1])
        this.canEat(color, i + dir[0], j + dir[1])
      }
    }

    kingMoves(tile: Tile, moving: boolean) {
      let [i,j] = tile.position;
      let dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
      for (let dir of dirs) {
        if (moving) {
          // this.canEat(tile.piece.color!, i + dir[0], j + dir[1])
          this.kingLegalMove(tile.piece.color!, i + dir[0], j + dir[1]);
        }
        else {
          this.legalMove(i + dir[0], j + dir[1]);
          this.kingProtect(tile, i + dir[0], j + dir[1])
        }
      }
    }

    pawnMoves(tile: Tile) {
      let [i,j] = tile.position;
      let color = tile.piece.color;
      let d = color == pieceColor.WHITE ? 1 : -1;
      if (this.legalMove(i+d, j)) {
        if (i == 1 || i == 6) 
          this.legalMove(i+2*d, j);
      }
      this.canEat(color!, i+d, j+1);
      this.canEat(color!, i+d, j-1);
    }

    pawnAttack(tile: Tile, color: pieceColor) {
      let [i,j] = tile.position; 
      let d = tile.piece.color == pieceColor.WHITE ? 1 : -1;
      this.legalMove(i+d, j+1);
      this.legalMove(i+d, j-1);
      this.canEat(color, i+d, j+1);      
      this.canEat(color, i+d, j-1); 
      console.log(this.moves) 
    }

    availableMoves(tile: Tile) {
      this.piecePositions();
      this.moves = [];
      this.getMoves(tile, tile.piece.color!, true);
    }

    getMoves(tile: Tile, color: pieceColor, checkPawnMoves: boolean) {
      if (tile.piece.name == pieceName.PAWN) {
        if (checkPawnMoves) this.pawnMoves(tile)
        else this.pawnAttack(tile, color);
      }
      else if (tile.piece.name == pieceName.KNIGHT) {
        this.knightMoves(tile, color);
      }
      else if (tile.piece.name == pieceName.BISHOP) {
        this.diagonalMoves(tile, color);
      }
      else if (tile.piece.name == pieceName.ROOK) {
        this.linearMoves(tile, color);
      }
      else if (tile.piece.name == pieceName.QUEEN) {
        this.linearMoves(tile, color);
        this.diagonalMoves(tile, color);
      }
      else if (tile.piece.name == pieceName.KING){
        this.kingMoves(tile, checkPawnMoves);
      }
    }
  }
