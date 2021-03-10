import { Injectable } from '@angular/core';

import { BigNumber, ethers } from 'ethers';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class WalletService {

  private addressSubject$ = new BehaviorSubject<ConnectionResult>(null);

  address$ = this.addressSubject$.asObservable()
    .pipe(map(x => x?.addresses?.length ? x.addresses[0] : null));

  constructor() { }

  connect(): Observable<ConnectionResult> {
    if (!window.ethereum) {
      throw new Error('Please install Metamask');
    }

    return from<Array<string>>((window.ethereum as any).enable())
      .pipe(
        catchError(err => {
          console.error(err.message);
          return of([] as string[]);
        }),
        map(addresses => ({ addresses })),
        tap(connectionResult => this.addressSubject$.next(connectionResult)),
      );
  }


  balance(): Observable<BigNumber> {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    return from(provider.getBalance(this.addressSubject$.value.addresses[0]));
  }
}

export interface ConnectionResult {
  addresses?: string[];
}
