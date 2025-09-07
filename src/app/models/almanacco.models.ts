export interface Lettura {
  id: string;
  tipo: string;         // PRIMA LETTURA | SALMO | VANGELO, ecc.
  riferimento: string;  // es. "Lc 6,1-5"
  snippet?: string;
  testo?: string;
}

export type LiturgicalColorKey = 'success'|'danger'|'tertiary'|'warning'|'light'|'medium'|''; // da tabella
export interface Liturgia {
  id: number;
  date: string;            // "YYYY-MM-DD"
  season: string;
  color_key: LiturgicalColorKey; // mappato su ion-color
  color_label: string;     // es. "VERDE"
  week?: string | null;
  rank?: string | null;
  festa?: string | null;
  letture: Lettura[] | string; // può arrivare come string JSON
}

export interface Santo {
  id: number;
  titolo: string;
  sottotitolo?: string;
  emoji?: string;
  snippet?: string;
  corpo?: string;
  patronato?: string;
}

// src/app/models/almanacco.models.ts
export interface Natura {
  date: string;
  orto?: string | null;
  giardino?: string | null;
  piante?: string | null;
  cucina?: string | null;
  consiglio?: string | null;
  fase_lunare?: string | null;   // come arriva dal DB
  lunaEmoji?: string | null;     // calcolato (opzionale)
  lunaFase?: string | null;      // alias comodo per fase_lunare
  alba?: string | null;
  tramonto?: string | null;
  testo?: string | null;         // SOLO per la pagina dettaglio
}





export interface Proverbio { testo: string; }
export interface Onomastico { nome: string; }

