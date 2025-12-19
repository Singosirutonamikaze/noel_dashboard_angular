import { Component, Output, EventEmitter } from '@angular/core';
import { UserSettings } from '../models/profile.model';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  standalone: true
})
export class SettingsFormComponent {
  @Output() settingsLoaded = new EventEmitter<UserSettings>();

  emitSettings() {
    // Remplace par la vraie récupération des paramètres
    this.settingsLoaded.emit({
      enableNotifications: true,
      notifyOnIncidents: true,
      notifyOnTrafficJams: false,
      notifyOnFavoriteRoutes: false,
      preferredLanguage: 'fr',
      mapStyle: 'default',
      showTrafficLayer: true,
      autoRefresh: false,
      refreshIntervalSeconds: 60
    });
  }
}
