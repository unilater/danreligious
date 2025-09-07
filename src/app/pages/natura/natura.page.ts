import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate, registerLocaleData } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AlmanaccoService } from '../../services/almanacco.service';
import { Natura } from '../../models/almanacco.models';

import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);

@Component({
  selector: 'app-natura',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, HttpClientModule],
  templateUrl: './natura.page.html',
  styleUrls: ['./natura.page.scss']
})
export class NaturaPage implements OnInit {
  date = '';
  loading = true;
  error: string | null = null;

  natura: Natura | null = null;

  // testi pronti per il template
  testoOrto: string | null = null;
  testoCucina: string | null = null;
  testoUnico: string | null = null; // fallback quando arriva testo semplice

  constructor(private route: ActivatedRoute, private api: AlmanaccoService) {}

  ngOnInit() {
    const d = this.route.snapshot.paramMap.get('date');
    this.date = d || formatDate(new Date(), 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
    this.load();
  }

  private load() {
    this.loading = true; this.error = null;
    this.api.getNatura(this.date).subscribe({
      next: (n) => {
        this.natura = n ?? null;
        if (!n) this.error = 'Nessun dato di natura per questa data.';
        this.parseTesto(this.natura?.testo ?? null);
        this.loading = false;
      },
      error: (e) => {
        console.error('[NATURA] error', e);
        this.error = 'Errore nel caricamento dei dati.';
        this.loading = false;
      }
    });
  }

  /** Se testo è JSON {"orto":"...","cucina":"..."} lo splitta; altrimenti lo lascia come testo unico */
  private parseTesto(raw: string | null) {
    this.testoOrto = this.testoCucina = this.testoUnico = null;
    if (!raw) return;

    const s = raw.trim();
    if (s.startsWith('{')) {
      try {
        const j = JSON.parse(s);
        this.testoOrto = typeof j.orto === 'string' ? j.orto : null;
        this.testoCucina = typeof j.cucina === 'string' ? j.cucina : null;
        // Se non ci sono le chiavi attese, mostra tutto come unico
        if (!this.testoOrto && !this.testoCucina) this.testoUnico = s;
        return;
      } catch {
        // non è JSON valido, cade nel fallback
      }
    }
    this.testoUnico = s;
  }
}

