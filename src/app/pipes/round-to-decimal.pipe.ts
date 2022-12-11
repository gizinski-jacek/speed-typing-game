import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundToDecimal',
})
export class RoundToDecimalPipe implements PipeTransform {
  transform(value: number, decimals: number): string {
    return Number(
      Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals
    ).toFixed(decimals);
  }
}
