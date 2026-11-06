export const defaults = {
  product: 'shirt', color: '#EFBD48', isLogoTexture: true, isFullTexture: false,
  logoDecal: './cute_shiba.png', fullDecal: './cute_shiba.png',
  logoPosition: 'center', logoScale: 1, logoOffsetX: 0, logoOffsetY: 0,
};

export function sanitizePersonalization(value) {
  const result = { ...defaults };
  if (!value || typeof value !== 'object') return result;
  for (const key of ['isLogoTexture', 'isFullTexture']) {
    if (typeof value[key] === 'boolean') result[key] = value[key];
  }
  if (['shirt', 'hat'].includes(value.product)) result.product = value.product;
  if (/^#[0-9a-f]{6}$/i.test(value.color)) result.color = value.color;
  if (['center', 'left', 'right'].includes(value.logoPosition)) result.logoPosition = value.logoPosition;
  for (const key of ['logoDecal', 'fullDecal']) {
    if (typeof value[key] === 'string' && (value[key] === defaults[key] ||
      /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(value[key]))) result[key] = value[key];
  }
  for (const [key, min, max] of [['logoScale', 0.5, 1.5], ['logoOffsetX', -0.03, 0.03], ['logoOffsetY', -0.03, 0.03]]) {
    if (Number.isFinite(value[key])) result[key] = Math.max(min, Math.min(max, value[key]));
  }
  return result;
}

let database;
function openDatabase() {
  database ??= new Promise((resolve, reject) => {
    const request = indexedDB.open('customizer', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('designs');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Storage blocked'));
  });
  return database;
}

export async function readPersonalization() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('designs', 'readonly');
    const request = transaction.objectStore('designs').get('current');
    transaction.oncomplete = () => resolve(request.result);
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function writePersonalization(value) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('designs', 'readwrite');
    transaction.objectStore('designs').put(value, 'current');
    transaction.oncomplete = resolve;
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
}
