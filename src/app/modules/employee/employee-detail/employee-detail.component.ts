import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ToastService } from '../../../services/toast/toast.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { StorageService } from '../../../services/storage/storage.service';

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

  currentStatus: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private toastService: ToastService,
    private employeeService: EmployeeService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    if (this.employee) {
      this.currentStatus = this.employee.active;
    }
    this.checkAdminRole();
  }

  checkAdminRole() {
    const role = this.storageService.getRoleFromToken();
    console.log(role);
    this.isAdmin = role.includes("ADMIN") // Chỉ ADMIN mới có quyền
  }

  changeStatus() {
    this.employeeService.changeStatus(this.employee.id).subscribe({
      next: (res) => {
        if (res.result) {
          this.currentStatus = !this.currentStatus;
          this.toastService.showToast('Employee status updated successfully', 'success');
          this.refresh.emit();
        } else {
          this.toastService.showToast('You can not change admin status', 'error');
        }
      },
      error: (err) => {
        console.log("Change status failed: ", err);
        this.toastService.showToast('Employee status update failed', 'error');
      }
    })
  }

}
