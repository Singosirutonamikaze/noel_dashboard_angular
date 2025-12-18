import { Component } from '@angular/core';
import { UserListComponent } from '../components/user-list.component';

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [UserListComponent],
  templateUrl: './users-list-page.component.html'
})
export class UsersListPageComponent {}