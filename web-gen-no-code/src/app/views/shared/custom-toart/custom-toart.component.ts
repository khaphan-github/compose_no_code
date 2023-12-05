import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ProgressModule, ToastModule } from '@coreui/angular';
import { CustomToastService, TToast } from './custom-toast.service';
import { IconModule } from '@coreui/icons-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [ToastModule, ProgressModule, IconModule],
  selector: 'ngx-custom-toart',
  templateUrl: './custom-toart.component.html',
  styleUrls: ['./custom-toart.component.scss']
})
export class CustomToartComponent implements OnInit, OnDestroy {
  private customService = inject(CustomToastService);
  private readonly destroy$$ = new Subject<void>();

  constructor() { }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  position = 'top-end';
  visible = false;
  percentage = 0;

  public config!: TToast | null;

  ngOnInit() {
    this.customService.getState().pipe(takeUntil(this.destroy$$)).subscribe({
      next: (value) => {
        this.config = value;
        this.visible = value?.show ?? false;
      },
    })
  }

  toggleToast() {
    this.visible = !this.visible;
  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }
}
