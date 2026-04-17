import { Component, Input, Output, EventEmitter, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  @Input() set initialPreview(value: string | undefined) {
    this.imagePreview = value;
  }
  @Output() imageChanged = new EventEmitter<File | null>();

  imagePreview: string | undefined = undefined;
  isDragging = false;

  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.processFile(file);
      input.value = ''; // Reset input value so the same file can be selected again
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.processFile(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.imagePreview = undefined;
    this.imageChanged.emit(null);
    this.cdr.detectChanges();
  }

  private processFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      // FileReader resolves outside of Angular's zone, so we wrap it in ngZone.run()
      this.ngZone.run(() => {
        this.imagePreview = reader.result as string;
        this.imageChanged.emit(file);
        this.cdr.detectChanges(); // Ensure the preview renders immediately
      });
    };
    reader.readAsDataURL(file);
  }
}
