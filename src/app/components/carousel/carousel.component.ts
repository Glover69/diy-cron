import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() items: any[] = [];
  @Input() cardWidth = 300;
  @Input() gap = 16;
  @Input() speed = 0.5; // px per frame — increase for faster scroll

  @ViewChild('track') track!: ElementRef<HTMLDivElement>;

  displayItems: any[] = [];
  activeIndex = 0;

  private currentOffset = 0;
  private rafId?: number;
  private isPaused = false;

  get step(): number {
    return this.cardWidth + this.gap;
  }

  // Total width of ONE set of items
  get setWidth(): number {
    return this.items.length * this.step;
  }

  ngOnChanges(): void {
    this.displayItems = [...this.items, ...this.items, ...this.items];
  }

  ngAfterViewInit(): void {
    // Start at the middle set
    this.currentOffset = -this.setWidth;
    this.setTranslate();
    setTimeout(() => this.startScroll(), 300);
  }

  ngOnDestroy(): void {
    this.stopScroll();
  }

  private setTranslate(): void {
    this.track.nativeElement.style.transform = `translateX(${this.currentOffset}px)`;
  }

  startScroll(): void {
    this.isPaused = false;
    this.tick();
  }

  stopScroll(): void {
    this.isPaused = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  private tick(): void {
    if (this.isPaused) return;

    // Move left by speed px every frame
    this.currentOffset -= this.speed;

    // When we've scrolled through one full set, silently jump back
    if (this.currentOffset <= -(this.setWidth * 2)) {
      this.currentOffset += this.setWidth;
    }

    // Update active dot
    const rawIndex = Math.round((-this.currentOffset % this.setWidth) / this.step);
    this.activeIndex = ((rawIndex % this.items.length) + this.items.length) % this.items.length;

    this.setTranslate();
    this.rafId = requestAnimationFrame(() => this.tick());
  }
}