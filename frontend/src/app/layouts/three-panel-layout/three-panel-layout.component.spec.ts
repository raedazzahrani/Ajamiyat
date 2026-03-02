import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreePanelLayoutComponent } from './three-panel-layout.component';

describe('ThreePanelLayoutComponent', () => {
  let component: ThreePanelLayoutComponent;
  let fixture: ComponentFixture<ThreePanelLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ThreePanelLayoutComponent]
    });
    fixture = TestBed.createComponent(ThreePanelLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
