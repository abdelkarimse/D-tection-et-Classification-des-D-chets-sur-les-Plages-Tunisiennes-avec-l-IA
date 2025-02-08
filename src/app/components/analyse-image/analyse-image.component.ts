import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'app-analyse-image',
  templateUrl: './analyse-image.component.html',
  styleUrls: ['./analyse-image.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ]),
    trigger('pulseAnimation', [
      state('active', style({ transform: 'scale(1.05)' })),
      state('inactive', style({ transform: 'scale(1)' })),
      transition('inactive => active', animate('300ms ease-in')),
      transition('active => inactive', animate('300ms ease-out'))
    ])
  ]
})
export class AnalyseImageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('dropZone') dropZone!: ElementRef;

  selectedFile: File | null = null;
  imageUrl: string | null = null;
  isLoading: boolean = false;
  analysisResult: string | null = null;
  isDragging: boolean = false;
  uploadProgress: number = 0;
  animationState: string = 'inactive';

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  // Process the selected file
  private processFile(file: File): void {
    if (!this.isValidImageFile(file)) {
      alert('Please select a valid image file (JPG, PNG, or WEBP)');
      return;
    }

    this.selectedFile = file;
    this.createImagePreview(file);
    this.simulateUploadProgress();
  }

  // Validate file type
  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  }

  // Create image preview
  private createImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageUrl = e.target?.result as string;
      this.toggleAnimation();
    };
    reader.readAsDataURL(file);
  }

  // Simulate upload progress
  private simulateUploadProgress(): void {
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      this.uploadProgress += 10;
      if (this.uploadProgress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  }

  // Handle drag and drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  // Trigger file input click
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  // Analyze image
  analyseImage(): void {
    if (!this.selectedFile) {
      alert('Please select an image first');
      return;
    }

    this.isLoading = true;
    this.toggleAnimation();

    // Simulate analysis delay
    setTimeout(() => {
      this.isLoading = false;
      this.analysisResult = 'Analysis complete! We detected various ocean debris in the image.';
      this.toggleAnimation();
    }, 3000);
  }

  // Toggle animation state
  private toggleAnimation(): void {
    this.animationState = 'active';
    setTimeout(() => {
      this.animationState = 'inactive';
    }, 300);
  }

  // Reset component state
  reset(): void {
    this.selectedFile = null;
    this.imageUrl = null;
    this.isLoading = false;
    this.analysisResult = null;
    this.uploadProgress = 0;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
