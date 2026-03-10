import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributeCardComponent } from './contribute-card.component';

describe('ContributeCardComponent', () => {
  let component: ContributeCardComponent;
  let fixture: ComponentFixture<ContributeCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContributeCardComponent]
    });
    fixture = TestBed.createComponent(ContributeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
