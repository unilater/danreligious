import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Liturgia, Lettura, Natura, Proverbio, Santo, Onomastico } from '../models/almanacco.models';

const BASE = 'https://cronachedalvaticano.com/app/api';

@Injectable({ providedIn: 'root' })
export class AlmanaccoService {
  constructor(private http: HttpClient) {}

  // wrapper GET senza Object.fromEntries
  private get<T>(endpoint: string, params?: Record<string, any>): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key in params) {
        if (!Object.prototype.hasOwnProperty.call(params, key)) continue;
        const v = params[key];
        if (v !== undefined && v !== null) {
          httpParams = httpParams.set(key, String(v));
        }
      }
    }

    return this.http.get<T>(`${BASE}/${endpoint}`, { params: httpParams }).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error(`[API] GET ${endpoint}`, {
          status: err.status, statusText: err.statusText, url: err.url, error: err.error
        });
        return throwError(() => err);
      })
    );
  }

  getLiturgia(date: string): Observable<Liturgia & { letture: Lettura[] }> {
    return this.get<any>('liturgia.php', { date }).pipe(
      map((l: any) => {
        if (!l) {
          return {
            date, season: '', color_key: 'medium', color_label: '—', week: '', rank: '', festa: '', letture: []
          } as any;
        }

        // normalizza letture (array o JSON string)
        let letture: Lettura[] = [];
        const raw = l.letture;
        if (Array.isArray(raw)) {
          letture = raw as Lettura[];
        } else if (typeof raw === 'string') {
          const t = raw.trim();
          if (t.startsWith('[') || t.startsWith('{')) {
            try { letture = JSON.parse(t) as Lettura[]; } catch { /* ignore */ }
          }
        }

        return {
          date: l.date,
          season: l.season,
          color_key: l.color_key,
          color_label: l.color_label,
          week: l.week,
          rank: l.rank,
          festa: l.festa,
          letture
        } as Liturgia & { letture: Lettura[] };
      })
    );
  }

  getSanto(date: string): Observable<Santo | null> {
    return this.get<Santo | null>('santo.php', { date });
  }

  getNatura(date: string): Observable<Natura | null> {
    return this.get<Natura | null>('natura.php', { date });
  }

  getProverbio(date: string): Observable<Proverbio | null> {
    return this.get<Proverbio | null>('proverbio.php', { date });
  }

  getOnomastici(date: string): Observable<Onomastico[] | null> {
    return this.get<Onomastico[] | null>('onomastici.php', { date });
  }
}
