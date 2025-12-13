import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
}

