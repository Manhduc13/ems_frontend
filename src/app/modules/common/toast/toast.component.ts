import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  constructor(public toastService: ToastService) { }
}
