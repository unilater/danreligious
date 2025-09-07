import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiturgiaPage } from './liturgia.page';

describe('LiturgiaPage', () => {
  let component: LiturgiaPage;
  let fixture: ComponentFixture<LiturgiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LiturgiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
