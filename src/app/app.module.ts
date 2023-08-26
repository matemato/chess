import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoardComponent } from './Game/board/board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatGridListModule } from '@angular/material/grid-list';
import { TileComponent } from './Game/tile/tile.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    TileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
