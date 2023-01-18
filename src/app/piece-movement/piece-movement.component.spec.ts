import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceMovementComponent } from './piece-movement.component';

describe('PieceMovementComponent', () => {
  let component: PieceMovementComponent;
  let fixture: ComponentFixture<PieceMovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieceMovementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PieceMovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
