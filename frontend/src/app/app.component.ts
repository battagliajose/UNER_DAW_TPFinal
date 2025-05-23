import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ConfirmDialogModule,
    ToastModule,
    HomeComponent,
    HomeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ConfirmationService, MessageService],
})
export class AppComponent {
  title = 'FrontEnd';
}
