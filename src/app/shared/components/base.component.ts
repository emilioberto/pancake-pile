import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({ template: '' })
export abstract class BaseComponent implements OnInit, OnDestroy {

  isLoading = false;

  constructor() { }

  ngOnInit(): void {
    this.onInit();
  }

  ngOnDestroy(): void {
    this.onDestroy();
  }

  abstract onInit(): void;
  abstract onDestroy(): void;
}
