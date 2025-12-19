import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface ConfigSettings {
  theme: 'light' | 'dark';
  language: string;
  enableNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  twoFactorAuth: boolean;
  sessionTimeout: number;
  accessLogging: boolean;
}

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent implements OnInit {
  configForm!: FormGroup;
  isSaving = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSettings();
  }

  private initForm(): void {
    this.configForm = this.fb.group({
      theme: ['light', Validators.required],
      language: ['fr', Validators.required],
      enableNotifications: [true],
      emailNotifications: [true],
      smsNotifications: [false],
      notificationFrequency: ['realtime', Validators.required],
      twoFactorAuth: [false],
      sessionTimeout: [30, [Validators.required, Validators.min(5), Validators.max(1440)]],
      accessLogging: [true]
    });

    this.configForm.valueChanges.subscribe(() => {
      this.applyTheme();
    });
  }

  private loadSettings(): void {
    const savedSettings = localStorage.getItem('appConfig');
    if (savedSettings) {
      try {
        const settings: ConfigSettings = JSON.parse(savedSettings);
        this.configForm.patchValue(settings);
      } catch (e) {
        console.error('Error loading settings', e);
      }
    }
  }

  private applyTheme(): void {
    const theme = this.configForm.get('theme')?.value;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  onSaveAll(): void {
    if (this.configForm.valid) {
      this.isSaving.set(true);
      this.successMessage.set(null);
      this.errorMessage.set(null);

      setTimeout(() => {
        try {
          const settings: ConfigSettings = this.configForm.value;
          localStorage.setItem('appConfig', JSON.stringify(settings));
          
          this.applyTheme();
          this.applyLanguage(settings.language);
          
          this.isSaving.set(false);
          this.successMessage.set('Configuration enregistrée avec succès !');
          
          setTimeout(() => {
            this.successMessage.set(null);
          }, 5000);
        } catch (error) {
          this.isSaving.set(false);
          this.errorMessage.set('Erreur lors de l\'enregistrement de la configuration');
          console.error(error);
        }
      }, 1000);
    } else {
      this.errorMessage.set('Veuillez corriger les erreurs dans le formulaire');
    }
  }

  private applyLanguage(lang: string): void {
    localStorage.setItem('appLanguage', lang);
  }
}