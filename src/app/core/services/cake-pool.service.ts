import { Inject, Injectable } from '@angular/core';

import { BigNumber, ethers } from 'ethers';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { WalletQuery } from 'src/app/core/state-management/queries/wallet.query';
import { CakePoolStore } from 'src/app/core/state-management/stores/cake-pool.store';
import { MetamaskWeb3Provider } from 'src/app/core/tokens/provider.token';
import { CONSTANTS } from 'src/app/shared/constants/constants';
import { CakePoolContractInfo } from 'src/app/shared/contracts/cake-pool.contract';
import { CakePoolContract, PoolInfo, UserInfo } from 'src/app/shared/contracts/interfaces/cake-pool.contract';

@Injectable({ providedIn: 'root' })
export class CakePoolService {

  provider = new ethers.providers.Web3Provider(this.web3Provider);

  constructor(
    @Inject(MetamaskWeb3Provider) private web3Provider: any,
    private store: CakePoolStore,
    private walletQuery: WalletQuery
  ) { }

  private get cakePoolContract(): CakePoolContract {
    return new ethers.Contract(CakePoolContractInfo.address, CakePoolContractInfo.ABI, this.provider) as CakePoolContract;
  }

  get poolPendingCake$(): Observable<BigNumber> {
    return from(this.cakePoolContract.pendingCake(CONSTANTS.CAKE_POOL_INDEX, this.walletQuery.currentAddress))
      .pipe(tap(pendingCake => this.store.update({ pendingCake })));
  }

  get userInfo$(): Observable<UserInfo> {
    return from(this.cakePoolContract.userInfo(CONSTANTS.CAKE_POOL_INDEX, this.walletQuery.currentAddress))
      .pipe(tap(userInfo => this.store.update({ userInfo })));
  }

  get poolInfo$(): Observable<PoolInfo> {
    return from(this.cakePoolContract.poolInfo(CONSTANTS.CAKE_POOL_INDEX))
      .pipe(tap(poolInfo => this.store.update({ poolInfo })));
  }

  get poolBonusMultiplier$(): Observable<BigNumber> {
    return from(this.cakePoolContract.BONUS_MULTIPLIER())
      .pipe(tap(bonusMultiplier => this.store.update({ bonusMultiplier })));
  }

  // doCalc(): void {

  //   async getAPY() {
  //     if (!this.poolAllocPoint) {
  //       await this.getPoolInfo()
  //     }
  //     const contract = this.poolContract()

  //     let result = await contract.methods.cakePerBlock().call({ from: this.userAddress })
  //     const cakePerBlock = BN(result)

  //     const poolAllocPoint = BN(this.poolAllocPoint)

  //     result = await contract.methods.totalAllocPoint().call({ from: this.userAddress })
  //     const totalAllocPoint = BN(result)

  //     const blockReward = cakePerBlock.mul(poolAllocPoint).div(totalAllocPoint)
  //     const numberOfBlocks = 20 * 60 * 24 * 365
  //     const annualBlockReward = blockReward.mul(BN(numberOfBlocks.toString())).mul(BN("1000000000000"))

  //     const cakeContract = this.cakeContract()
  //     result = await cakeContract.methods.balanceOf(contract.options.address).call({ from: this.userAddress })
  //     const lpSupply = BN(result)
  //     this.apy =  annualBlockReward.div(lpSupply).divRound(BN("100000000")).toNumber() / 100
  //   },
  // }

}
