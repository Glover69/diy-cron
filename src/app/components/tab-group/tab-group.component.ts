import { CommonModule } from '@angular/common';
import { Component, ContentChildren, Input, QueryList, AfterContentInit } from '@angular/core';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tab-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css'
})
export class TabGroupComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  @Input() size: 'sm' | 'md' = 'md';

  activeTab?: TabComponent;

  ngAfterContentInit(): void {
    // Set the first tab as active by default
    const first = this.tabs.first;
    if (first) {
      this.setActive(first);
    }
  }

  setActive(tab: TabComponent): void {
    this.tabs.forEach(t => (t.isActive = false));
    tab.isActive = true;
    this.activeTab = tab;
  }
}
