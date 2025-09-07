import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate, registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { forkJoin, of, catchError } from 'rxjs';

import localeIt from '@angular/common/locales/it';
import { AlmanaccoService } from '../services/almanacco.service';
import { Liturgia } from '../models/almanacco.models';
registerLocaleData(localeIt);

type DayRow = {
  date: string;            // YYYY-MM-DD
  weekday: string;         // lunedì, martedì...
  liturgia: (Liturgia & { letture?: any[] }) | null;
};

@Component({
  selector: 'app-tab2',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule, HttpClientModule],
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss']
})
export class Tab2Page implements OnInit {
  loading = true;
  error: string | null = null;

  /** Lunedì di riferimento della settimana corrente (ISO) */
  mondayIso = '';
  /** Domenica (ISO) */
  sundayIso = '';
  /** Righe della lista */
  days: DayRow[] = [];

  constructor(private api: AlmanaccoService) {}

  ngOnInit() {
    const today = new Date();
    this.setWeekAround(today);
    this.loadWeek();
  }

  /** Calcola lunedì e domenica attorno a una data di riferimento */
  private setWeekAround(ref: Date) {
    const d = new Date(ref);
    // getDay(): 0=dom,1=lun,...; vogliamo lunedì come inizio
    const offset = (d.getDay() + 6) % 7; // 0 se lun, 6 se dom
    const monday = new Date(d);
    monday.setDate(d.getDate() - offset);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    this.mondayIso = formatDate(monday, 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
    this.sundayIso = formatDate(sunday, 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
  }

  /** Array YYYY-MM-DD per lun→dom */
  private weekIsoDates(): string[] {
    const [y, m, da] = this.mondayIso.split('-').map(Number);
    const base = new Date(y, m - 1, da);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return formatDate(d, 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
    });
  }

  /** “lunedì”, “martedì”, … in it-IT */
  private weekdayLabel(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('it-IT', { weekday: 'long' }).format(new Date(y, m - 1, d));
  }

  /** Carica la settimana corrente (lun→dom) */
  loadWeek(event?: CustomEvent) {
    this.loading = !event;          // se è pull-to-refresh non mostro skeleton
    this.error = null;

    const dates = this.weekIsoDates();
    const calls = dates.map(date =>
      this.api.getLiturgia(date).pipe(
        catchError(err => {
          console.error('[TAB2] getLiturgia error for', date, err);
          return of(null);
        })
      )
    );

    forkJoin(calls).subscribe({
      next: (rows) => {
        this.days = dates.map((date, i) => ({
          date,
          weekday: this.weekdayLabel(date),
          liturgia: rows[i]
        }));
        this.loading = false;
        (event?.target as any)?.complete?.();
      },
      error: (e) => {
        console.error('[TAB2] FATAL', e);
        this.error = 'Impossibile caricare la settimana. Riprova.';
        this.loading = false;
        (event?.target as any)?.complete?.();
      }
    });
  }

  /** Navigazione tra settimane */
  prevWeek() {
    const [y, m, d] = this.mondayIso.split('-').map(Number);
    const monday = new Date(y, m - 1, d);
    monday.setDate(monday.getDate() - 7);
    this.setWeekAround(monday);
    this.loadWeek();
  }
  nextWeek() {
    const [y, m, d] = this.mondayIso.split('-').map(Number);
    const monday = new Date(y, m - 1, d);
    monday.setDate(monday.getDate() + 7);
    this.setWeekAround(monday);
    this.loadWeek();
  }
  thisWeek() {
    this.setWeekAround(new Date());
    this.loadWeek();
  }

  /** Chip per colore liturgico (stessa logica della Tab1) */
  litColorClass(l?: { color_key?: string; color_label?: string }): string {
    if (!l) return 'lit-neutro';
    const txt = `${l.color_key ?? ''} ${l.color_label ?? ''}`.toLowerCase();
    if (txt.includes('verde') || txt.includes('green'))  return 'lit-verde';
    if (txt.includes('bianco') || txt.includes('white')) return 'lit-bianco';
    if (txt.includes('rosso') || txt.includes('red'))    return 'lit-rosso';
    if (txt.includes('viola') || txt.includes('purple')) return 'lit-viola';
    if (txt.includes('rosa')  || txt.includes('rose'))   return 'lit-rosa';
    return 'lit-neutro';
  }

  /** Per *ngFor */
  trackByDate = (_: number, r: DayRow) => r.date;

// Sceglie "Vangelo ..." se presente, altrimenti la prima lettura.
// Ritorna stringa breve tipo: "Vangelo Mc 1,1-8" oppure "I Lettura Gen 12,1-4".
primaryReadingLabel(lit?: { letture?: any[] } | null): string | null {
  const arr = (lit?.letture as any[]) || [];
  if (!arr.length) return null;
  const isStr = (v:any) => typeof v === 'string' && v.trim().length > 0;
  const pick = arr.find(x => isStr(x?.tipo) && /vangelo/i.test(x.tipo)) || arr[0];
  const tipo = isStr(pick?.tipo) ? pick.tipo : '';
  const rif  = isStr(pick?.riferimento) ? pick.riferimento : '';
  const out = [tipo, rif].filter(Boolean).join(' ');
  return out || null;
}





}
