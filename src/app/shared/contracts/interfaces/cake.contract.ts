import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from 'ethers';

export interface CakeContract extends Contract {
  balanceOf: (address: string) => Promise<BigNumber>;
  name: () => Promise<string>;
  symbol: () => Promise<string>;
}
