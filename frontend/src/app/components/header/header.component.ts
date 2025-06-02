import { Component } from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    Menubar, 
    TooltipModule,
    RippleModule,
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  items: MenuItem[] = []; // Propiedad items necesaria para el menú
}
