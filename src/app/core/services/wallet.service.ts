import { Inject, Injectable } from '@angular/core';

import { BigNumber, Contract, ethers } from 'ethers';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MetamaskWeb3Provider } from 'src/app/core/tokens/provider.token';
import { CONSTANTS } from 'src/app/shared/constants/constants';
import { CakePoolContract } from 'src/app/shared/contracts/cake-pool.contract';
import { CakeTokenContract } from 'src/app/shared/contracts/cake.contract';

@Injectable({ providedIn: 'root' })
export class WalletService {

  constructor(
    @Inject(MetamaskWeb3Provider) private web3Provider: any,
  ) { }

  private provider = new ethers.providers.Web3Provider(window.ethereum);

  private addressSubject$ = new BehaviorSubject<string[]>([]);

  address$ = this.addressSubject$
    .asObservable()
    .pipe(map(x => x.length ? x[0] : null));

  connect(): Observable<string[]> {
    return from(this.web3Provider.enable() as Promise<string[]>)
      .pipe(
        catchError((err) => {
          console.error(err.message);
          return of([] as string[]);
        }),
        tap(addresses => this.addressSubject$.next(addresses)),
      );
  }

  balance(): Observable<BigNumber> {
    return from(this.provider.getBalance(this.currentAddress));
  }

  isBsc(): Observable<boolean> {
    return from(this.provider.detectNetwork())
      .pipe(
        map(network => network.chainId === CONSTANTS.BSC_CHAIN_ID)
      );
  }

  pendingCake(): Observable<BigNumber> {
    return from(this.cakePoolContract.pendingCake(CONSTANTS.CAKE_POOL_INDEX, this.currentAddress) as Promise<BigNumber>);
  }

  private get cakeTokenContract(): Contract {
    return new ethers.Contract(CakeTokenContract.address, CakeTokenContract.ABI, this.provider);
  }

  private get cakePoolContract(): Contract {
    return new ethers.Contract(CakePoolContract.address, CakePoolContract.ABI, this.provider);
  }

  private get currentAddress(): string {
    return this.addressSubject$.value[0];
  }

}

