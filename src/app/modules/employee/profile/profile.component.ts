import { Component } from '@angular/core';
import { StorageService } from '../../../services/storage/storage.service';
import { EmployeeService } from '../../../services/employee/employee.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userInfo: any = null;
  employee: any = null;

  constructor(
    private storageService: StorageService,
    private employeeService: EmployeeService
  ) {}

  getGoogleMapsUrl(address: string | undefined): string {
    if (!address) return ''; // Handle case when address is empty
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo(){
    this.userInfo = this.storageService.getUserInfo();
    this.employeeService.getById(this.userInfo.id).subscribe((res) => {
      this.employee = res;
    });
  }
}
