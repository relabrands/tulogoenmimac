export type SpotView = "lid" | "inside";
export type SpotSize = "S" | "M" | "L";

export type SpotBrand = {
  name: string;
  tone?: "dark" | "light" | "outline" | undefined;
  tagline?: string | undefined;
  url?: string | undefined;
  logoUrl?: string | undefined;
};

export type Spot = {
  id: number;
  name: string;
  view: SpotView;
  size: SpotSize;
  dims: string;
  price: number;
  /** Posición en la foto del MacBook, en % del contenedor */
  pos: { x: number; y: number; w: number; h: number };
  brand?: SpotBrand | null | undefined;
};

export const currency = (value: number) =>
  `RD$${value.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`;

export const SPOTS: Spot[] = [
  // ---------- TAPA (LID) ----------
  {
    id: 1,
    name: "Tapa superior izquierda",
    view: "lid",
    size: "L",
    dims: "5.5 × 5.5 cm",
    price: 4200,
    pos: { x: 8, y: 13, w: 24, h: 20 },
    brand: null,
  },
  {
    id: 2,
    name: "Tapa centro superior (sobre el logo)",
    view: "lid",
    size: "L",
    dims: "5.5 × 5.5 cm",
    price: 5600,
    pos: { x: 38, y: 13, w: 24, h: 20 },
    brand: null,
  },
  {
    id: 3,
    name: "Tapa superior derecha",
    view: "lid",
    size: "L",
    dims: "5.5 × 5.5 cm",
    price: 3800,
    pos: { x: 68, y: 13, w: 24, h: 20 },
    brand: null,
  },
  {
    id: 4,
    name: "Tapa media izquierda exterior",
    view: "lid",
    size: "S",
    dims: "3.5 × 3.5 cm",
    price: 1000,
    pos: { x: 8, y: 39, w: 15, h: 18 },
    brand: null,
  },
  {
    id: 5,
    name: "Tapa media izquierda junto al logo",
    view: "lid",
    size: "S",
    dims: "3.5 × 3.5 cm",
    price: 1400,
    pos: { x: 25, y: 39, w: 15, h: 18 },
    brand: null,
  },
  {
    id: 15,
    name: "Tapa media derecha junto al logo",
    view: "lid",
    size: "S",
    dims: "3.5 × 3.5 cm",
    price: 1400,
    pos: { x: 60, y: 39, w: 15, h: 18 },
    brand: null,
  },
  {
    id: 16,
    name: "Tapa media derecha exterior",
    view: "lid",
    size: "S",
    dims: "3.5 × 3.5 cm",
    price: 1200,
    pos: { x: 77, y: 39, w: 15, h: 18 },
    brand: null,
  },
  {
    id: 6,
    name: "Tapa inferior izquierda",
    view: "lid",
    size: "M",
    dims: "5.5 × 4 cm",
    price: 2600,
    pos: { x: 8, y: 63, w: 24, h: 20 },
    brand: null,
  },
  {
    id: 7,
    name: "Tapa centro inferior (debajo del logo)",
    view: "lid",
    size: "M",
    dims: "5.5 × 4 cm",
    price: 3100,
    pos: { x: 38, y: 63, w: 24, h: 20 },
    brand: null,
  },
  {
    id: 8,
    name: "Tapa inferior derecha",
    view: "lid",
    size: "M",
    dims: "5.5 × 4 cm",
    price: 2000,
    pos: { x: 68, y: 63, w: 24, h: 20 },
    brand: null,
  },

  // ---------- INTERIOR (INSIDE - Reposamuñecas) ----------
  {
    id: 9,
    name: "Reposamuñecas izq. — superior exterior",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 1800,
    pos: { x: 9.5, y: 63.0, w: 10, h: 14.5 },
    brand: null,
  },
  {
    id: 10,
    name: "Reposamuñecas izq. — superior interior",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 2400,
    pos: { x: 20.7, y: 63.0, w: 10, h: 14.5 },
    brand: null,
  },
  {
    id: 11,
    name: "Reposamuñecas izq. — inferior exterior",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 1800,
    pos: { x: 9.5, y: 79.5, w: 10, h: 14.5 },
    brand: null,
  },
  {
    id: 12,
    name: "Reposamuñecas izq. — inferior interior",
    view: "inside",
    size: "S",
    dims: "3 × 2 cm",
    price: 1000,
    pos: { x: 20.7, y: 79.5, w: 10, h: 14.5 },
    brand: null,
  },
  {
    id: 13,
    name: "Reposamuñecas der. — superior interior",
    view: "inside",
    size: "S",
    dims: "3 × 2 cm",
    price: 1000,
    pos: { x: 69.3, y: 63.0, w: 10, h: 14.5 },
    brand: null,
  },
  {
    id: 14,
    name: "Reposamuñecas der. — superior exterior",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 2200,
    pos: { x: 80.5, y: 63.0, w: 10, h: 14.5 },
    brand: null,
  },
  {
    id: 17,
    name: "Reposamuñecas der. — inferior interior",
    view: "inside",
    size: "S",
    dims: "3 × 2 cm",
    price: 1000,
    pos: { x: 69.3, y: 79.5, w: 10, h: 14.5 },
    brand: null,
  },
  {
    id: 18,
    name: "Reposamuñecas der. — inferior exterior",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 1800,
    pos: { x: 80.5, y: 79.5, w: 10, h: 14.5 },
    brand: null,
  },
];

export const ACTIVITY = [
  "¡18 espacios listos para tu marca! Asegura tu sticker en la MacBook hoy.",
  "Tu logo viajará en una MacBook Air M5 por eventos, cafés y espacios de coworking.",
  "Espacios disponibles en la tapa exterior y alrededor del teclado desde RD$1,000.",
];

export const GOAL = 40000;
