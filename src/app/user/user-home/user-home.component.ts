import { Component, signal, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { SocketService } from '../../services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss'],
})
export class UserHome implements OnInit, OnDestroy {
  userAvatarUrl = signal('https://api.dicebear.com/7.x/initials/svg?seed=AT&backgroundColor=8A0000&fontFamily=Inter,sans-serif&fontWeight=700');
  searchQuery = '';
  searchFocused = false;
  allItems: Item[] = [];
  filteredItems: Item[] = [];

  private itemSub: Subscription | null = null;

  constructor(
    private itemService: ItemService, 
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems() {
    this.itemSub = this.itemService.getItems().subscribe(items => {
      this.allItems = items;
      this.searchItems(); // Re-apply search filters
      this.cdr.detectChanges();
    });
  }

  onHomeClick(event: Event) {
    // If already on Home, trigger hard reload
    if (this.router.url === '/user/home') {
      window.location.reload();
    }
  }

  ngOnDestroy() {
    if (this.itemSub) {
      this.itemSub.unsubscribe();
    }
  }

  onSearchInput() {
    this.searchItems();
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  searchItems() {
    // Only show available items to regular users
    const availableItems = this.allItems.filter(item => {
      const status = (item.status || 'Available').toLowerCase();
      return status === 'available';
    });
    
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredItems = [...availableItems];
      return;
    }

    this.filteredItems = availableItems.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }
}
