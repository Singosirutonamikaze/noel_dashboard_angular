import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent {
  isSidebarOpen = true;
  isProfileMenuOpen = false;
  showLogoutModal = false;


  constructor(public authService: AuthService) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  confirmLogout() {
    this.authService.logout();
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  getUserInfo() {
    this.authService.getUserInfo();
  }
}
