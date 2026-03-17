// src/app/pipes/time-until.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeUntil',
  standalone: true,
})
export class TimeUntilPipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) return '—';

    const now = new Date();
    const target = new Date(value);
    const diffMs = target.getTime() - now.getTime();

    if (diffMs <= 0) return 'Elapsed';

    const totalMinutes = Math.floor(diffMs / 60_000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) return `${days}d, ${hours}h`;
    if (hours > 0 && minutes > 0) return `${hours}h, ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  }
}
