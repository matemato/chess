import { Inject } from "@angular/core";
import { pieceColor, pieceName } from "./constants";
import { Tile } from "./tile/tile";
import { Piece } from "./piece";

export class Chess {
    chessboard: Tile[][];
    gameHistory: any[];
    moves: number[][];
    whoseTurn: pieceColor;
    check: boolean;
    checkmate: boolean;
    round: number;
    maxRound: number;
  
    constructor(@Inject('Tile[]') chessboard: Tile[][]){
      this.chessboard = chessboard;
      this.gameHistory = [JSON.parse(JSON.stringify(this.chessboard))];
      this.whoseTurn = pieceColor.WHITE;
      this.check = false;
      this.checkmate = false;
      this.round = 0;
      this.maxRound = 0;
    }

    oppositeColor(color: pieceColor) {
      return color == pieceColor.WHITE ? pieceColor.BLACK : pieceColor.WHITE
    }
    // king cannot be protected -> GAME OVER
    isCheckMate() {
      if (!this.check) return
      for (let row of this.chessboard){
        for (let t of row) {
          if (t.piece.color != null && t.piece.color == this.whoseTurn) {
            this.availableMoves(t);
            if (this.moves.length != 0) return;
          }
        }
      }
      this.checkmate = true;
    }
    // checks whether king is in check
    isCheck() {
      for (let row of this.chessboard){
        for (let t of row) {
          if (t.piece.name == pieceName.KING && t.piece.color == this.whoseTurn) {
            if (this.tileAttacked(t.piece.color, t.position, false))
              return true
          }
        }
      }
      return false
    }
    // check if a specified tile is targeted by a piece
    //byAlly boolean -> protected by the same color (for king moves)
    tileAttacked(pieceColor: pieceColor | null, pos: number[], byAlly: boolean) {
      let tempMoves = JSON.parse(JSON.stringify(this.moves));
      // console.log("before: ", this.moves)
      for (let row of this.chessboard){
        for (let t of row) {
          if (t.piece.color != null && t.piece.color != pieceColor) {
            if (byAlly) this.getMoves(t, pieceColor!, false);
            else this.getMoves(t, this.oppositeColor(pieceColor!), false);
            // console.log(this.moves)
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
    // check if position in bounds
    inBounds(pos: number[]) {
      for (let i = 0; i < pos.length; i++) {
          if (pos[i] < 0 || pos[i] > 7) {
              return false;
          }
      }
      return true;
    }
    // check if tile is empty to move there
    legalMove(i: number, j: number) {
      if (this.inBounds([i, j])) {
        if (this.chessboard[i][j].piece.name == null) {
          this.moves.push([i, j]);
          return true
        }
      }
      return false
    }
    // check if a piece can eat a piece
    canEat(attackerColor: pieceColor, i: number, j: number) {
      if (this.inBounds([i, j])) {
        let color = this.chessboard[i][j].piece.color;
        if (color != null && attackerColor != color) {
          // console.log(i, j)
          this.moves.push([i, j]);
          return true
        }
      }
      return false
    }

    linearMoves(tile: Tile, color: pieceColor) {
      let [i,j] = tile.position;
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

    kingMoves(tile: Tile) {
      let [i,j] = tile.position;
      let d = tile.piece.color == pieceColor.WHITE ? 0 : 7; // d == 0 means white
      let dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
      for (let dir of dirs) {
        this.legalMove(i + dir[0], j + dir[1]);
        this.canEat(tile.piece.color!, i + dir[0], j + dir[1])
      }
      if (!tile.piece.moved) {
        // left castle
        if (!this.chessboard[d][0].piece.moved && this.chessboard[d][0].piece.name == pieceName.ROOK && this.legalMove(d,2) && !this.check) {
            this.legalMove(d,1);
        }
        // right castle
        if (!this.chessboard[d][7].piece.moved && this.chessboard[d][7].piece.name == pieceName.ROOK && this.legalMove(d,4) && !this.check && this.chessboard[d][6].piece.name == null) {
            this.legalMove(d,5);
        }
      }
    }
    
    pawnMoves(tile: Tile) {
      let [i,j] = tile.position;
      let color = tile.piece.color;
      let d = color == pieceColor.WHITE ? 1 : -1; // d == 1 means white
      
      if (this.legalMove(i+d, j)) {
        if (i == 1 || i == 6) 
          this.legalMove(i+2*d, j);
      }
      this.canEat(color!, i+d, j+1);
      this.canEat(color!, i+d, j-1);

      // en passant
      if (this.round > 0) {
        let prevRound = this.gameHistory[this.round-1];
        for (let k of [-1, 1]) {
          // for white
          if (d==1 && i==4 && this.inBounds([i, k+j]) && this.gameHistory[this.round][4][j+k].piece.name == pieceName.PAWN && prevRound[6][j+k].piece.name == pieceName.PAWN) {
            this.legalMove(5, j+k)
          }
          // for black
          if (d==-1 && i==3 && this.inBounds([i, k+j]) && this.gameHistory[this.round][3][j+k].piece.name == pieceName.PAWN && prevRound[1][j+k].piece.name == pieceName.PAWN) {
            this.legalMove(2, j+k)
          }
        }
      }
    }
    // pawn attack moves
    pawnAttack(tile: Tile, color: pieceColor) {
      let [i,j] = tile.position; 
      let d = tile.piece.color == pieceColor.WHITE ? 1 : -1;
      this.legalMove(i+d, j+1);
      this.legalMove(i+d, j-1);
      this.canEat(color, i+d, j+1);      
      this.canEat(color, i+d, j-1); 
    }
    // removes moves that would cause king to be in check
    legalCheckMoves(tile: Tile) {
      let piece = tile.piece;
      let pos = tile.position;
      let tempMoves = JSON.parse(JSON.stringify(this.moves));
      this.moves = []
      for (let [i,j] of tempMoves) {
        let targetedTile = this.chessboard[i][j];
        let tempPiece = targetedTile.piece
        targetedTile.piece = piece;
        this.chessboard[pos[0]][pos[1]].piece = new Piece(null, null, null);
        if (!this.isCheck()) this.moves.push([i,j]);
        this.chessboard[pos[0]][pos[1]].piece = targetedTile.piece;
        targetedTile.piece = tempPiece;
      }
    }

    availableMoves(tile: Tile) {
      this.moves = [];
      if (tile.piece.color != this.whoseTurn || this.round != this.maxRound) return
      this.getMoves(tile, tile.piece.color!, true);
      this.legalCheckMoves(tile);
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
        this.kingMoves(tile);
      }
    }
  }
