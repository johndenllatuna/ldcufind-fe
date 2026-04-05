import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👇 ADD THIS IMPORT
import { Sidebar } from '../../shared/sidebar/sidebar.component';
import { ClaimService, Claim } from '../../services/claim.service';

@Component({
  selector: 'app-settled-items',
  standalone: true,
  // 👇 ADD FormsModule HERE
  imports: [CommonModule, FormsModule, Sidebar], 
  templateUrl: './settled-items.component.html',
  styleUrls: ['./settled-items.component.scss']
})
export class SettledItems implements OnInit {
  private claimService = inject(ClaimService);
  
  settledClaims: Claim[] = [];
  selectedItem: Claim | null = null;
  
  // NEW: State for edit mode
  isEditMode: boolean = false;
  // NEW: Holds temp value during edit before saving
  tempProofDetails: string = '';

  ngOnInit() {
    this.settledClaims = this.claimService.getClaims().filter(claim => claim.status === 'verified');
  }

  viewDetails(claim: Claim) {
    this.selectedItem = claim;
    // NEW: Populates the temp field with existing data
    this.tempProofDetails = claim.proofText; 
    // Always start in read-only mode when opening
    this.isEditMode = false; 
  }

  goBack() {
    this.selectedItem = null;
    this.isEditMode = false;
  }

  // --- NEW: Edit Mode Functions ---

  enterEditMode() {
    this.isEditMode = true;
  }

  cancelEdit() {
    // Just reset the flag, temp data will be reset on next viewDetails call
    this.isEditMode = false;
  }

  saveChanges() {
    if (this.selectedItem) {
        // Here you would call a service to update the actual database
        console.log("Saving changes for claim:", this.selectedItem.id);
        console.log("New proof details:", this.tempProofDetails);
        
        // Mock data update
        this.selectedItem.proofText = this.tempProofDetails;
        
        // Exits edit mode after successful save
        this.isEditMode = false;
    }
  }
}