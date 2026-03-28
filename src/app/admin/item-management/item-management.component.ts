import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
// 1. ADD THIS IMPORT AT THE TOP:
import { Sidebar } from '../../shared/sidebar/sidebar.component'; 

@Component({
  selector: 'app-item-management',
  standalone: true,
  // 2. ADD IT TO THIS ARRAY:
  imports: [RouterLink, Sidebar], 
  templateUrl: './item-management.component.html',
  styleUrl: './item-management.component.scss'
})
export class ItemManagement {
  // ... your existing code
}