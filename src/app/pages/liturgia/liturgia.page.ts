import { Component, OnInit } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlmanaccoService } from '../../services/almanacco.service';
import { Liturgia, Lettura, Natura, Proverbio, Santo } from '../../models/almanacco.models';

import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

@Component({
  selector: 'app-liturgia',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule, HttpClientModule],
  templateUrl: './liturgia.page.html',
  styleUrls: ['./liturgia.page.scss']
})
export class LiturgiaPage implements OnInit {
  /** Data richiesta via route param (YYYY-MM-DD) */
  date = '';
  loading = true;
  error: string | null = null;

  liturgia: (Liturgia & { letture: Lettura[] }) | null = null;
  santi: Santo[] = [];
  natura: Natura | null = null;
  proverbio: (Proverbio & { citazione?: string | null; consiglio?: string | null }) | null = null;

  private failed: string[] = [];

  constructor(
    private api: AlmanaccoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('date');
    if (!param || !/^\d{4}-\d{2}-\d{2}$/.test(param)) {
      this.loading = false;
      this.error = 'Data mancante o non valida (usa formato YYYY-MM-DD).';
      return;
    }
    this.date = param;
    this.load(this.date);
  }

  private markFail(key: string, err: any) {
    this.failed.push(key);
    console.error(`[LITURGIA] ${key} ERROR`, err);
    return of(null as any);
  }

  load(date: string) {
    this.loading = true;
    this.error = null;
    this.failed = [];

    forkJoin({
      liturgia:  this.api.getLiturgia(date).pipe(catchError(err => this.markFail('liturgia', err))),
      santi:     this.api.getSanti(date).pipe(catchError(err => this.markFail('santi', err))),
      natura:    this.api.getNatura(date).pipe(catchError(err => this.markFail('natura', err))),
      proverbio: this.api.getProverbio(date).pipe(catchError(err => this.markFail('proverbio', err)))
    }).subscribe({
      next: d => {
        this.liturgia  = d.liturgia ?? null;
        this.santi     = (d.santi ?? []).slice(0, 2);
        this.natura    = d.natura ?? null;

        // normalizza il proverbio come in Tab1
        const pro: any = d.proverbio ?? null;
        if (pro && (pro.testo || pro.proverbio)) {
          this.proverbio = {
            testo: pro.testo ?? pro.proverbio ?? null,
            citazione: pro.citazione ?? null,
            consiglio: pro.consiglio ?? null
          };
        } else {
          this.proverbio = null;
        }

        if (this.failed.length) {
          this.error = `Dati mancanti: ${this.failed.join(', ')}`;
        }
        this.loading = false;
      },
      error: e => {
        console.error('[LITURGIA] FATAL ERROR', e);
        this.error = 'Impossibile caricare i dati. Riprova.';
        this.loading = false;
      }
    });
  }

  /** Classe CSS per colore liturgico */
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

  /** Per *ngFor sui santi */
  trackBySanto = (_: number, s: Santo) => (s as any).id ?? s.titolo ?? _;
}
