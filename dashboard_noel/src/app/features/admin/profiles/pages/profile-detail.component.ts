import { Component, OnInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { UserProfile, UpdateProfileDto, VehicleDto, UserSettings, PrivacySettings } from '../models/profile.model';
import { ProfileCardComponent } from '../components/profile-card.component';
import { ProfileFormComponent } from '../components/profile-form.component';
import { PrivacyFormComponent } from '../components/privacy-form.component';
import { SettingsFormComponent } from '../components/settings-form.component';
import { VehicleFormComponent } from '../components/vehicle-form.component';

@Component({
  selector: 'app-profile-detail',
  standalone: true,
  imports: [CommonModule, ProfileCardComponent, ProfileFormComponent, PrivacyFormComponent, SettingsFormComponent, VehicleFormComponent],
  templateUrl: './profile-detail.component.html',
})
export class ProfileDetailComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  profile = signal<UserProfile | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<string>('info');
  editMode = signal(false);

  tabs = [
    { id: 'info', label: 'Informations' },
    { id: 'vehicle', label: 'Véhicule' },
    { id: 'settings', label: 'Paramètres' },
    { id: 'privacy', label: 'Confidentialité' },
    { id: 'danger', label: 'Zone dangereuse' }
  ];

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du profil');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  onRefresh(): void {
    this.loadProfile();
  }

  onEditProfile(): void {
    this.editMode.set(true);
  }

  onUpdateProfile(data: UpdateProfileDto): void {
    this.profileService.updateProfile(data).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.editMode.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors de la mise à jour du profil');
        console.error(err);
      }
    });
  }

  onUpdateVehicle(data: VehicleDto): void {
    this.profileService.updateVehicle(data).subscribe({
      next: (profile) => {
        this.profile.set(profile);
      },
      error: (err) => {
        this.error.set('Erreur lors de la mise à jour du véhicule');
        console.error(err);
      }
    });
  }

  onPhotoUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.error.set('Veuillez sélectionner une image');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.error.set('L\'image ne doit pas dépasser 5MB');
        return;
      }

      this.profileService.uploadPhoto(file).subscribe({
        next: (profile) => {
          this.profile.set(profile);
          this.error.set(null);
        },
        error: (err) => {
          this.error.set('Erreur lors du téléchargement de la photo');
          console.error(err);
        }
      });
    }
  }

  onDeleteAccount(): void {
    const confirmed = confirm(
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
    );

    if (confirmed) {
      this.profileService.deleteAccount().subscribe({
        next: () => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error.set('Erreur lors de la suppression du compte');
          console.error(err);
        }
      });
    }
  }

  onSettingsLoaded(settings: UserSettings): void {
    // Handle settings loaded
  }

  onPrivacyLoaded(privacy: PrivacySettings): void {
    // Handle privacy settings loaded
  }

  getProfileUpdateDto(): UpdateProfileDto {
    const p = this.profile()!;
    return {
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      address: p.address,
      country: p.country,
      city: p.city
    };
  }

  getVehicleDto(): VehicleDto {
    const p = this.profile()!;
    return {
      vehicleType: p.vehicleType,
      vehicleBrand: p.vehicleBrand,
      vehicleModel: p.vehicleModel,
      vehicleColor: p.vehicleColor,
      vehicleLicensePlate: p.vehicleLicensePlate
    };
  }
}