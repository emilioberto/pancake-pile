import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from 'ethers';

export interface UserInfo {
  amount: BigNumber;
  rewardDebt: BigNumber;
}

export interface PoolInfo {
  lpToken: string; // Address of LP token contract.
  allocPoint: BigNumber; // How many allocation points assigned to this pool. CAKEs to distribute per block.
  lastRewardBlock: BigNumber; // Last block number that CAKEs distribution occurs.
  accCakePerShare: BigNumber; // Accumulated CAKEs per share, times 1e12. See below.
}

export interface CakePoolContract extends Contract {
  BONUS_MULTIPLIER: () => Promise<BigNumber>; // Bonus muliplier for early cake makers.
  cakePerBlock: () => Promise<BigNumber>; // CAKE tokens created per block.
  pendingCake: (poolIndex: number, address: string) => Promise<BigNumber>;
  poolInfo: (poolIndex: number) => Promise<PoolInfo>;
  totalAllocPoint: () => Promise<BigNumber>; // Total allocation points. Must be the sum of all allocation points in all pools.
  userInfo: (poolIndex: number, address: string) => Promise<UserInfo>;
}
