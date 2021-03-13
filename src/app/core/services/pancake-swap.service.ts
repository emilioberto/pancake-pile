import { Inject, Injectable } from '@angular/core';

import { BigNumber, ethers } from 'ethers';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { PancakeSwapStore } from 'src/app/core/state-management/stores/pancake-swap.store';
import { MetamaskWeb3Provider } from 'src/app/core/tokens/provider.token';
import { CakePoolContractInfo } from 'src/app/shared/contracts/cake-pool.contract';
import { CakeContractInfo } from 'src/app/shared/contracts/cake.contract';
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
    return new ethers.Contract(CakeContractInfo.address, CakeContractInfo.ABI, this.provider) as CakeContract;
  }

  get cakePoolBalance$(): Observable<BigNumber> {
    return from(this.cakeTokenContract.balanceOf(CakePoolContractInfo.address));
  }

  get addressBalance$(): Observable<BigNumber> {
    return from(this.cakeTokenContract.balanceOf(this.walletQuery.currentAddress))
      .pipe(tap(cakeBalance => this.store.update({ cakeBalance })));
  }

  get tokenSymbol$(): Observable<string> {
    return from(this.cakeTokenContract.symbol())
      .pipe(tap(tokenSymbol => this.store.update({ tokenSymbol })));
  }

}
