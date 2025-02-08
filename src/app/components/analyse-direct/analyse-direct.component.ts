import { Component, ElementRef, ViewChild } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
  selector: 'app-analyse-direct',
  templateUrl: './analyse-direct.component.html',
  styleUrls: ['./analyse-direct.component.css'],
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
export class AnalyseDirectComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('dropZone') dropZone!: ElementRef;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  selectedFile: File | null = null;
  videoUrl: string | null = null;
  isLoading: boolean = false;
  analysisResult: string | null = null;
  isDragging: boolean = false;
  uploadProgress: number = 0;
  animationState: string = 'inactive';
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  videoThumbnail: string | null = null;

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  // Process the selected file
  private processFile(file: File): void {
    if (!this.isValidVideoFile(file)) {
      alert('Please select a valid video file (MP4, WebM, or MOV)');
      return;
    }

    this.selectedFile = file;
    this.createVideoPreview(file);
    this.simulateUploadProgress();
  }

  // Validate file type
  private isValidVideoFile(file: File): boolean {
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    return validTypes.includes(file.type);
  }

  // Create video preview
  private createVideoPreview(file: File): void {
    const url = URL.createObjectURL(file);
    this.videoUrl = url;
    this.generateThumbnail(url);
    this.toggleAnimation();
  }

  // Generate video thumbnail
  private generateThumbnail(videoUrl: string): void {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.addEventListener('loadeddata', () => {
      video.currentTime = 1; // Skip to 1 second
    });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.videoThumbnail = canvas.toDataURL();
    });
  }

  // Video player controls
  togglePlay(): void {
    const video = this.videoPlayer.nativeElement;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  onTimeUpdate(): void {
    const video = this.videoPlayer.nativeElement;
    this.currentTime = video.currentTime;
    this.duration = video.duration;
  }

  seekVideo(event: any): void {
    const video = this.videoPlayer.nativeElement;
    const time = event.target.value;
    video.currentTime = time;
    this.currentTime = time;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Simulate upload progress
  private simulateUploadProgress(): void {
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      this.uploadProgress += 5;
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

  // Analyze video
  analyseVideo(): void {
    if (!this.selectedFile) {
      alert('Please select a video first');
      return;
    }

    this.isLoading = true;
    this.toggleAnimation();

    // Simulate analysis delay
    setTimeout(() => {
      this.isLoading = false;
      this.analysisResult = 'Analysis complete! We detected various ocean debris in the video.';
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
    this.videoUrl = null;
    this.videoThumbnail = null;
    this.isLoading = false;
    this.analysisResult = null;
    this.uploadProgress = 0;
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
