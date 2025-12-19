import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VehicleDto } from '../models/profile.model';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  standalone: true
})
export class VehicleFormComponent {
  @Input() initialData!: VehicleDto;
  @Output() submitForm = new EventEmitter<VehicleDto>();

  emitVehicle() {
    this.submitForm.emit(this.initialData);
  }
}
