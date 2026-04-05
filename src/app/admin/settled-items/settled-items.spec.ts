import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettledItems } from './settled-items.component';

describe('SettledItems', () => {
  let component: SettledItems;
  let fixture: ComponentFixture<SettledItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettledItems],
    }).compileComponents();

    fixture = TestBed.createComponent(SettledItems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
