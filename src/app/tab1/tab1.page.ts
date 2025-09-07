import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin, of, catchError } from 'rxjs';

import { AlmanaccoService } from '../services/almanacco.service';
import { Liturgia, Lettura, Natura, Proverbio, Santo, Onomastico } from '../models/almanacco.models';

@Component({
  selector: 'app-tab1',
  standalone: true,
  // 👇 includo HttpClientModule qui per sicurezza
  imports: [CommonModule, FormsModule, RouterModule, IonicModule, HttpClientModule],
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss']
})
export class Tab1Page implements OnInit {
  today = '';
  loading = true;
  error: string | null = null;

  liturgia?: (Liturgia & { letture: Lettura[] }) | null;
  santo?: Santo | null;
  natura?: Natura | null;
  proverbio?: Proverbio | null;
  onomastici?: Onomastico[] | null;

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
      liturgia: this.api.getLiturgia(date).pipe(catchError(err => this.markFail('liturgia', err))),
      santo: this.api.getSanto(date).pipe(catchError(err => this.markFail('santo', err))),
      natura: this.api.getNatura(date).pipe(catchError(err => this.markFail('natura', err))),
      proverbio: this.api.getProverbio(date).pipe(catchError(err => this.markFail('proverbio', err))),
      onomastici: this.api.getOnomastici(date).pipe(catchError(err => this.markFail('onomastici', err)))
    }).subscribe({
      next: d => {
        console.log('[TAB1] DATA', d);
        this.liturgia = d.liturgia ?? null;
        this.santo = d.santo ?? null;
        this.natura = d.natura ?? null;
        this.proverbio = d.proverbio ?? null;
        this.onomastici = d.onomastici ?? [];

        if (this.failed.length) {
          this.error = `Dati mancanti: ${this.failed.join(', ')}`;
        }
        this.loading = false;
      },
      error: e => {
        // dovrebbe arrivare raramente, solo se forkJoin stesso fallisce
        console.error('[TAB1] FATAL ERROR', e);
        this.error = 'Impossibile caricare l’almanacco. Riprova.';
        this.loading = false;
      }
    });
  }
}
