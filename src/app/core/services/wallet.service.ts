import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class WalletService {

  constructor() { }

  async connect(): Promise<void> {
    if (!window.ethereum) {
      return;
    }
  }

}
