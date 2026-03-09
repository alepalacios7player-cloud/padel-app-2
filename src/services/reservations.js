import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase.js';

const RESERVATIONS_COLLECTION = 'reservations';

export async function getReservations(userId) {
  const q = query(
    collection(db, RESERVATIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('date', 'asc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getReservation(id) {
  const ref = doc(db, RESERVATIONS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createReservation(userId, data) {
  const now = new Date().toISOString();
  const docRef = await addDoc(collection(db, RESERVATIONS_COLLECTION), {
    userId,
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  return { id: docRef.id, userId, ...data };
}

export async function updateReservation(id, data) {
  const ref = doc(db, RESERVATIONS_COLLECTION, id);
  await updateDoc(ref, { ...data, updatedAt: new Date().toISOString() });
}

export async function deleteReservation(id) {
  await deleteDoc(doc(db, RESERVATIONS_COLLECTION, id));
}
