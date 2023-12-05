import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ManageApiService } from '../../../services/manage-api.service';
import { CustomToastService } from 'src/app/views/shared/custom-toart/custom-toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent implements OnInit {
  exampleFormControl: FormControl = new FormControl();

  private service = inject(ManageApiService);
  private route = inject(Router);
  private notify = inject(CustomToastService)

  constructor() { }

  public showGenerateAgainButton: boolean = false;

  ngOnInit() {
    this.service.getExecutedScript().subscribe({
      next: (value) => {
        if (value.status == 200) {
          this.exampleFormControl.setValue(value.data[0].create_db_script);
          this.showGenerateAgainButton = value.data[0].create_db_script !== null;
        } else if (value.status == 611) {
          // this.notify.setState({ title: 'Lỗi khi lấy truy vấn', desc: value.message, color: 'warning' });
        }
      }
    })
  }

  submitData() {
    const formData = this.exampleFormControl.value;

    this.service.executeGenerator(formData).subscribe({
      next: (response) => {
        if (response.status == 200) {
          this.notify.setState({ show: true, title: 'Chuyển đỗi thành công', desc: `Bạn có thể chuyển truy cập mục APIs để xem các API đã tạo`, color: 'light' });
        }
      },

      error: (err) => {
        this.notify.setState({ show: true, title: 'Chuyển đổi xảy ra lỗi', desc: err.error.message, color: 'warning' });
      },
    })
  }

  summitAgain() {
    const formData = this.exampleFormControl.value;

    this.service.executeScriptAgain(formData).subscribe({
      next: (response) => {
        if (response.status == 200) {
          this.notify.setState({ show: true, title: 'Chuyển đỗi thành công', desc: `Bạn có thể chuyển truy cập mục APIs để xem các API đã tạo`, color: 'light' });
          this.route.navigate(['manage-api/apis'])
        }
      },

      error: (err) => {
        this.notify.setState({ show: true, title: 'Chuyển đổi xảy ra lỗi', desc: err.error.message, color: 'warning' });
      },
    })
  }
}
