/**
 * Configuración de Firebase
 *
 * Los datos de la rifa (números, compradores, comprobantes) se guardan en
 * Firestore en vez de localStorage, para que TODOS los dispositivos —el
 * celular del cliente que compra y la computadora del admin que valida—
 * vean la misma información en tiempo real.
 *
 * Necesitas crear un proyecto gratuito en https://console.firebase.google.com
 * y completar las variables VITE_FIREBASE_* en tu archivo .env
 * (ver .env.example para la lista completa e instrucciones).
 */

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingKeys.length === 0;

if (!isFirebaseConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    `⚠️ Faltan variables de entorno de Firebase: ${missingKeys.join(', ')}. ` +
      'Revisa tu archivo .env (ver .env.example) y las variables de entorno en Vercel. ' +
      'Sin esto, la app no puede guardar ni compartir los datos de la rifa.'
  );
}

// Se evita que un initializeApp con configuración incompleta rompa toda
// la app con una pantalla en blanco: si falta algo, `db` queda en null y
// storageService.js lo detecta para mostrar un error claro en pantalla
// en lugar de una excepción no controlada.
let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } catch (error) {
    console.error('Error al inicializar Firebase:', error);
  }
}

export { db };
export default app;
