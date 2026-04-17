import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimService, Claim } from '../../services/claim.service';
import { ItemService } from '../../services/item.service';
import { Image } from '../../services/image.service';
import { AuthService } from '../../services/auth.service';
import { Item } from '../../models/item.model';
import { Observable, of, combineLatest } from 'rxjs';
import { switchMap, catchError, map, startWith, tap } from 'rxjs/operators';
import { ImageUploadComponent } from '../../shared/image-upload/image-upload.component';

interface ItemDetailVm {
  isLoading: boolean;
  errorMessage: string | null;
  item: Item | null;
  isItemUnderReview: boolean;
  userHasPendingClaim: boolean;
  userHasRejectedClaim: boolean;
}

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ImageUploadComponent],
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetail {
  private claimService = inject(ClaimService);
  private itemService = inject(ItemService);
  private imageService = inject(Image);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private ngZone = inject(NgZone);

  showClaimModal = false;
  showSuccessModal = false;
  proofText = '';

  imagePreview: string | undefined = undefined;
  selectedFile: File | undefined = undefined;

  private router = inject(Router);
  
  vm$: Observable<ItemDetailVm> = this.route.params.pipe(
    map(params => +params['id']),
    switchMap(id => {
      if (!id) {
        return of({
          isLoading: false,
          errorMessage: 'Invalid Item ID.',
          item: null,
          isItemUnderReview: false,
          userHasPendingClaim: false,
          userHasRejectedClaim: false
        });
      }

      // Fetch Item reactively from the global items list
      const item$ = this.itemService.getItems().pipe(
        map(items => items.find(i => i.id === id)),
        map(item => {
          if (!item) return null;
          const anyItem = item as any;
          return {
            ...item,
            imageUrl: anyItem.imageUrl || anyItem.image_url || '/assets/icons/no-img.svg'
          } as Item;
        })
      );

      // Fetch Claims reactively
      const claims$ = this.claimService.getClaims();

      return combineLatest([item$, claims$]).pipe(
        map(([item, claims]) => {
          if (!item) {
            return {
              isLoading: false,
              errorMessage: 'Failed to load item or item not found.',
              item: null,
              isItemUnderReview: false,
              userHasPendingClaim: false,
              userHasRejectedClaim: false
            };
          }

          let isItemUnderReview = false;
          let userHasPendingClaim = false;
          let userHasRejectedClaim = false;

          const currentUser = this.authService.getCurrentUser();
          if (currentUser && currentUser.email) {
            const itemClaims = claims.filter(c => (c.itemId === item.id) && c.status === 'pending');
            isItemUnderReview = itemClaims.length > 0;
            userHasPendingClaim = itemClaims.some(c => c.claimantEmail === currentUser.email);
            userHasRejectedClaim = claims.some(c =>
              (c.itemId === item.id) &&
              c.status === 'rejected' &&
              c.claimantEmail === currentUser.email
            );
          }

          return {
            isLoading: false,
            errorMessage: null,
            item,
            isItemUnderReview,
            userHasPendingClaim,
            userHasRejectedClaim
          };
        }),
        tap((vm: ItemDetailVm) => {
          // If the item is no longer Available (e.g., approved/settled), redirect home
          if (vm.item && vm.item.status && vm.item.status.toLowerCase() !== 'available') {
            this.ngZone.run(() => {
              this.router.navigate(['/user/home']);
            });
          }
        }),
        startWith({
          isLoading: true,
          errorMessage: null,
          item: null,
          isItemUnderReview: false,
          userHasPendingClaim: false,
          userHasRejectedClaim: false
        })
      );
    })
  );

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  onImageChanged(file: File | null) {
    this.selectedFile = file || undefined;
    if (!file) this.imagePreview = undefined;
  }

  submitClaim(item: Item) {
    if (!item || !this.proofText.trim()) return;

    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('Please log in to submit an inquiry.');
      return;
    }

    const newClaim: any = {
      itemId: item.id,
      itemName: item.name,
      itemImageUrl: item.imageUrl || '',
      claimantName: user.name,
      claimantEmail: user.email,
      proofText: this.proofText,
      evidenceImageUrl: null
    };

    // Helper function to proceed with claim submission
    const proceedWithSubmission = (claimData: any) => {
      this.claimService.submitClaim(claimData).subscribe({
        next: () => {
          this.showClaimModal = false;
          this.proofText = '';
          this.imagePreview = undefined;
          this.selectedFile = undefined;
          this.showSuccessModal = true;
        },
        error: (err) => {
          console.error('Failed to submit claim:', err);
          alert('Failed to submit inquiry. Please try again.');
        }
      });
    };

    if (this.selectedFile) {
      // First upload the proof image
      this.imageService.uploadProof(this.selectedFile).subscribe({
        next: (imageUrl: string) => {
          newClaim.evidenceImageUrl = imageUrl;
          proceedWithSubmission(newClaim);
        },
        error: (err: any) => {
          console.error('Failed to upload proof image:', err);
          alert('Failed to upload evidence image. Please try again.');
        }
      });
    } else {
      // No image attached, submit directly
      proceedWithSubmission(newClaim);
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}

