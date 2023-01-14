import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  // board = Array.from(Array(8), () => new Array(8))
  tiles = Array(64).fill(' ')

  tileColor(i: number) {
    return (i%2 + Math.floor(i/8))%2 == 0 ? 'rgb(240,217,181)' : 'rgb(181,136,99)';
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
