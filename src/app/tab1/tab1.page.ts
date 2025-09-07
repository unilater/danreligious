// src/app/tab1/tab1.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin, of, catchError } from 'rxjs';
// Se la tua versione di RxJS non esporta catchError da 'rxjs', usa:
// import { catchError } from 'rxjs/operators';

import { AlmanaccoService } from '../services/almanacco.service';
import { Liturgia, Lettura, Natura, Proverbio, Santo, Onomastico } from '../models/almanacco.models';

import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule, HttpClientModule],
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss']
})
export class Tab1Page implements OnInit {
  today = '';
  loading = true;
  error: string | null = null;

  liturgia: (Liturgia & { letture: Lettura[] }) | null = null;
  santi: Santo[] = [];
  natura: Natura | null = null;
  proverbio: Proverbio | null = null;
  onomastici: Onomastico[] | null = null;

  private failed: string[] = [];

  get onomasticiDisplay(): string {
    return (this.onomastici ?? []).map(o => o.nome).join(', ');
  }

  constructor(private api: AlmanaccoService) {}

  ngOnInit() {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
    this.load(this.today);
  }

  private markFail(key: string, err: any) {
    this.failed.push(key);
    console.error(`[TAB1] ${key} ERROR`, err);
    return of(null as any);
  }

  load(date: string) {
    this.loading = true;
    this.error = null;
    this.failed = [];

    forkJoin({
      liturgia:   this.api.getLiturgia(date).pipe(catchError(err => this.markFail('liturgia', err))),
      santi:      this.api.getSanti(date).pipe(catchError(err => this.markFail('santi', err))),
      natura:     this.api.getNatura(date).pipe(catchError(err => this.markFail('natura', err))),
      proverbio:  this.api.getProverbio(date).pipe(catchError(err => this.markFail('proverbio', err))),
      onomastici: this.api.getOnomastici(date).pipe(catchError(err => this.markFail('onomastici', err)))
    })
    .subscribe({
      next: d => {
        this.liturgia   = d.liturgia ?? null;
        this.santi      = (d.santi ?? []).slice(0, 2);   // mostra al massimo 2 santi in home
        this.natura     = d.natura ?? null;
        this.proverbio  = d.proverbio ?? null;
        this.onomastici = d.onomastici ?? [];

        if (this.failed.length) {
          this.error = `Dati mancanti: ${this.failed.join(', ')}`;
        }
        this.loading = false;
      },
      error: e => {
        console.error('[TAB1] FATAL ERROR', e);
        this.error = 'Impossibile caricare l’almanacco. Riprova.';
        this.loading = false;
      }
    });
  }

  /** Restituisce una classe CSS per colorare il chip secondo il colore liturgico */
  litColorClass(l?: { color_key?: string; color_label?: string }): string {
    if (!l) return 'neutro';
    const txt = `${l.color_key ?? ''} ${l.color_label ?? ''}`.toLowerCase();
    if (txt.includes('verde') || txt.includes('green'))  return 'lit-verde';
    if (txt.includes('bianco') || txt.includes('white')) return 'lit-bianco';
    if (txt.includes('rosso') || txt.includes('red'))    return 'lit-rosso';
    if (txt.includes('viola') || txt.includes('purple')) return 'lit-viola';
    if (txt.includes('rosa')  || txt.includes('rose'))   return 'lit-rosa';
    return 'lit-neutro';
  }

  /** Utile per *ngFor sui santi (evita ricreazioni inutili) */
  trackBySanto = (_: number, s: Santo) => (s as any).id ?? s.titolo ?? _;
}
