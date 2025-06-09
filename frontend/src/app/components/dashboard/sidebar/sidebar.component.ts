import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RippleModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent {

  @Output() menuClick = new EventEmitter<string>();
  items = [
    { label: 'Inicio', icon: 'pi pi-home', id: 'inicio' },
    { label: 'Ver listado', icon: 'pi pi-list', id: 'listado' },   
  ];
   title: string = 'Menú';

   //metodo que se ejecuta al seleccionar un item del menu y lo recibe el padre
   onItemClick(id: string) {
    this.menuClick.emit(id);
  }
}
