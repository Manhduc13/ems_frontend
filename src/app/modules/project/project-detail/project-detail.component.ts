import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmployeeService } from '../../../services/employee/employee.service';
import { ProjectService } from '../../../services/project/project.service';
import { ToastService } from '../../../services/toast/toast.service';
import { SharedModule } from '../../shared/shared.module';

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

  columns: String[] = ['Id', 'Name', 'Phone', 'Email', 'Role', 'Actions'];

  constructor(
    private projectService: ProjectService,
    private employeeService: EmployeeService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.loadMemberTable();
    this.loadAllEmployees();
  }

  loadMemberTable() {
    this.projectService.getMembers(this.project.id).subscribe({
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

  loadAllEmployees() {
    this.employeeService.getAll().subscribe({
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

  }

  removeMember(employeeId: number) {
    this.projectService.removeMember(this.project.id, employeeId).subscribe({
      next: (res) => {
        if (res) {
          this.toastService.showToast("Remove member successfully", "success");
          this.loadMemberTable();
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
    this.projectService.setAsLeader(this.project.id, employeeId).subscribe({
      next: (res) => {
        if(res) {
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
