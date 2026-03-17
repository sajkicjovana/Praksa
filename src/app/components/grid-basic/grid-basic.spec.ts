import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridBasic } from './grid-basic';

describe('GridBasic', () => {
  let component: GridBasic;
  let fixture: ComponentFixture<GridBasic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridBasic],
    }).compileComponents();

    fixture = TestBed.createComponent(GridBasic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
