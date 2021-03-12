import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

@Component({ template: '' })
export abstract class BaseComponent implements OnInit, OnDestroy {

  isLoading = false;
  subscription = new Subscription();

  constructor() { }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
    this.subscription.unsubscribe();
  }

  abstract onInit(): void;
  abstract onDestroy(): void;
}
