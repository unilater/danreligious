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
  date: string;
  weekday: string;
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

  mondayIso = '';
  sundayIso = '';
  days: DayRow[] = [];

  /** limite massimo (lunedì della prossima settimana) */
  maxWeek = '';

  constructor(private api: AlmanaccoService) {}

  ngOnInit() {
    const today = new Date();
    this.setWeekAround(today);

    // calcola lunedì prossima settimana come limite
    const nextMonday = new Date(today);
    const offset = (today.getDay() + 6) % 7;
    nextMonday.setDate(today.getDate() - offset + 7);
    this.maxWeek = formatDate(nextMonday, 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');

    this.loadWeek();
  }

  private setWeekAround(ref: Date) {
    const d = new Date(ref);
    const offset = (d.getDay() + 6) % 7;
    const monday = new Date(d);
    monday.setDate(d.getDate() - offset);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    this.mondayIso = formatDate(monday, 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
    this.sundayIso = formatDate(sunday, 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
  }

  private weekIsoDates(): string[] {
    const [y, m, da] = this.mondayIso.split('-').map(Number);
    const base = new Date(y, m - 1, da);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return formatDate(d, 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
    });
  }

  private weekdayLabel(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat('it-IT', { weekday: 'long' }).format(new Date(y, m - 1, d));
  }

  loadWeek(event?: CustomEvent) {
    this.loading = !event;
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
      next: rows => {
        this.days = dates.map((date, i) => ({
          date,
          weekday: this.weekdayLabel(date),
          liturgia: rows[i]
        }));
        this.loading = false;
        (event?.target as any)?.complete?.();
      },
      error: e => {
        console.error('[TAB2] FATAL', e);
        this.error = 'Impossibile caricare la settimana. Riprova.';
        this.loading = false;
        (event?.target as any)?.complete?.();
      }
    });
  }

prevWeek() {
  // disabilitato: non si può andare prima della settimana corrente
  return;
}


  nextWeek() {
    if (this.mondayIso < this.maxWeek) {
      const [y, m, d] = this.mondayIso.split('-').map(Number);
      const monday = new Date(y, m - 1, d);
      monday.setDate(monday.getDate() + 7);
      this.setWeekAround(monday);
      this.loadWeek();
    }
  }

  thisWeek() {
    this.setWeekAround(new Date());
    this.loadWeek();
  }

  litColorClass(l?: { color_key?: string; color_label?: string }): string {
    if (!l) return 'lit-neutro';
    const txt = `${l.color_key ?? ''} ${l.color_label ?? ''}`.toLowerCase();
    if (txt.includes('verde') || txt.includes('green')) return 'lit-verde';
    if (txt.includes('bianco') || txt.includes('white')) return 'lit-bianco';
    if (txt.includes('rosso') || txt.includes('red')) return 'lit-rosso';
    if (txt.includes('viola') || txt.includes('purple')) return 'lit-viola';
    if (txt.includes('rosa') || txt.includes('rose')) return 'lit-rosa';
    return 'lit-neutro';
  }

  trackByDate = (_: number, r: DayRow) => r.date;

  getVangeloSnippet(lit?: { letture?: any[] } | null): string | null {
  if (!lit?.letture) return null;
  const vangelo = lit.letture.find(
    (l: any) => typeof l?.tipo === 'string' && l.tipo.toUpperCase().includes('VANGELO')
  );
  return vangelo?.snippet || null;
}


  primaryReadingLabel(lit?: { letture?: any[] } | null): string | null {
    const arr = (lit?.letture as any[]) || [];
    if (!arr.length) return null;
    const isStr = (v: any) => typeof v === 'string' && v.trim().length > 0;
    const pick = arr.find(x => isStr(x?.tipo) && /vangelo/i.test(x.tipo)) || arr[0];
    const tipo = isStr(pick?.tipo) ? pick.tipo : '';
    const rif = isStr(pick?.riferimento) ? pick.riferimento : '';
    const out = [tipo, rif].filter(Boolean).join(' ');
    return out || null;
  }
}
