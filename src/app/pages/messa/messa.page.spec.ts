import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessaPage } from './messa.page';

describe('MessaPage', () => {
  let component: MessaPage;
  let fixture: ComponentFixture<MessaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MessaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
