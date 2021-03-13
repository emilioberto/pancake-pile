import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from 'ethers';

export interface UserInfo {
  amount: BigNumber;
  rewardDebt: BigNumber;
}

export interface PoolInfo {
  lpToken: string;
  allocPoint: BigNumber;
  lastRewardBlock: BigNumber;
  accCakePerShare: BigNumber;
}

export interface CakePoolContract extends Contract {
  BONUS_MULTIPLIER: () => Promise<BigNumber>;
  cakePerBlock: () => Promise<BigNumber>;
  pendingCake: (poolIndex: number, address: string) => Promise<BigNumber>;
  poolInfo: (poolIndex: number) => Promise<PoolInfo>;
  userInfo: (poolIndex: number, address: string) => Promise<UserInfo>;
}
