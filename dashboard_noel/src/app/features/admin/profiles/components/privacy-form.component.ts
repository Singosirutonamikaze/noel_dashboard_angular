import { Component, Output, EventEmitter } from '@angular/core';
import { PrivacySettings } from '../models/profile.model';

@Component({
  selector: 'app-privacy-form',
  templateUrl: "./privacy-form.component.html",
  standalone: true
})
export class PrivacyFormComponent {
  @Output() privacyLoaded = new EventEmitter<PrivacySettings>();

  emitPrivacy() {
    // Remplace par la vraie récupération des paramètres
    this.privacyLoaded.emit({
      profileVisibility: "PUBLIC",
      showEmail: true,
      showPhone: false,
      showLocation: false,
      allowDataSharing: false
    });
  }
}