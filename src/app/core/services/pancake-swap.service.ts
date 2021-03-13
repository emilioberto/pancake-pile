import { Inject, Injectable } from '@angular/core';

import { BigNumber, Contract, ethers } from 'ethers';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PancakeSwapStore } from 'src/app/core/store/pancake-swap.store';
import { WalletQuery } from 'src/app/core/store/wallet.query';
import { MetamaskWeb3Provider } from 'src/app/core/tokens/provider.token';
import { CakeTokenContract } from 'src/app/shared/contracts/cake.contract';
import { CakeContract } from 'src/app/shared/contracts/interfaces/cake.contract';

@Injectable({ providedIn: 'root' })
export class PancakeSwapService {

  provider = new ethers.providers.Web3Provider(this.web3Provider);

  constructor(
    @Inject(MetamaskWeb3Provider) private web3Provider: any,
    private store: PancakeSwapStore,
    private walletQuery: WalletQuery
  ) { }

  private get cakeTokenContract(): CakeContract {
    return new ethers.Contract(CakeTokenContract.address, CakeTokenContract.ABI, this.provider) as CakeContract;
  }

  get cakeBalance$(): Observable<BigNumber> {
    return from(this.cakeTokenContract.balanceOf(this.walletQuery.currentAddress))
      .pipe(tap(cakeBalance => this.store.update({ cakeBalance })));
  }

  get tokenSymbol$(): Observable<string> {
    return from(this.cakeTokenContract.symbol())
      .pipe(tap(tokenSymbol => this.store.update({ tokenSymbol })));
  }

  // pendingCake(): Observable<BigNumber> {
  //   return from(this.cakePoolContract.pendingCake(CONSTANTS.CAKE_POOL_INDEX, this.currentAddress) as Promise<BigNumber>);
  // }

  // private get cakePoolContract(): Contract {
  //   return new ethers.Contract(CakePoolContract.address, CakePoolContract.ABI, this.provider);
  // }

}
