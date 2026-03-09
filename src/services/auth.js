import bcrypt from 'bcryptjs';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase.js';

const USERS_COLLECTION = 'users';
const SESSION_KEY = 'padel_session';

function generateSessionToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function register(name, email, password) {
  const emailLower = email.trim().toLowerCase();

  const q = query(
    collection(db, USERS_COLLECTION),
    where('email', '==', emailLower),
  );
  const existing = await getDocs(q);
  if (!existing.empty) {
    throw new Error('El email ya está registrado.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const userId = doc(collection(db, USERS_COLLECTION)).id;
  const now = new Date().toISOString();

  const userData = {
    id: userId,
    name: name.trim(),
    email: emailLower,
    passwordHash,
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(doc(db, USERS_COLLECTION, userId), userData);

  const token = generateSessionToken();
  const session = { userId, token, email: emailLower, name: name.trim() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { id: userId, name: name.trim(), email: emailLower };
}

export async function login(email, password) {
  const emailLower = email.trim().toLowerCase();

  const q = query(
    collection(db, USERS_COLLECTION),
    where('email', '==', emailLower),
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Email o contraseña incorrectos.');
  }

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data();

  const passwordMatch = await bcrypt.compare(password, userData.passwordHash);
  if (!passwordMatch) {
    throw new Error('Email o contraseña incorrectos.');
  }

  const token = generateSessionToken();
  const session = {
    userId: userData.id,
    token,
    email: userData.email,
    name: userData.name,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));

  return { id: userData.id, name: userData.name, email: userData.email };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getProfile(userId) {
  const ref = doc(db, USERS_COLLECTION, userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const { passwordHash: _ph, ...safeData } = snap.data();
  return safeData;
}
