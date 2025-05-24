import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  items = [
    { label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
    { label: 'Acerca de', icon: 'pi pi-fw pi-info-circle', routerLink: ['/acerca-de'] },
    { label: 'Contacto', icon: 'pi pi-fw pi-envelope', routerLink: ['/contacto'] }
  ];
}