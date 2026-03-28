import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemManagement } from './item-management.component';

describe('ItemManagement', () => {
  let component: ItemManagement;
  let fixture: ComponentFixture<ItemManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
