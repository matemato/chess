import { Component, HostListener } from '@angular/core';
import { CdkDragDrop, CdkDragMove, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { pieceName, pieceColor, tileColor, pieceOrder, tileColors} from "../constants"
import { Tile } from '../tile/tile';
import { Piece } from '../piece';
import { Chess } from '../chess';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  promotedTile: Tile;
  imageLink = 'url(https://www.chess.com/chess-themes/pieces/icy_sea/150/';

  toggleSelect = {
    [tileColor.DARKBROWN]: tileColor.DARKSELECTED,
    [tileColor.DARKSELECTED]: tileColor.DARKBROWN,
    [tileColor.LIGHTBROWN]: tileColor.LIGHTSELECTED,
    [tileColor.LIGHTSELECTED]: tileColor.LIGHTBROWN,
    [tileColor.MOVED]: tileColor.MOVED,
    [tileColor.PREVIOUS]: tileColor.PREVIOUS,
    [tileColor.AVAILABLE]: tileColor.AVAILABLE
  }
  chess = new Chess([
    pieceOrder.map((name, i) => new Tile(new Piece(pieceColor.WHITE, name, this.imageLink+pieceColor.WHITE+name+'.png'), [0, i], tileColors[i%2], this.imageLink+pieceColor.BLACK+pieceName.QUEEN+'.png')),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(pieceColor.WHITE, pieceName.PAWN, this.imageLink+pieceColor.WHITE+pieceName.PAWN+'.png'), [1, i], tileColors[(i+1)%2], this.imageLink+pieceColor.BLACK+pieceName.KNIGHT+'.png')),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(null, null, null), [2, i], tileColors[i%2], this.imageLink+pieceColor.BLACK+pieceName.ROOK+'.png')),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(null, null, null), [3, i], tileColors[(i+1)%2], this.imageLink+pieceColor.BLACK+pieceName.BISHOP+'.png')),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(null, null, null), [4, i], tileColors[i%2], this.imageLink+pieceColor.WHITE+pieceName.BISHOP+'.png')),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(null, null, null), [5, i], tileColors[(i+1)%2], this.imageLink+pieceColor.WHITE+pieceName.ROOK+'.png')),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(pieceColor.BLACK, pieceName.PAWN, this.imageLink+pieceColor.BLACK+pieceName.PAWN+'.png'), [6, i], tileColors[i%2], this.imageLink+pieceColor.WHITE+pieceName.KNIGHT+'.png')),
    pieceOrder.map((name, i) => new Tile(new Piece(pieceColor.BLACK, name, this.imageLink+pieceColor.BLACK+name+'.png'), [7, i], tileColors[(i+1)%2], this.imageLink+pieceColor.WHITE+pieceName.QUEEN+'.png'))
  ])

  resetTileColors(removeAll: boolean) {
    for (let [i,row] of this.chess.chessboard.entries()) {
      for (let [j, t] of row.entries()) {
        if (removeAll || (t.color != tileColor.MOVED && t.color != tileColor.PREVIOUS)) {
          t.color = (i%2 + j)%2 == 0 ? tileColor.LIGHTBROWN : tileColor.DARKBROWN;
        }
      }
    }
  }

  promote(tile: Tile) {
    console.log("promotion")
    let choice = tile.position[0]
    let promotionPieces = [pieceName.QUEEN, pieceName.KNIGHT, pieceName.ROOK, pieceName.BISHOP, pieceName.BISHOP, pieceName.ROOK, pieceName.KNIGHT, pieceName.QUEEN]
    let color = choice < 4 ? pieceColor.BLACK : pieceColor.WHITE
    let pos = choice < 4 ? 0 : 7
    this.resetTileColors(true);
    this.move(this.promotedTile, this.chess.chessboard[pos][tile.position[1]])
    this.chess.chessboard[pos][tile.position[1]].piece = new Piece(color, promotionPieces[choice], this.imageLink+color+promotionPieces[choice]+'.png');
    // this.promotedTile.piece = new Piece(null, null, null);
    this.resetPromotion();
    this.endTurn();
  }

  resetPromotion() {
    for (let [i,row] of this.chess.chessboard.entries()) {
      for (let [j, t] of row.entries()) {
        t.promotion = false;
      }
    }
  }

  showAvailableMoves() {
    if (this.chess.moves != null) {
      for (let [i,j] of this.chess.moves) {
        this.chess.chessboard[i][j].color = tileColor.AVAILABLE;
      }
    }
  }

  changeColor(tile: Tile){
    tile.color = this.toggleSelect[tile.color];
  }

  move(prevTile: Tile, newTile: Tile) {
    prevTile.color = tileColor.PREVIOUS
    newTile.color = tileColor.MOVED
    newTile.piece = prevTile.piece
    prevTile.piece = new Piece(null, null, null)
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  @HostListener('click', ['$event'])
  onLeftClick(event: MouseEvent){
    this.resetTileColors(false)
    this.resetPromotion()
  }

  @HostListener('window:keydown', ['$event'])
  changeRounds(event: KeyboardEvent) {
    if (event.key == 'ArrowLeft' && this.chess.round > 0) {
      this.chess.round -= 1;
    }
    else if (event.key == 'ArrowRight' && this.chess.round < this.chess.maxRound) {
      this.chess.round += 1;  
    }
    this.chess.chessboard = this.chess.gameHistory[this.chess.round];
  }

  dragStart(event: CdkDragStart) {
    this.resetTileColors(false);
    document.body.classList.add('inheritCursors');
    document.body.style.cursor = 'grabbing';
    this.chess.availableMoves(event.source.data)
    this.showAvailableMoves()
  }

  checkEnPassant(prevTile: Tile, newTile: Tile) {
    let d = newTile.piece.color == pieceColor.WHITE ? 1 : -1;
    if (newTile.piece.name == pieceName.PAWN && Math.abs(prevTile.position[1] - newTile.position[1]) == 1 && this.chess.gameHistory[this.chess.round][newTile.position[0]][newTile.position[1]].piece.name == null) {
      console.log("en passant")
      this.chess.chessboard[newTile.position[0]-1][newTile.position[1]].piece = new Piece(null, null, null)
    }
  }

  checkCastling(prevTile: Tile, newTile: Tile) {
    let d = newTile.piece.color == pieceColor.WHITE ? 0 : 7;
    if (newTile.piece.name == pieceName.KING && Math.abs(prevTile.position[1] - newTile.position[1]) == 2) {
      // left castle
      if (newTile.position[1] == 1) {
        this.chess.chessboard[d][2].piece = this.chess.chessboard[d][0].piece
        this.chess.chessboard[d][0].piece = new Piece(null, null, null)
      }
      // right castle
      else if (newTile.position[1] == 5) {
        this.chess.chessboard[d][4].piece = this.chess.chessboard[d][7].piece
        this.chess.chessboard[d][7].piece = new Piece(null, null, null)
      }
    }
  }

  endTurn() {
    this.chess.gameHistory.push(JSON.parse(JSON.stringify(this.chess.chessboard)));
    this.chess.whoseTurn = this.chess.oppositeColor(this.chess.whoseTurn)
    this.chess.moves = [];
    this.chess.check = this.chess.isCheck();
    this.chess.isCheckMate();
    this.chess.round += 1;
    this.chess.maxRound += 1;
  }

  drop(event: CdkDragDrop<any>) {
    document.body.classList.remove('inheritCursors');
    document.body.style.cursor = 'unset';

    var prevTile: Tile = event.previousContainer.data;
    var newTile: Tile = event.container.data;

    if (prevTile.piece.name != null && JSON.stringify(this.chess.moves).includes(JSON.stringify(newTile.position))) {
      if (prevTile.piece.name == pieceName.PAWN && (newTile.position[0] == 0 || newTile.position[0] == 7)) {
        if (prevTile.piece.color == pieceColor.BLACK) { // will probably need to change for board flip
          for (let i = 0; i < 4; i++) {
            this.chess.chessboard[i][newTile.position[1]].promotion = true;
          }
        }
        else {
          for (let i = 4; i < 8; i++) {
            this.chess.chessboard[i][newTile.position[1]].promotion = true;
          }
        }
        this.promotedTile = prevTile;
      }
      else {
        console.log(prevTile)
        this.resetTileColors(true);
        prevTile.piece.moved = true;
        this.move(prevTile, newTile);
        this.checkEnPassant(prevTile, newTile);
        this.checkCastling(prevTile, newTile);
        this.endTurn();
      }
    }
    // console.log(prevPos)
    // console.log(newPos)
  }
}
