import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { AlmanaccoService } from '../../services/almanacco.service';
import { Santo } from '../../models/almanacco.models';

@Component({
  selector: 'app-dettaglio-santo',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule, HttpClientModule],
  templateUrl: './dettagliosanto.page.html',
  styleUrls: ['./dettagliosanto.page.scss']
})
export class DettaglioSantoPage implements OnInit {
  date = '';
  id = 0;
  loading = true;
  error: string | null = null;
  santo: Santo | null = null;

  constructor(private route: ActivatedRoute, private api: AlmanaccoService) {}

  ngOnInit() {
    const d = this.route.snapshot.paramMap.get('date');
    const idParam = this.route.snapshot.paramMap.get('id');
    this.date = d || formatDate(new Date(), 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
    this.id = idParam ? Number(idParam) : 0;
    this.load();
  }

  private load() {
    this.loading = true; this.error = null;
    const src = this.id > 0 ? this.api.getSantoById(this.id) : this.api.getSanto(this.date);
    src.subscribe({
      next: (s) => { this.santo = s ?? null; if (!s) this.error = 'Santo non disponibile.'; this.loading = false; },
      error: (e) => { console.error('[SANTO] error', e); this.error = 'Errore nel caricamento.'; this.loading = false; }
    });
  }
}
