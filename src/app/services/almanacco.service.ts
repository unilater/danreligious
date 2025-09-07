// src/app/services/almanacco.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Liturgia, Lettura, Natura, Proverbio, Santo, Onomastico } from '../models/almanacco.models';

const BASE = 'https://cronachedalvaticano.com/app/api';

@Injectable({ providedIn: 'root' })
export class AlmanaccoService {
  constructor(private http: HttpClient) {}

  // helper robusto per i params
  private params(obj?: Record<string, any>): HttpParams {
    let p = new HttpParams();
    if (!obj) return p;
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (v !== undefined && v !== null) p = p.set(k, String(v));
    }
    return p;
  }

  // --- LITURGIA -------------------------------------------------------------
  getLiturgia(date: string): Observable<Liturgia & { letture: Lettura[] }> {
    return this.http
      .get<Liturgia>(`${BASE}/liturgia.php`, { params: this.params({ date }) })
      .pipe(
        map(l => ({
          ...l,
          letture: Array.isArray((l as any).letture)
            ? ((l as any).letture as Lettura[])
            : (() => { try { return JSON.parse((l as any).letture) as Lettura[]; } catch { return []; } })()
        }))
      );
  }

  // --- SANTI ----------------------------------------------------------------
  // lista santi del giorno (puoi mostrarne 2 in tab1)
  getSanti(date: string): Observable<Santo[]> {
    return this.http.get<Santo[]>(`${BASE}/santi.php`, { params: this.params({ date }) });
  }

  // dettaglio per ID
  getSantoById(id: number): Observable<Santo | null> {
    return this.http.get<Santo | null>(`${BASE}/santo.php`, { params: this.params({ id }) });
  }

  // fallback: dettaglio primo santo del giorno (se non hai l'id)
  getSanto(date: string): Observable<Santo | null> {
    return this.http.get<Santo | null>(`${BASE}/santo.php`, { params: this.params({ date }) });
  }

  // --- ALTRO ----------------------------------------------------------------
// src/app/services/almanacco.service.ts (estratto)
getNatura(date: string) {
  return this.http.get<Natura | null>(`${BASE}/natura.php?date=${date}`).pipe(
    map(n => n ? {
      ...n,
      lunaFase: n.lunaFase ?? n.fase_lunare ?? null
    } : null)
  );
}



  getProverbio(date: string) {
    return this.http.get<Proverbio | null>(`${BASE}/proverbio.php`, { params: this.params({ date }) });
  }

  getOnomastici(date: string) {
    return this.http.get<Onomastico[] | null>(`${BASE}/onomastici.php`, { params: this.params({ date }) });
  }
}
