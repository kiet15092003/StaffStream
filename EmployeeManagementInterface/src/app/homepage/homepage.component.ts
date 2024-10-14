import { Component, computed, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { AppCustomSidenavComponent } from './app-custom-sidenav/app-custom-sidenav.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    MatToolbarModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    AppCustomSidenavComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})

export class HomepageComponent {
  collapsed = signal(true) 
  sidenavWidth = computed(()=>this.collapsed() ? '65px' : '250px')
  mouseEnterTimeout: any;

  onSidenavMouseEnter(){
    this.mouseEnterTimeout = setTimeout(() => {
      this.collapsed.set(false)
    }, 1000)
  } 
  onSidenavMouseLeave(){
    if (this.mouseEnterTimeout) {
      clearTimeout(this.mouseEnterTimeout);
    }
    this.collapsed.set(true)
  }
}