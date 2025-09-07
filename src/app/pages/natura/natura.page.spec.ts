import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NaturaPage } from './natura.page';

describe('NaturaPage', () => {
  let component: NaturaPage;
  let fixture: ComponentFixture<NaturaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NaturaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
