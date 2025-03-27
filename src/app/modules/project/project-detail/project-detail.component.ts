import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProjectService } from '../../../services/project/project.service';
import { ToastService } from '../../../services/toast/toast.service';
import { SharedModule } from '../../shared/shared.module';
import { EmployeeService } from '../../../services/employee/employee.service';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent {
  @Input() project: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  members: any[] = [];
  employees: any[] = [];

  columns: String[] = ['Name', 'Phone', 'Email', 'Position', 'Department'];
  statuses: any[] = [
    {value: 'PLANNED', label: 'Planned'},
    {value: 'IN_PROGRESS', label: 'In Progress'},
    {value: 'COMPLETED', label: 'Completed'},
    {value: 'ON_HOLD', label: 'On Hold'},
    {value: 'CANCELLED', label: 'Cancelled'},
  ];

  selectedEmployeeId: number | null = null;
  selectedStatus: string = '';

  isManager: boolean = false;

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private storageService: StorageService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.selectedStatus = this.project.status;
    this.loadMemberTable();
    this.loadOtherEmployees();
    this.checkManagerRole();
  }

  checkManagerRole() {
    const role = this.storageService.getRoleFromToken();
    console.log(role);
    this.isManager = role.includes("MANAGER")
  }

  changeStatus(){
    this.projectService.updateStatus(this.project.id, this.selectedStatus).subscribe({
      next: () => {
        this.toastService.showToast("Project status updated successfully", "success");
        this.project.status = this.selectedStatus;
        this.refresh.emit();
      },
      error: (err) => {
        this.toastService.showToast("Failed to update project status", "error");
        console.log(err);
      }
    });
  }

  loadMemberTable() {
    this.employeeService.findEmployeesInProject(this.project.id).subscribe({
      next: (res) => {
        this.members = res.map((employee: any) => {
          return {
            ...employee,
            processedAvatar: employee.avatar ? employee.avatar : 'https://res.cloudinary.com/ddfqvag5q/image/upload/v1742184227/default_ncpebq.png'
          }
        });
      },
      error: (err) => {
        this.toastService.showToast("Failed to get members of project", "error");
        console.log(err);
      }
    });
  }

  loadOtherEmployees() {
    this.employeeService.findEmployeesNotInProject(this.project.id).subscribe({
      next: (res) => {
        this.employees = res.map((employee: any) => {
          return {
            ...employee,
            processedAvatar: employee.avatar ? employee.avatar : 'https://res.cloudinary.com/ddfqvag5q/image/upload/v1742184227/default_ncpebq.png'
          }
        })
      },
      error: (err) => {
        this.toastService.showToast("Failed to get all employees", "error");
        console.log(err);
      }
    })
  }

  addMember() {
    if (!this.selectedEmployeeId) {
      this.toastService.showToast("Please select an employee to add", "warning");
    } else {
      this.projectService.addMember(this.project.id, this.selectedEmployeeId).subscribe({
        next: (res) => {
          if (res) {
            this.toastService.showToast("Add member successfully", "success");
            this.loadMemberTable();
            this.selectedEmployeeId = null;
            this.loadOtherEmployees();
            this.refresh.emit();
          } else {
            this.toastService.showToast("Add member failed", "error");
          }
        },
        error: (err) => {
          this.toastService.showToast("Failed to add member", "error");
          console.log(err);
        }
      })
    }
  }

  removeMember(employeeId: number) {
    this.projectService.removeMember(this.project.id, employeeId).subscribe({
      next: (res) => {
        if (res) {
          this.toastService.showToast("Remove member successfully", "success");
          this.loadMemberTable();
          this.selectedEmployeeId = null;
          this.loadOtherEmployees();
          this.refresh.emit();
        } else {
          this.toastService.showToast("Remove member failed", "error");
        }
      },
      error: (err) => {
        this.toastService.showToast("Failed to remove member", "error");
        console.log(err);
      }
    })
  }

  setAsLeader(employeeId: number) {
    this.projectService.chooseLeader(this.project.id, employeeId).subscribe({
      next: (res) => {
        if (res) {
          this.toastService.showToast("Set this member as leader successfully", "success");
          this.project.leader_id = employeeId;
          this.loadMemberTable();
          this.refresh.emit();
        } else {
          this.toastService.showToast("Set this member as leader failed", "error");
        }
      },
      error: (err) => {
        this.toastService.showToast("Failed to set this member as leader", "error");
        console.log(err);
      }
    })
  }
}
