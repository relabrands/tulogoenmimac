export type SpotView = "lid" | "inside";
export type SpotSize = "S" | "M" | "L";

export type Spot = {
  id: number;
  name: string;
  view: SpotView;
  size: SpotSize;
  dims: string;
  price: number;
  /** Position on the MacBook photo, in % of the photo box */
  pos: { x: number; y: number; w: number; h: number };
  brand?: {
    name: string;
    tone: "dark" | "light" | "outline";
    tagline?: string;
  };
};

export const currency = (value: number) =>
  `RD$${value.toLocaleString("es-DO", { maximumFractionDigits: 0 })}`;

export const SPOTS: Spot[] = [
  // ---------- LID ----------
  {
    id: 1,
    name: "Top left banner",
    view: "lid",
    size: "L",
    dims: "5.5 × 5.5 cm",
    price: 4200,
    pos: { x: 8, y: 13, w: 24, h: 20 },
    brand: { name: "StartupRD", tone: "dark", tagline: "Founders del Caribe" },
  },
  {
    id: 2,
    name: "Marquee — above the logo",
    view: "lid",
    size: "L",
    dims: "5.5 × 5.5 cm",
    price: 5600,
    pos: { x: 38, y: 13, w: 24, h: 20 },
    brand: { name: "see.io", tone: "light", tagline: "Ship faster" },
  },
  {
    id: 3,
    name: "Top right banner",
    view: "lid",
    size: "L",
    dims: "5.5 × 5.5 cm",
    price: 3800,
    pos: { x: 68, y: 13, w: 24, h: 20 },
    brand: { name: "PrivateAlps", tone: "dark" },
  },
  {
    id: 4,
    name: "Mid left — outer",
    view: "lid",
    size: "S",
    dims: "3.5 × 3.5 cm",
    price: 1000,
    pos: { x: 8, y: 39, w: 15, h: 18 },
  },
  {
    id: 5,
    name: "Mid left — beside the logo",
    view: "lid",
    size: "S",
    dims: "3.5 × 3.5 cm",
    price: 1400,
    pos: { x: 25, y: 39, w: 15, h: 18 },
    brand: { name: "Sancocho", tone: "outline", tagline: "El sabor del deploy" },
  },
  {
    id: 15,
    name: "Mid right — beside the logo",
    view: "lid",
    size: "S",
    dims: "3.5 × 3.5 cm",
    price: 1400,
    pos: { x: 60, y: 39, w: 15, h: 18 },
    brand: { name: "ServicePro.do", tone: "dark" },
  },
  {
    id: 16,
    name: "Mid right — outer",
    view: "lid",
    size: "S",
    dims: "3.5 × 3.5 cm",
    price: 1200,
    pos: { x: 77, y: 39, w: 15, h: 18 },
    brand: { name: "plan time", tone: "light" },
  },
  {
    id: 6,
    name: "Bottom left strip",
    view: "lid",
    size: "M",
    dims: "5.5 × 4 cm",
    price: 2600,
    pos: { x: 8, y: 63, w: 24, h: 20 },
    brand: { name: "Colmado.dev", tone: "dark", tagline: "Todo, a la vuelta" },
  },
  {
    id: 7,
    name: "Bottom center — under the logo",
    view: "lid",
    size: "M",
    dims: "5.5 × 4 cm",
    price: 3100,
    pos: { x: 38, y: 63, w: 24, h: 20 },
    brand: { name: "FELYN GO", tone: "light" },
  },
  {
    id: 8,
    name: "Bottom right strip",
    view: "lid",
    size: "M",
    dims: "5.5 × 4 cm",
    price: 2000,
    pos: { x: 68, y: 63, w: 24, h: 20 },
  },
  // ---------- INSIDE (palm rest, around the trackpad) ----------
  {
    id: 9,
    name: "Left palm rest — top outer",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 1800,
    pos: { x: 9.5, y: 63.0, w: 10, h: 14.5 },
    brand: { name: "Sixtyfold", tone: "light" },
  },
  {
    id: 10,
    name: "Left palm rest — top inner",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 2400,
    pos: { x: 20.7, y: 63.0, w: 10, h: 14.5 },
    brand: { name: "Qurso", tone: "outline" },
  },
  {
    id: 11,
    name: "Left palm rest — bottom outer",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 1800,
    pos: { x: 9.5, y: 79.5, w: 10, h: 14.5 },
    brand: { name: "Developer Timeline", tone: "dark" },
  },
  {
    id: 12,
    name: "Left palm rest — bottom inner",
    view: "inside",
    size: "S",
    dims: "3 × 2 cm",
    price: 1000,
    pos: { x: 20.7, y: 79.5, w: 10, h: 14.5 },
  },
  {
    id: 13,
    name: "Right palm rest — top inner",
    view: "inside",
    size: "S",
    dims: "3 × 2 cm",
    price: 1000,
    pos: { x: 69.3, y: 63.0, w: 10, h: 14.5 },
  },
  {
    id: 14,
    name: "Right palm rest — top outer",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 2200,
    pos: { x: 80.5, y: 63.0, w: 10, h: 14.5 },
    brand: { name: "Product Mafia", tone: "dark" },
  },
  {
    id: 17,
    name: "Right palm rest — bottom inner",
    view: "inside",
    size: "S",
    dims: "3 × 2 cm",
    price: 1000,
    pos: { x: 69.3, y: 79.5, w: 10, h: 14.5 },
  },
  {
    id: 18,
    name: "Right palm rest — bottom outer",
    view: "inside",
    size: "M",
    dims: "4 × 3 cm",
    price: 1800,
    pos: { x: 80.5, y: 79.5, w: 10, h: 14.5 },
    brand: { name: "Botpool", tone: "outline" },
  },
];

export const ACTIVITY = [
  "StartupRD took the top-left lid spot for RD$4,200 — 2h ago",
  "see.io claimed the marquee above the logo for RD$5,600 — 5h ago",
  "Colmado.dev grabbed the bottom left strip for RD$2,600 — 9h ago",
  "Botpool sponsored the right palm rest for RD$1,800 — 14h ago",
  "Sancocho took an inner lid spot for RD$1,400 — yesterday",
  "ServicePro.do claimed a spot beside the logo for RD$1,400 — yesterday",
];

export const GOAL = 40000;
