import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolCalculatorComponent } from './pool-calculator.component';

describe('PoolCalculatorComponent', () => {
  let component: PoolCalculatorComponent;
  let fixture: ComponentFixture<PoolCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoolCalculatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoolCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
