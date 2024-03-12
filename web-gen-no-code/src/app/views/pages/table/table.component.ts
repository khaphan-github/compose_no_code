import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ManageApiService } from '../../manage-auth/services/manage-api.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  inputRequired!: FormGroup;
  @Input() tableStructure: any;
  @Input() tableData: any[]=[];
   public visible = false;

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

 handleLiveDemoChange(event: any) {
  this.visible = event;
}
 constructor(private http: HttpClient, private router: Router) {}
  @Input() item = '';
  ngOnInit() {}

  getValues(genForm: NgForm) {
    // console.log(val);
    const editedValues = Object.assign({}, this.selectedRow, genForm.value);
    console.log(editedValues);
    this.visible = !this.visible;
    this.router.navigateByUrl('/manage-api/gentable', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url]);
    });
  }
  
  
  selectedRow: any = {};
  updateData(id: number) {
    const row = this.tableData.find(item => item.id === id);
    if (row) {
      console.log(row);
      this.selectedRow = row;

     } else {
      console.log('Dòng không tồn tại.');
    }
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  deleteData(id: number) {
  
      console.log(id);
    
  }

  
}
