import { Component, ElementRef, ViewChild, OnInit, Inject, PLATFORM_ID, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { TranslationService } from '../../services/translation.service';

interface TourismStat {
  year: number;
  visitors: number;
  growth: string;
  revenue: string;
}

interface Impact {
  icon: string;
  label: string;
  value: string;
  description: string;
  trend: number;
  loaded?: boolean;
  progress?: number;
  status?: string;
  critical?: boolean;
}

interface OceanStat {
  icon: string;
  value: string;
  label: string;
  description: string;
  loaded: boolean;
  progress: number;
}

interface DetectionBox {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  confidence?: number;
  type?: string;
}

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],
  animations: [
    trigger('fadeInScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('0.8s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInOnScroll', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('countUp', [
      transition(':enter', [
        query('.stat-number', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('800ms cubic-bezier(0.4, 0, 0.2, 1)', 
            style({ opacity: 1, transform: 'translateY(0)' }))
        ], { optional: true })
      ])
    ]),
    trigger('ripple', [
      transition('* => *', [
        query('.impact-ripple', [
          style({ transform: 'scale(0)', opacity: 1 }),
          animate('1.2s cubic-bezier(0.4, 0, 0.2, 1)', 
            style({ transform: 'scale(2)', opacity: 0 }))
        ], { optional: true })
      ])
    ]),
    trigger('staggerFadeIn', [
      transition('* => true', [
        query('.stat-item', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('600ms cubic-bezier(0.4, 0, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('pageTransition', [
      transition(':enter', [
        query('.hero-section, .ocean-info-section, .environmental-alert', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(200, [
            animate('800ms cubic-bezier(0.4, 0, 0.2, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ]),
    trigger('boxAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class DefaultComponent implements OnInit, AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('featuresSection') featuresSection!: ElementRef;
  @ViewChild('statsSection') statsSection!: ElementRef;
  @ViewChild('oceanSection') oceanSection!: ElementRef;
  
  isRTL = false;
  currentYear = new Date().getFullYear();
  private videoAttempts = 0;
  private maxAttempts = 3;
  isInView = false;

  // Chart configuration
  chartYAxis = [10, 8, 6, 4, 2, 0];
  chartConfig = {
    maxValue: 10,
    barColors: {
      normal: 'var(--mediterranean-blue)',
      hover: 'var(--ceramic-blue)',
      positive: 'var(--success-500)',
      negative: 'var(--danger-500)'
    }
  };

  // New interactive properties
  activeCardIndex: number = -1;
  isImageHovered: boolean = false;
  isImageAnimating: boolean = false;
  imageLoaded: boolean = false;
  activeImpactIndex: number = -1;
  showCta: boolean = false;

  // Enhanced Ocean Statistics
  oceanStats: OceanStat[] = [
    {
      icon: 'fas fa-water',
      value: '1,300',
      label: 'ocean.stats.coast',
      description: 'ocean.stats.coast.description',
      loaded: false,
      progress: 85
    },
    {
      icon: 'fas fa-umbrella-beach',
      value: '575',
      label: 'ocean.stats.beaches',
      description: 'ocean.stats.beaches.description',
      loaded: false,
      progress: 65
    },
    {
      icon: 'fas fa-fish',
      value: '40+',
      label: 'ocean.stats.species',
      description: 'ocean.stats.species.description',
      loaded: false,
      progress: 75
    }
  ];

  // Tourism Statistics
  tourismStats: TourismStat[] = [
    { year: 2019, visitors: 9.4, growth: '+12%', revenue: '5.6B €' },
    { year: 2020, visitors: 2.3, growth: '-75%', revenue: '1.2B €' },
    { year: 2021, visitors: 4.1, growth: '+78%', revenue: '2.4B €' },
    { year: 2022, visitors: 6.8, growth: '+66%', revenue: '3.8B €' },
    { year: 2023, visitors: 8.2, growth: '+21%', revenue: '4.7B €' }
  ];

  // Enhanced Environmental Impacts
  environmentalImpacts: Impact[] = [
    {
      icon: 'fas fa-water',
      label: 'environment.impacts.marine',
      value: '57%',
      description: 'environment.impacts.marine.description',
      trend: -12,
      progress: 57,
      status: 'Moderate Risk',
      critical: true
    },
    {
      icon: 'fas fa-fish',
      label: 'environment.impacts.biodiversity',
      value: '40+',
      description: 'environment.impacts.biodiversity.description',
      trend: -8,
      progress: 40,
      status: 'High Risk',
      critical: true
    },
    {
      icon: 'fas fa-industry',
      label: 'environment.impacts.pollution',
      value: '85%',
      description: 'environment.impacts.pollution.description',
      trend: 15,
      progress: 85,
      status: 'Critical',
      critical: true
    }
  ];

  // Sample detection boxes for demo
  detectionBoxes: DetectionBox[] = [
    { 
      label: 'Bouteille d\'eau', 
      x: 25, 
      y: 35, 
      width: 15, 
      height: 25,
      confidence: 0.95,
      type: 'plastic'
    },
    { 
      label: 'Débris plastique', 
      x: 60, 
      y: 45, 
      width: 20, 
      height: 15,
      confidence: 0.85,
      type: 'plastic'
    }
  ];

  rippleState = 0;

  constructor(
    public translationService: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.translationService.getCurrentLang().subscribe(lang => {
        this.isRTL = lang === 'ar';
        this.updateRTLStyles();
      });
      this.initializeStats();
      this.setupScrollAnimation();
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeVideo();
      this.setupIntersectionObserver();
    }
  }

  private initializeVideo() {
    if (!this.videoPlayer?.nativeElement) return;

    const video = this.videoPlayer.nativeElement;
    
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      this.playVideo(video);
    });

    this.playVideo(video);
  }

  private playVideo(video: HTMLVideoElement) {
    video.play().catch(err => {
      console.warn('Video playback error:', err);
      
      if (this.videoAttempts < this.maxAttempts) {
        this.videoAttempts++;
        setTimeout(() => this.playVideo(video), 1000);
      }
    });
  }

  private updateRTLStyles() {
    document.documentElement.style.setProperty(
      '--chart-direction', 
      this.isRTL ? 'row-reverse' : 'row'
    );
  }

  private initializeStats() {
    // Simulate loading states with staggered timing
    this.oceanStats.forEach((stat, index) => {
      setTimeout(() => {
        stat.loaded = true;
        // Trigger progress bar animation
        const progressBar = document.querySelector(`.stat-item:nth-child(${index + 1}) .progress-bar`);
        if (progressBar) {
          progressBar.classList.add('animate');
        }
      }, index * 200 + 500);
    });
  }

  private setupScrollAnimation() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.isInView = true;
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      if (this.oceanSection) {
        observer.observe(this.oceanSection.nativeElement);
      }
    }
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.classList.add('in-view');
          observer.unobserve(target);
        }
      });
    }, options);

    const elements = document.querySelectorAll('.stat-item, .ocean-image');
    elements.forEach(el => observer.observe(el));
  }

  scrollToFeatures() {
    if (isPlatformBrowser(this.platformId)) {
      this.featuresSection?.nativeElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  getBarHeight(value: number): string {
    return `${(value / this.chartConfig.maxValue) * 100}%`;
  }

  getTrendIcon(trend: number): string {
    return trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
  }

  getTrendClass(trend: number): string {
    return trend > 0 ? 'positive' : 'negative';
  }

  triggerRipple() {
    this.rippleState++;
  }

  startDetection() {
    // Implement detection start logic
    console.log('Starting detection...');
    // Add your detection logic here
  }

  learnMore() {
    // Implement learn more logic
    console.log('Learn more clicked');
    // Add your navigation or modal logic here
  }

  // Interactive card methods
  activateCard(index: number) {
    this.activeCardIndex = index;
    this.triggerRipple();
  }

  getProgressWidth(value: string): number {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''));
    return Math.min(numValue, 100);
  }

  // Image interaction methods
  startImageAnimation() {
    this.isImageHovered = true;
    this.isImageAnimating = true;
  }

  stopImageAnimation() {
    this.isImageHovered = false;
    this.isImageAnimating = false;
  }

  onImageLoad() {
    this.imageLoaded = true;
    // Add any additional image load handling
  }

  // Enhanced number formatting
  formatNumber(value: number | string): string {
    if (typeof value === 'string' && value.includes('+')) {
      return value;
    }
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Impact card interaction methods
  activateImpactCard(index: number) {
    this.activeImpactIndex = index;
    this.triggerRipple();
  }

  getTrendHeight(trend: number): number {
    const absoluteTrend = Math.abs(trend);
    return Math.min(absoluteTrend * 5, 100); // Scale trend to percentage
  }

  getImpactProgress(impact: Impact): number {
    return impact.progress || 0;
  }

  isImpactCritical(impact: Impact): boolean {
    return impact.critical || false;
  }

  getImpactStatus(impact: Impact): string {
    return impact.status || 'Unknown';
  }

  // Action methods
  learnMoreAboutImpact(impact: Impact) {
    console.log('Learning more about:', impact.label);
    // Implement navigation or modal display logic
  }

  takeAction(impact: Impact) {
    console.log('Taking action on:', impact.label);
    // Implement action logic
  }

  joinInitiative() {
    console.log('Joining initiative');
    // Implement join logic
  }

  downloadReport() {
    console.log('Downloading report');
    // Implement download logic
  }
}