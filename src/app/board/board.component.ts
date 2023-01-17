import { Component, HostListener } from '@angular/core';
import { CdkDragDrop, CdkDragMove, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
	pieceName, 
	pieceColor,
  tileColor, 
	pieceOrder} 
from "../constants"
import { Tile } from '../piece/piece';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  imageLink = 'url(https://www.chess.com/chess-themes/pieces/icy_sea/150/'
  columns = ["A", "B", "C", "D", "E", "F", "G", "H"]
  bodyElement: HTMLElement = document.body;
  tileColors = [tileColor.LIGHTBROWN, tileColor.DARKBROWN]
  toggleSelect = {
    [tileColor.DARKBROWN]: tileColor.DARKSELECTED,
    [tileColor.DARKSELECTED]: tileColor.DARKBROWN,
    [tileColor.LIGHTBROWN]: tileColor.LIGHTSELECTED,
    [tileColor.LIGHTSELECTED]: tileColor.LIGHTBROWN
  }
  tiles = [
    pieceOrder.map((name, i) => new Tile(pieceColor.WHITE, name, this.columns[i]+"1", this.tileColors[i%2],this.imageLink+pieceColor.WHITE+name+'.png')),
    Array(8).fill(' ').map((name, i) => new Tile(pieceColor.WHITE, pieceName.PAWN, this.columns[i]+"2", this.tileColors[(i+1)%2], this.imageLink+pieceColor.WHITE+pieceName.PAWN+'.png')),
    Array(8).fill(' ').map((name, i) => new Tile(null, null, this.columns[i]+"3", this.tileColors[i%2], null)),
    Array(8).fill(' ').map((name, i) => new Tile(null, null, this.columns[i]+"4", this.tileColors[(i+1)%2], null)),
    Array(8).fill(' ').map((name, i) => new Tile(null, null, this.columns[i]+"5", this.tileColors[i%2], null)),
    Array(8).fill(' ').map((name, i) => new Tile(null, null, this.columns[i]+"6", this.tileColors[(i+1)%2], null)),
    Array(8).fill(' ').map((name, i) => new Tile(pieceColor.BLACK, pieceName.PAWN, this.columns[i]+"7", this.tileColors[i%2], this.imageLink+pieceColor.BLACK+pieceName.PAWN+'.png')),
    pieceOrder.map((name, i) => new Tile(pieceColor.BLACK, name, this.columns[i]+"8", this.tileColors[(i+1)%2], this.imageLink+pieceColor.BLACK+name+'.png'))
  ]

  resetTileColors() {
    for (let [i,row] of this.tiles.entries()) {
      for (let [j, t] of row.entries()) {
        t.tileColor = (i%2 + j)%2 == 0 ? tileColor.LIGHTBROWN : tileColor.DARKBROWN;
      }
    }
  }

  pieceImage(i: number, j:number) {
    return this.tiles[i][j].img
  }

  changeColor(tile: Tile){
    tile.tileColor = this.toggleSelect[tile.tileColor] || tile.tileColor;
  }

  changePos(tile1: Tile, tile2:Tile){
    tile1.pieceColor = tile2.pieceColor;
    tile1.piece = tile2.piece;
    tile1.position = tile2.position;
    tile1.img = tile2.img;
  }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  @HostListener('click', ['$event'])
  onLeftClick(event: MouseEvent){
    this.resetTileColors()
  }

  dragStart(event: CdkDragStart) {
    this.resetTileColors()
    this.bodyElement.classList.add('inheritCursors');
    this.bodyElement.style.cursor = 'grabbing';
  }

  drop(event: CdkDragDrop<any>) {
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';

    var prevPos = event.previousContainer.data
    var newPos = event.container.data
    var emptyTile = new Tile(null, null, prevPos.position, tileColor.DARKBROWN, null)

    if (newPos.name == null && prevPos != newPos){
      this.changePos(newPos, prevPos)
      this.changePos(prevPos, emptyTile)
      // newPos.img = prevPos.img;
      // prevPos.img = emptyTile.img;
    }
    console.log(prevPos)
    console.log(newPos)
  }
}
