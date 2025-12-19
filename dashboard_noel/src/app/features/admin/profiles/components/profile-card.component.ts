import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../models/profile.model';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html'
})
export class ProfileCardComponent {
  @Input() profile: UserProfile | null = null;
  @Input() editable = false;
  
  @Output() edit = new EventEmitter<void>();
  @Output() photoClick = new EventEmitter<void>();

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'ADMIN': 'Administrateur',
      'USER': 'Utilisateur',
      'EMERGENCY_SERVICE': "Service d'urgence"
    };
    return labels[role] || role;
  }

  onEdit(): void {
    this.edit.emit();
  }

  onPhotoClick(): void {
    this.photoClick.emit();
  }
}