import { Component } from '@angular/core';
import { CdkDragDrop, CdkDragMove, CdkDragStart, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
	pieceNames, 
	colors, 
	pieceOrder} 
from "../constants"
import { Piece } from '../piece/piece';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  imageLink = 'url(https://www.chess.com/chess-themes/pieces/icy_sea/150/'
  columns = ["A", "B", "C", "D", "E", "F", "G", "H"]
  offset: {
    x: number;
    y: number;
  }
  tiles = [
    pieceOrder.map((name, i) => new Piece(colors.WHITE, name, this.columns[i]+"1", this.imageLink+colors.WHITE+name+'.png')),
    Array(8).fill(' ').map(i => new Piece(colors.WHITE, pieceNames.PAWN, this.columns[i]+"2", this.imageLink+colors.WHITE+pieceNames.PAWN+'.png')),
    Array(8).fill(' ').map(i => new Piece(null, null, this.columns[i]+"3", null)),
    Array(8).fill(' ').map(i => new Piece(null, null, this.columns[i]+"4", null)),
    Array(8).fill(' ').map(i => new Piece(null, null, this.columns[i]+"5", null)),
    Array(8).fill(' ').map(i => new Piece(null, null, this.columns[i]+"6", null)),
    Array(8).fill(' ').map(i => new Piece(colors.BLACK, pieceNames.PAWN, this.columns[i]+"7", this.imageLink+colors.BLACK+pieceNames.PAWN+'.png')),
    pieceOrder.map((name, i) => new Piece(colors.BLACK, name, this.columns[i]+"8", this.imageLink+colors.BLACK+name+'.png'))
    // Array(24).fill(' '),
    // Array(32).fill(' ')
  ]

  tileColor(i: number, j: number, tile: any) {
    // console.log(tile)
    // console.log(i)
    return (i%2 + j)%2 == 0 ? 'rgb(240,217,181)' : 'rgb(181,136,99)';
  }

  pieceImage(i: number, j:number) {
    return this.tiles[i][j].img
  }

  bodyElement: HTMLElement = document.body;

  dragStart(event: CdkDragStart) {
    this.bodyElement.classList.add('inheritCursors');
    this.bodyElement.style.cursor = 'grabbing';
  }

  drop(event: CdkDragDrop<any>) {
    this.bodyElement.classList.remove('inheritCursors');
    this.bodyElement.style.cursor = 'unset';
  }
  // drop(event: CdkDragDrop<string[]>): void {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(event.previousContainer.data,
  //         event.container.data,
  //         event.previousIndex,
  //         event.currentIndex);
  //   }
  // }
}
