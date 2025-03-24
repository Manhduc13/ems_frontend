import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './modules/shared/shared.module';
import { StorageService } from './services/storage/storage.service';
import { AuthService } from './services/auth/auth.service';
import { ToastService } from './services/toast/toast.service';
import { ToastComponent } from './modules/shared/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: String = 'demo-client';
  token: string = "";
  currentUser: any = null;

  isLogin = false;

  mainMenu = [
    { label: 'Home', link: '/' },
    { label: 'Contact', link: '/contact' }
  ];

  loggedInMenu = [
    { label: 'Employees', link: '/employees' },
    { label: 'Projects', link: '/projects' }
  ];

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ){}

  ngOnInit(){
    this.authService.getIsLoggedIn().subscribe((res) => {
      this.isLogin = res;
      this.currentUser = this.storageService.getUserInfo();
    });

    this.isAuthenticated();
    
  }

  logout(){
    this.storageService.removeToken();
    this.storageService.removeUserInfo();
    this.authService.setIsLoggedIn(false);
    this.toastService.showToast("Logout successfully", "success");
    this.router.navigateByUrl("/");
  }
  
  toProfilePage(){
    this.router.navigateByUrl("/employees/profile");
  }

  isAuthenticated(){
    this.token = this.storageService.getToken() ?? "";
    if (this.token) {
      this.authService.validateToken(this.token).subscribe((res) => {
        if(res.verify){
          this.isLogin = true;
        } else {
          this.isLogin = false;
          this.storageService.removeToken();
          this.storageService.removeUserInfo();
        }
      });
    } else {
      this.isLogin = false;
    }
  }
}
