import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User, UserRole } from '../models/user.model';
import { UserFormComponent } from './user-form.component';
import { UserDetailComponent } from './user-detail.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, UserFormComponent, UserDetailComponent],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  
  users = signal<User[]>([]);
  filteredUsers = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  showCreateForm = signal(false);
  searchQuery = signal('');
  filterRole = signal<UserRole | 'ALL'>('ALL');
  isLoading = signal(false);
  error = signal<string | null>(null);

  readonly UserRole = UserRole;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.applyFilters();
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des utilisateurs');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.applyFilters();
  }

  onFilterRole(role: UserRole | 'ALL'): void {
    this.filterRole.set(role);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.users();

    if (this.filterRole() !== 'ALL') {
      filtered = filtered.filter(u => u.role === this.filterRole());
    }

    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(u =>
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.phone.includes(query)
      );
    }

    this.filteredUsers.set(filtered);
  }

  onViewDetails(user: User): void {
    this.selectedUser.set(user);
    this.showCreateForm.set(false);
  }

  onCloseDetails(): void {
    this.selectedUser.set(null);
  }

  onCreateUser(): void {
    this.showCreateForm.set(true);
    this.selectedUser.set(null);
  }

  onCloseForm(): void {
    this.showCreateForm.set(false);
  }

  onUserCreated(): void {
    this.showCreateForm.set(false);
    this.loadUsers();
  }

  onDeleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
          if (this.selectedUser()?.id === userId) {
            this.selectedUser.set(null);
          }
        },
        error: (err) => {
          this.error.set('Erreur lors de la suppression');
          console.error(err);
        }
      });
    }
  }

  getRoleBadgeClass(role: UserRole): string {
    const classes: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'bg-emerald-100 text-emerald-700',
      [UserRole.USER]: 'bg-blue-100 text-blue-700',
      [UserRole.EMERGENCY_SERVICE]: 'bg-blue-100 text-blue-700'
    };
    return classes[role];
  }

  getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Administrateur',
      [UserRole.USER]: 'Utilisateur',
      [UserRole.EMERGENCY_SERVICE]: 'Service d\'urgence'
    };
    return labels[role];
  }

  getFormattedDate(userId: number): string {
    const dates: Record<number, string> = {
      1: '15/03/2023',
      2: '01/02/2024',
      3: '10/01/2023',
      4: '01/08/2022',
      5: '10/07/2024'
    };
    return dates[userId] || '01/01/2024';
  }

  onOpenActionsMenu(user: User, event: Event): void {
    event.stopPropagation();
    this.onViewDetails(user);
  }
}