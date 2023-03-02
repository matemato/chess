import { Component, HostListener } from '@angular/core';
import { CdkDragDrop, CdkDragMove, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { pieceName, pieceColor, tileColor, pieceOrder, tileColors} from "../constants"
import { Tile } from '../tile/tile';
import { Piece } from '../piece';
import { Chess } from '../chess';
import { GameHistory } from '../game-history';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
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
    pieceOrder.map((name, i) => new Tile(new Piece(pieceColor.WHITE, name, this.imageLink+pieceColor.WHITE+name+'.png'), [0, i], tileColors[i%2])),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(pieceColor.WHITE, pieceName.PAWN, this.imageLink+pieceColor.WHITE+pieceName.PAWN+'.png'), [1, i], tileColors[(i+1)%2])),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(null, null, null), [2, i], tileColors[i%2])),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(null, null, null), [3, i], tileColors[(i+1)%2])),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(null, null, null), [4, i], tileColors[i%2])),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(null, null, null), [5, i], tileColors[(i+1)%2])),
    Array(8).fill(' ').map((name, i) => new Tile(new Piece(pieceColor.BLACK, pieceName.PAWN, this.imageLink+pieceColor.BLACK+pieceName.PAWN+'.png'), [6, i], tileColors[i%2])),
    pieceOrder.map((name, i) => new Tile(new Piece(pieceColor.BLACK, name, this.imageLink+pieceColor.BLACK+name+'.png'), [7, i], tileColors[(i+1)%2]))
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

  moveBack(prevPrevPrevTile: Tile | null, prevPrevTile: Tile | null, prevTile: Tile, newTile: Tile, eatenPiece: Piece) {
    if (prevPrevTile != null) {
      prevPrevPrevTile!.color = tileColor.PREVIOUS;
      prevPrevTile.color = tileColor.MOVED;
    }
    console.log(prevPrevPrevTile?.position)
    console.log(prevPrevTile)
    console.log(prevTile?.position)
    console.log(newTile?.position)
    prevTile.piece = newTile.piece;
    newTile.piece = eatenPiece;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  @HostListener('click', ['$event'])
  onLeftClick(event: MouseEvent){
    this.resetTileColors(false)
  }

  @HostListener('window:keydown', ['$event'])
  changeRounds(event: KeyboardEvent) {
    if (event.key == 'ArrowLeft' && this.chess.round > 0) {
      this.resetTileColors(true)
      this.chess.round -= 1;
      let round = this.chess.gameHistory[this.chess.round]
      let prevPrevPrevTile = this.chess.round > 0 ? this.chess.gameHistory[this.chess.round - 1].prevTile : null;
      let prevPrevTile = this.chess.round > 0 ? this.chess.gameHistory[this.chess.round - 1].newTile : null;
      this.moveBack(prevPrevPrevTile, prevPrevTile, round.prevTile, round.newTile, round.eatenPiece)
    }
    else if (event.key == 'ArrowRight' && this.chess.round < this.chess.maxRound) {
      this.resetTileColors(true)
      let round = this.chess.gameHistory[this.chess.round]
      this.move(round.prevTile, round.newTile)
      this.chess.round += 1;
    }
  }

  dragStart(event: CdkDragStart) {
    this.resetTileColors(false);
    document.body.classList.add('inheritCursors');
    document.body.style.cursor = 'grabbing';
    this.chess.availableMoves(event.source.data)
    // console.log(this.chess.moves)
    this.showAvailableMoves()
  }

  drop(event: CdkDragDrop<any>) {
    document.body.classList.remove('inheritCursors');
    document.body.style.cursor = 'unset';

    var prevTile: Tile = event.previousContainer.data;
    var newTile: Tile = event.container.data;
    var eatenPiece = this.chess.chessboard[newTile.position[0]][newTile.position[1]].piece
    // console.log(newPos.position)
    // console.log(this.chess.moves)
    // console.log(JSON.stringify(this.chess.moves).includes(JSON.stringify(newPos.position)))
    // if (newPos.name == null && prevPos != newPos){
    if (JSON.stringify(this.chess.moves).includes(JSON.stringify(newTile.position))) {
      this.chess.gameHistory.push(new GameHistory(prevTile, newTile, eatenPiece))
      console.log(prevTile)
      this.resetTileColors(true);
      this.move(prevTile, newTile);
      
      this.chess.whoseTurn = this.chess.oppositeColor(this.chess.whoseTurn)
      this.chess.moves = [];
      this.chess.check = this.chess.isCheck();
      this.chess.isCheckMate();
      this.chess.round += 1;
      this.chess.maxRound += 1;
    }
    // console.log(prevPos)
    // console.log(newPos)
  }
}
