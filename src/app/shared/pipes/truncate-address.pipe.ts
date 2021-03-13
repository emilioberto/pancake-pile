import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable({ providedIn: 'root' })
@Pipe({ name: 'truncateAddress' })
export class TruncateAddressPipe implements PipeTransform {
  transform(address: string, format: 'short' | 'medium' = 'short'): string {
    if (!address) {
      return null;
    }


    return format === 'short'
      ? `${address.slice(0, 6)}...${address.slice(address.length - 4)}`
      : `${address.slice(0, 10)}...${address.slice(address.length - 10)}`;
  }
}
