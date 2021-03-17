import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundChartComponent } from './compound-chart.component';

describe('CompoundChartComponent', () => {
  let component: CompoundChartComponent;
  let fixture: ComponentFixture<CompoundChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompoundChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
