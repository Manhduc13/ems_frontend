import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './modules/shared/shared.module';
import { StorageService } from './services/storage/storage.service';
import { AuthService } from './services/auth/auth.service';
import { ToastComponent } from "./modules/common/toast/toast.component";
import { ToastService } from './services/toast/toast.service';

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

  isLogin = false;

  // Danh sách menu khi chưa đăng nhập
  mainMenu = [
    { label: 'Home', link: '/' },
    { label: 'About', link: '/about' },
    { label: 'Services', link: '/services' },
    { label: 'Contact', link: '/contact' }
  ];

  // Danh sách menu khi đã đăng nhập
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
    });

    this.isAuthenticated();
    console.log(this.isLogin);
    
  }

  logout(){
    this.storageService.removeToken();
    this.storageService.removeUserInfo();
    this.authService.setIsLoggedIn(false);
    this.toastService.showToast("Logout successfully", "success");
    this.router.navigateByUrl("/");
  }

  isAuthenticated(){
    this.token = this.storageService.getToken() ?? "";
    if (this.token) {
      this.authService.validateToken(this.token).subscribe((res) => {
        this.isLogin = res === "valid"; // Nếu token hợp lệ, set isLogin = true
        if (!this.isLogin) {
          this.storageService.removeToken();
          this.storageService.removeUserInfo();
        }
      });
    } else {
      this.isLogin = false;
    }
  }
}
