import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AlmanaccoService } from '../../services/almanacco.service';
import { Liturgia, Lettura } from '../../models/almanacco.models';

@Component({
  selector: 'app-messa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule],
  templateUrl: './messa.page.html',
  styleUrls: ['./messa.page.scss']
})
export class MessaPage implements OnInit {
  date = '';
  loading = true;
  error: string | null = null;

  liturgia?: (Liturgia & { letture: Lettura[] });

  constructor(private route: ActivatedRoute, private api: AlmanaccoService) {}

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('date');
    this.date = param || formatDate(new Date(), 'yyyy-MM-dd', 'it-IT', 'Europe/Rome');
    this.load(this.date);
  }

  load(d: string) {
    this.loading = true; this.error = null;
    this.api.getLiturgia(d).subscribe({
      next: l => { this.liturgia = l; this.loading = false; },
      error: e => { this.error = 'Non riesco a caricare le letture.'; this.loading = false; console.error(e); }
    });
  }

  hasText(l: Lettura) { return !!(l?.testo?.trim?.() || l?.snippet?.trim?.()); }
}
