import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cake-pool-info',
  templateUrl: './pool-info.component.html',
  styleUrls: ['./pool-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoolInfoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
