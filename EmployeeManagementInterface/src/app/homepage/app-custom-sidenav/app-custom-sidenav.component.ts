import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatListModule} from '@angular/material/list'
import {MatIconModule} from '@angular/material/icon'
import { Router, RouterModule } from '@angular/router'; 
import { MatButtonModule } from '@angular/material/button';

export type MenuItem = {
  icon: string,
  label: string,
  route: string,
}

@Component({
  selector: 'app-custom-sidenav',
  standalone: true,
  imports: [CommonModule,MatListModule,MatIconModule,RouterModule,MatButtonModule],
  templateUrl: './app-custom-sidenav.component.html',
  styleUrl: './app-custom-sidenav.component.css'
})

export class AppCustomSidenavComponent {
  sideNavCollapsed = signal(false)
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val)
  }
  constructor(private router: Router){}
  menuItems = signal<MenuItem[]>([
    {
      icon: 'person',
      label: 'Employee',
      route: 'employee',
    },
    {
      icon: 'work',
      label: 'Project',
      route: 'project',
    },
    {
      icon: 'badge',
      label: 'Department',
      route: 'department',
    }
  ])
  profilePicSize = computed(()=>{
    return this.sideNavCollapsed() ? '32' : '100';
  })
  onLogout(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    this.router.navigate(['/login']);
  }
}