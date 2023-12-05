import { Component, OnInit, inject } from '@angular/core';
import { ProgressModule, ToastModule } from '@coreui/angular';
import { CustomToastService, TToast } from './custom-toast.service';
import { IconModule } from '@coreui/icons-angular';

@Component({
  standalone: true,
  imports: [ToastModule, ProgressModule, IconModule],
  selector: 'ngx-custom-toart',
  templateUrl: './custom-toart.component.html',
  styleUrls: ['./custom-toart.component.scss']
})
export class CustomToartComponent implements OnInit {
  private customService = inject(CustomToastService);
  constructor() { }

  position = 'top-end';
  visible = false;
  percentage = 0;

  public config!: TToast | null;

  ngOnInit() {
    this.customService.getState().subscribe({
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
