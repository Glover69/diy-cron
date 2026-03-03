import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

export interface TabItem {
  label: string;
  icon?: string;        // phosphor icon name e.g. 'monitor'
  badge?: number | null;
}

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class TabComponent {
  @Input() label!: string;
  @Input() icon?: string;
  @Input() badge?: number | null = null;

  @ViewChild('content', { static: true }) content!: TemplateRef<any>;

  isActive = false;
}
