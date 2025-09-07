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
  titolo: string;
  sottotitolo?: string | null;
  snippet?: string | null;
  emoji?: string | null;
  corpo?: string | null;
}

export interface Natura {
  alba?: string | null;
  tramonto?: string | null;
  luna_fase?: string | null;
  luna_emoji?: string | null;
  lavori?: string | null;
  orto?: string | null;
  stagione?: string | null;
}

export interface Proverbio { testo: string; }
export interface Onomastico { nome: string; }
