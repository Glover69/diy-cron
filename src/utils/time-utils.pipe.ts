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

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
  }
}
