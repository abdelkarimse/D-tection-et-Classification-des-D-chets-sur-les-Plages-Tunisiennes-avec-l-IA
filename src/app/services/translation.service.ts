import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: { [key: string]: any } = {};
  private currentLang = new BehaviorSubject<string>('fr');
  private supportedLanguages = ['fr', 'ar'];

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Load initial translations synchronously
    this.http.get(`/assets/i18n/fr.json`).subscribe(
      (data) => {
        this.translations['fr'] = data;
        if (isPlatformBrowser(this.platformId)) {
          const savedLang = localStorage.getItem('language') || 'fr';
          if (savedLang !== 'fr') {
            this.setLanguage(savedLang);
          }
        }
      },
      (error) => console.error('Error loading initial translations:', error)
    );
  }

  getCurrentLang(): Observable<string> {
    return this.currentLang.asObservable();
  }

  setLanguage(lang: string): void {
    if (this.currentLang.value !== lang && this.supportedLanguages.includes(lang)) {
      if (!this.translations[lang]) {
        this.http.get(`/assets/i18n/${lang}.json`).subscribe(
          (data) => {
            this.translations[lang] = data;
            this.updateLanguage(lang);
          },
          (error) => console.error(`Error loading translations for ${lang}:`, error)
        );
      } else {
        this.updateLanguage(lang);
      }
    }
  }

  private updateLanguage(lang: string): void {
    this.currentLang.next(lang);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
      document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  translate(key: string): string {
    const keys = key.split('.');
    let value = this.translations[this.currentLang.value];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value;
  }
} 