import { Component, Inject, Input, OnInit } from '@angular/core';
import {
	pieceNames, 
	colors} 
from "../constants"

@Component({
  selector: 'app-piece',
  template: `
  `,
  styleUrls: ['./piece.component.scss']
})
export class PieceComponent {
  @Input() color: colors
  @Input() name: pieceNames
  @Input() position: string
  @Input() img: string
}
