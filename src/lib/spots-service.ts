import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { SPOTS, type Spot, type SpotBrand, type SpotView } from "./spots";

export type ClaimStatus = "pendiente" | "aprobada" | "rechazada";

export type Claim = {
  id?: string | undefined;
  spotId: number;
  spotName: string;
  spotView: SpotView;
  price: number;
  brandName: string;
  url?: string | undefined;
  email: string;
  whatsapp?: string | undefined;
  status: ClaimStatus;
  createdAt: string;
};

const SPOTS_CACHE_KEY = "brandmymac_spots_v2";
const CLAIMS_CACHE_KEY = "brandmymac_claims_v2";

// Local storage helpers for robust fallback and immediate offline reliability
function getLocalSpots(): Spot[] {
  if (typeof window === "undefined") return SPOTS;
  try {
    const data = localStorage.getItem(SPOTS_CACHE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading local spots:", e);
  }
  return SPOTS;
}

function saveLocalSpots(spots: Spot[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SPOTS_CACHE_KEY, JSON.stringify(spots));
  } catch (e) {
    console.error("Error saving local spots:", e);
  }
}

function getLocalClaims(): Claim[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CLAIMS_CACHE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Error reading local claims:", e);
  }
  return [];
}

function saveLocalClaims(claims: Claim[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CLAIMS_CACHE_KEY, JSON.stringify(claims));
  } catch (e) {
    console.error("Error saving local claims:", e);
  }
}

/**
 * Escucha cambios en tiempo real en los 18 espacios desde Firestore,
 * con sincronización automática y fallback a almacenamiento local.
 */
export function subscribeToSpots(onUpdate: (spots: Spot[]) => void) {
  // Enviar estado inicial inmediato
  const current = getLocalSpots();
  onUpdate(current);

  try {
    const spotsCol = collection(db, "spots");
    const unsub = onSnapshot(
      spotsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const map = new Map<number, Spot>();
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Spot;
            map.set(Number(docSnap.id), data);
          });
          // Asegurar que todos los 18 espacios existen en el orden correcto
          const merged = SPOTS.map((base) => map.get(base.id) || base);
          saveLocalSpots(merged);
          onUpdate(merged);
        } else {
          // Si la colección está vacía en Firestore, inicializarla con los 18 espacios libres
          initializeFirestoreSpots();
        }
      },
      (error) => {
        console.warn("Firestore spots listener warning (using local persistence):", error.message);
        onUpdate(getLocalSpots());
      },
    );
    return unsub;
  } catch (err) {
    console.warn("Could not attach Firestore listener:", err);
    return () => {};
  }
}

/**
 * Inicializa la colección en Firestore con los 18 espacios limpios
 */
export async function initializeFirestoreSpots() {
  try {
    for (const spot of SPOTS) {
      const ref = doc(db, "spots", String(spot.id));
      await setDoc(ref, spot, { merge: true });
    }
  } catch (err) {
    console.warn("Notice: Firestore database initialization will complete once Firestore is enabled:", err);
  }
}

/**
 * Actualiza la información de un espacio (precio, marca, logo, enlace).
 */
export async function updateSpot(spotId: number, data: Partial<Spot>) {
  // Actualizar inmediatamente en local para UX instantánea
  const current = getLocalSpots();
  const updated = current.map((s) => (s.id === spotId ? { ...s, ...data } : s));
  saveLocalSpots(updated);

  // Sincronizar en Firestore
  try {
    const ref = doc(db, "spots", String(spotId));
    await setDoc(ref, { id: spotId, ...data }, { merge: true });
  } catch (err) {
    console.warn("Firestore updateSpot sync:", err);
  }
}

/**
 * Registra una nueva solicitud de compra enviada por un usuario.
 */
export async function createClaim(
  data: Omit<Claim, "id" | "createdAt" | "status">,
): Promise<string> {
  const newClaim: Claim = {
    ...data,
    status: "pendiente",
    createdAt: new Date().toISOString(),
  };

  // Guardar en local
  const currentClaims = getLocalClaims();
  const localId = `local_${Date.now()}`;
  newClaim.id = localId;
  saveLocalClaims([newClaim, ...currentClaims]);

  // Guardar en Firestore
  try {
    const colRef = collection(db, "claims");
    const docRef = await addDoc(colRef, {
      ...data,
      status: "pendiente",
      createdAt: serverTimestamp(),
      createdAtIso: newClaim.createdAt,
    });
    newClaim.id = docRef.id;
    // actualizar el id en local
    saveLocalClaims([newClaim, ...currentClaims]);
    return docRef.id;
  } catch (err) {
    console.warn("Firestore createClaim fallback to local:", err);
    return localId;
  }
}

/**
 * Escucha las solicitudes entrantes para el panel de administración.
 */
export function subscribeToClaims(onUpdate: (claims: Claim[]) => void) {
  onUpdate(getLocalClaims());

  try {
    const claimsCol = collection(db, "claims");
    const q = query(claimsCol, orderBy("createdAtIso", "desc"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const claimsList: Claim[] = [];
        snapshot.forEach((d) => {
          const raw = d.data();
          claimsList.push({
            id: d.id,
            spotId: raw["spotId"] ?? 0,
            spotName: raw["spotName"] ?? "",
            spotView: raw["spotView"] ?? "lid",
            price: raw["price"] ?? 0,
            brandName: raw["brandName"] ?? "",
            url: raw["url"] ?? "",
            email: raw["email"] ?? "",
            whatsapp: raw["whatsapp"] ?? "",
            status: raw["status"] ?? "pendiente",
            createdAt: raw["createdAtIso"] ?? new Date().toISOString(),
          });
        });
        saveLocalClaims(claimsList);
        onUpdate(claimsList);
      },
      (error) => {
        console.warn("Claims listener fallback (using local persistence):", error.message);
        onUpdate(getLocalClaims());
      },
    );
    return unsub;
  } catch (err) {
    console.warn("Could not attach claims listener:", err);
    return () => {};
  }
}

/**
 * Cambia el estado de una solicitud (aprobada / rechazada).
 * Si se aprueba, asigna la marca y el enlace al espacio correspondiente en la MacBook.
 */
export async function updateClaimStatus(
  claimId: string,
  status: ClaimStatus,
  claim?: Claim,
) {
  // Actualizar en local
  const currentClaims = getLocalClaims();
  const updatedClaims = currentClaims.map((c) => (c.id === claimId ? { ...c, status } : c));
  saveLocalClaims(updatedClaims);

  // Si se aprueba, asignar al spot
  if (status === "aprobada" && claim) {
    const brandData: SpotBrand = {
      name: claim.brandName,
      url: claim.url,
      tone: "dark",
    };
    await updateSpot(claim.spotId, { brand: brandData });
  }

  // Sincronizar en Firestore
  try {
    const ref = doc(db, "claims", claimId);
    await updateDoc(ref, { status });
  } catch (err) {
    console.warn("Firestore updateClaimStatus:", err);
  }
}

/**
 * Reinicia la base de datos a cero:
 * Deja todos los 18 espacios 100% libres (brand: null) y elimina marcas de prueba.
 */
export async function resetDatabase() {
  // Limpiar en local
  saveLocalSpots(SPOTS);
  saveLocalClaims([]);

  // Limpiar en Firestore
  try {
    for (const spot of SPOTS) {
      const ref = doc(db, "spots", String(spot.id));
      await setDoc(ref, { ...spot, brand: null });
    }
  } catch (err) {
    console.warn("Firestore resetDatabase sync:", err);
  }
}
