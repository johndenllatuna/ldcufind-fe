import { Injectable } from '@angular/core';

// This defines the strict shape of our data
export interface Item {
  id: string;
  name: string;
  description: string;
  location: string;
  date: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  // Our fake database
  private mockItems: Item[] = [
    {
      id: '1',
      name: 'Black Airpods',
      description: 'Black Airpods with sticker at back',
      location: 'Nac Building, Room 302',
      date: '01/01/26',
      imageUrl: 'assets/airpods.jpg'
    },
    {
      id: '2',
      name: 'Blue Hydroflask',
      description: 'Covered in coding stickers',
      location: 'Library 2nd Floor',
      date: '01/02/26',
      imageUrl: 'assets/airpods.jpg' // Reusing your existing image for now
    },
    {
      id: '3',
      name: 'Casio Watch',
      description: 'Silver metal band, scratched face',
      location: 'Cafeteria',
      date: '01/03/26',
      imageUrl: 'assets/airpods.jpg'
    }
  ];

  // Method to get the items
  getItems(): Item[] {
    return this.mockItems;
  }

  // We will use this in the Post Item component!
  addItem(newItem: Item) {
    this.mockItems.push(newItem);
  }
}