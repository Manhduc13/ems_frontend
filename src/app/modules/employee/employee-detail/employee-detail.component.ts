import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ToastService } from '../../../services/toast/toast.service';
import { EmployeeService } from '../../../services/employee/employee.service';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css'
})
export class EmployeeDetailComponent {
  @Input() employee: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  currentStatus: Boolean = false;

  constructor(
    private toastService: ToastService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    if(this.employee) {
      this.currentStatus = this.employee.active;
    }
  }

  changeStatus() {
    this.employeeService.changeStatus(this.employee.id).subscribe((res) => {
      if(res.changed){
        this.currentStatus = !this.currentStatus;
        this.toastService.showToast('Employee status updated successfully', 'success');
        this.refresh.emit();
      } else {
        this.toastService.showToast('You can not update admin status', 'error');
      }
    })
  }

}
