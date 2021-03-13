import { Inject, Injectable } from '@angular/core';

import { BigNumber, ethers } from 'ethers';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';

import { WalletQuery } from 'src/app/core/store/wallet.query';
import { WalletStore } from 'src/app/core/store/wallet.store';
import { MetamaskWeb3Provider } from 'src/app/core/tokens/provider.token';

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
        switchMap(() => this.network$)
      )
      .subscribe();
  }

  get network$(): Observable<Network> {
    return from(this.provider.getNetwork() as Promise<Network>)
      .pipe(tap(networkInfo => this.updateChain(networkInfo.chainId)));
  }

  get balance$(): Observable<BigNumber> {
    return from(this.provider.getBalance(this.query.currentAddress))
      .pipe(tap(balance => this.store.update({ balance })));
  }

  private updateChain(chainId: string | number): void {
    this.store.update({ chainId });
  }

}

