import { Component, HostListener } from '@angular/core';
import { CdkDragDrop, CdkDragMove, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { pieceName, pieceColor, tileColor, pieceOrder, tileColors} from "../constants"
import { Tile } from '../tile/tile';
import { Piece } from '../piece/piece';
import { Chess } from '../piece/chess';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  imageLink = 'url(https://www.chess.com/chess-themes/pieces/icy_sea/150/'
  // columns = ["A", "B", "C", "D", "E", "F", "G", "H"]
  bodyElement: HTMLElement = document.body;
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

  pieceImage(i: number, j:number) {
    return this.chess.chessboard[i][j].piece.img
  }

  changeColor(tile: Tile){
    tile.color = this.toggleSelect[tile.color];
  }

  move(prevPos: Tile, newPos: Tile) {
    prevPos.color = tileColor.PREVIOUS
    newPos.color = tileColor.MOVED
    newPos.piece = prevPos.piece
    prevPos.piece = new Piece(null, null, null)
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  @HostListener('click', ['$event'])
  onLeftClick(event: MouseEvent){
    this.resetTileColors(false)
  }

  dragStart(event: CdkDragStart) {
    this.resetTileColors(false);
    this.bodyElement.classList.add('inheritCursors');
    this.bodyElement.style.cursor = 'grabbing';
    this.chess.availableMoves(event.source.data)
    // console.log(this.chess.moves)
    this.showAvailableMoves()
  }

  drop(event: CdkDragDrop<any>) {
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';

    var prevPos = event.previousContainer.data;
    var newPos = event.container.data;
    console.log(newPos.position)
    console.log(this.chess.moves)
    console.log(JSON.stringify(this.chess.moves).includes(JSON.stringify(newPos.position)))
    // if (newPos.name == null && prevPos != newPos){
    if (JSON.stringify(this.chess.moves).includes(JSON.stringify(newPos.position))) {
      this.resetTileColors(true);
      this.move(prevPos, newPos);
      this.chess.moves = null;
    }
    console.log(prevPos)
    console.log(newPos)
  }
}
