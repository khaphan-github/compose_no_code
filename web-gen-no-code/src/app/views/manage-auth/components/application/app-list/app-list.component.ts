import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ManageApiService } from '../../../services/manage-api.service';
import { CustomToastService } from 'src/app/views/shared/custom-toart/custom-toast.service';
import { Router } from '@angular/router';
import { ApiGenratedEvent } from 'src/event/api-genrated.event';

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

  private apiGeneratedEvent = inject(ApiGenratedEvent);

  public showDocument = false;
  showSpinner = false;

  constructor() { }

  public showGenerateAgainButton: boolean = false;
  public CODE_MODEL = {
    language: 'sql',
    uri: 'main.sql',
    value: '',
  };

  public readonly CODE_OPTIONS = {
    contextmenu: true,
  }

  onCodeChanged(value: any) {
    this.exampleFormControl.setValue(value);
  }

  ngOnInit() {
    this.service.getExecutedScript().subscribe({
      next: (value) => {
        if (value.status == 200) {
          this.exampleFormControl.setValue(value.data[0].create_db_script);
          this.CODE_MODEL = {
            ...this.CODE_MODEL,
            value: value.data[0].create_db_script,
          }
          this.showGenerateAgainButton = value.data[0].create_db_script !== null;
        } else if (value.status == 611) {
          this.notify.setState({ title: 'Lỗi khi lấy truy vấn', desc: value.message, color: 'warning' });
        }
      }
    })
  }

  submitData() {
    this.showSpinner = true;
    const formData = this.exampleFormControl.value;

    this.service.executeGenerator(formData).subscribe({
      next: (response) => {
        if (response.status == 200) {
          this.apiGeneratedEvent.setState({ fetchData: true });
        }
        setTimeout(() => {
          this.showSpinner = false;
        }, 4000);
      },

      error: (err) => {
        setTimeout(() => {
          this.showSpinner = false;
        }, 4000);
        this.notify.setState({ show: true, title: 'Chuyển đổi xảy ra lỗi', desc: err.error.message, color: 'warning' });
      },
    })
  }

  summitAgain() {
    this.showSpinner = true;

    const formData = this.exampleFormControl.value;

    this.service.executeScriptAgain(formData).subscribe({
      next: (response) => {
        if (response.status == 200) {
          this.apiGeneratedEvent.setState({ fetchData: true });
        }
        setTimeout(() => {
          this.showSpinner = false;
        }, 4000);

      },

      error: (err) => {
        setTimeout(() => {
          this.showSpinner = false;
        }, 4000);
        this.notify.setState({ show: true, title: 'Chuyển đổi xảy ra lỗi', desc: err.error.message, color: 'warning' });
      },
    })
  }

}
