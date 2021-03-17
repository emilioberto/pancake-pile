import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cake-compound-chart',
  templateUrl: './compound-chart.component.html',
  styleUrls: ['./compound-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompoundChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
