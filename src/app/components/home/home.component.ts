import { Component, HostListener, Inject, PLATFORM_ID, OnInit, ViewEncapsulation } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslationService } from '../../services/translation.service';

interface NavLink {
  id: string;
  path: string;
  icon: string;
  labelFr: string;
  labelAr: string;
  exact: boolean;
  disabled?: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  isScrolled = false;
  isNavbarHidden = false;
  lastScrollPosition = 0;
  currentLang = 'fr';
  isMobileMenuOpen = false;
  hover: string = '';

  navLinks: NavLink[] = [
    {
      id: 'home',
      path: '/',
      icon: 'fas fa-home',
      labelFr: 'Accueil',
      labelAr: 'الرئيسية',
      exact: true
    },
    {
      id: 'image',
      path: '/analyse-image',
      icon: 'fas fa-image',
      labelFr: 'Analyse Image',
      labelAr: 'تحليل الصور',
      exact: false
    },
    {
      id: 'video',
      path: '/analyse-video',
      icon: 'fas fa-video',
      labelFr: 'Analyse Vidéo',
      labelAr: 'تحليل الفيديو',
      exact: false
    },
    {
      id: 'direct',
      path: '/analyse-direct',
      icon: 'fas fa-camera',
      labelFr: 'Analyse en Direct',
      labelAr: 'تحليل مباشر',
      exact: false,
      disabled: true,
      isNew: true
    },
    {
      id: 'stats',
      path: '/statistiques',
      icon: 'fas fa-chart-bar',
      labelFr: 'Statistiques',
      labelAr: 'إحصائيات',
      exact: false,
      disabled: true,
      isNew: true
    }
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private translationService: TranslationService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.setDirection(this.currentLang);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const currentScroll = window.scrollY;
    
    // Handle navbar background
    this.isScrolled = currentScroll > 50;
    
    // Handle navbar visibility
    if (currentScroll > this.lastScrollPosition && currentScroll > 150) {
      // Scrolling down & past threshold - hide navbar
      this.isNavbarHidden = true;
    } else {
      // Scrolling up - show navbar
      this.isNavbarHidden = false;
    }
    
    // Close mobile menu if open while scrolling
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
    
    this.lastScrollPosition = currentScroll;
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 991.98) {
      this.closeMobileMenu();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.isMobileMenuOpen && !target.closest('.nav-container')) {
      this.isMobileMenuOpen = false;
    }
  }

  ngOnInit() {
    this.translationService.getCurrentLang().subscribe(lang => {
      this.currentLang = lang;
    });
  }

  toggleLanguage() {
    const newLang = this.currentLang === 'fr' ? 'ar' : 'fr';
    this.translationService.setLanguage(newLang);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  private setDirection(lang: string) {
    if (isPlatformBrowser(this.platformId)) {
      this.document.dir = lang === 'ar' ? 'rtl' : 'ltr';
      this.document.documentElement.lang = lang;
    }
  }

  isLinkDisabled(link: NavLink): boolean {
    return link.disabled === true;
  }
} 