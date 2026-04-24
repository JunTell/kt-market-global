export interface Review {
  id: string;
  name: string;
  country_code: string;  // ISO 3166-1 alpha-2
  country_label: string;
  rating: 1 | 2 | 3 | 4 | 5;
  model: string;
  date: string;          // ISO yyyy-mm-dd
  body: string;
}

export interface FAQItem {
  id: string;
  q: string;
  a: string;
}

export interface TrustStat {
  id: string;
  label: string;
  value: string;
}

export interface WhyCheapItem {
  label: string;
  value: string;
  note: string;
}
