import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncateAddress' })
export class TruncateAddressPipe implements PipeTransform {
  transform(address: string): string {
    return address
      ? `${address.slice(0, 6)}...${address.slice(address.length - 4)}`
      : null;
  }
}
