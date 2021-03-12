import { Inject, Injectable } from '@angular/core';

import { BigNumber, Contract, ethers } from 'ethers';
import { from, Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { WalletQuery } from 'src/app/core/store/wallet.query';
import { WalletStore } from 'src/app/core/store/wallet.store';
import { MetamaskWeb3Provider } from 'src/app/core/tokens/provider.token';
import { CakePoolContract } from 'src/app/shared/contracts/cake-pool.contract';
import { CakeTokenContract } from 'src/app/shared/contracts/cake.contract';

type Network = ethers.providers.Network;

@Injectable({ providedIn: 'root' })
export class WalletService {

  provider = new ethers.providers.Web3Provider(this.web3Provider);

  constructor(
    @Inject(MetamaskWeb3Provider) private web3Provider: any,
    private store: WalletStore,
    private query: WalletQuery,
  ) {

    this.web3Provider.on(
      'chainChanged',
      (chainId: string) => this.updateChain(chainId)
    );

    this.web3Provider.on(
      'accountsChanged',
      async (accounts: string[]) => {
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log('Please connect to MetaMask.');
          this.store.reset();
        } else if (accounts[0] !== this.query.currentAddress) {
          this.store.update({ address: accounts[0] });
          this.updateChain((await this.provider.getNetwork()).chainId);
        }
      }
    );

    this.connect();
  }

  connect(): void {
    from(this.web3Provider.request({ method: 'eth_requestAccounts' }) as Promise<string[]>)
      .pipe(
        take(1),
        catchError((err) => {
          console.error(err.message);
          return of([] as string[]);
        }),
        tap(addresses => this.store.update({ address: addresses[0] })),
        switchMap(() => this.getNetwork()),
        tap(networkInfo => this.updateChain(networkInfo.chainId))
      ).subscribe();
  }

  private updateChain(chainId: string | number): void {
    this.store.update({ chainId });
  }

  private getNetwork(): Observable<Network> {
    return from(this.provider.getNetwork() as Promise<Network>);
  }

  // balance(): Observable<BigNumber> {
  //   return from(this.provider.getBalance(this.currentAddress));
  // }

  // isBsc(): Observable<boolean> {
  //   return from(this.provider.detectNetwork())
  //     .pipe(
  //       map(network => network.chainId === CONSTANTS.BSC_CHAIN_ID)
  //     );
  // }

  // pendingCake(): Observable<BigNumber> {
  //   return from(this.cakePoolContract.pendingCake(CONSTANTS.CAKE_POOL_INDEX, this.currentAddress) as Promise<BigNumber>);
  // }

  // private get cakeTokenContract(): Contract {
  //   return new ethers.Contract(CakeTokenContract.address, CakeTokenContract.ABI, this.provider);
  // }

  // private get cakePoolContract(): Contract {
  //   return new ethers.Contract(CakePoolContract.address, CakePoolContract.ABI, this.provider);
  // }



}

