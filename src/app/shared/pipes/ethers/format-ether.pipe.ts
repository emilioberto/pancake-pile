import { Pipe, PipeTransform } from '@angular/core';

import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';

@Pipe({ name: 'formatEther' })
export class FormatEtherPipe implements PipeTransform {
  transform(value: BigNumber): string {
    return value
      ? ethers.utils.formatEther(value)
      : null;
  }
}
