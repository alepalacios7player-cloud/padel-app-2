import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getReservations, deleteReservation } from '../services/reservations.js';
import '../styles/dashboard.css';

export default function PadelReservations() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    setLoading(true);
    setError('');
    try {
      const data = await getReservations(user.id);
      setReservations(data);
    } catch (err) {
      setError('Error al cargar las reservas. Verifica tu conexión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      return;
    }
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError('Error al eliminar la reserva.');
      console.error(err);
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function formatTime(timeStr) {
    if (!timeStr) return '-';
    return timeStr;
  }

  function isUpcoming(dateStr, timeStr) {
    if (!dateStr) return false;
    const dateTime = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T23:59`;
    return new Date(dateTime) >= new Date();
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-brand">
          <span className="header-logo">🎾</span>
          <h1>Padel App</h1>
        </div>
        <div className="header-user">
          <span className="user-greeting">Hola, {user.name}</span>
          <button className="btn-logout" onClick={signOut}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="page-header">
          <Link to="/dashboard" className="btn-back">
            ← Volver
          </Link>
          <h2 className="page-title">Mis Reservas</h2>
          <Link to="/reservations/new" className="btn-primary">
            ➕ Nueva
          </Link>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
          </div>
        ) : reservations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏟️</div>
            <h3>No tienes reservas aún</h3>
            <p>¡Crea tu primera reserva de pádel!</p>
            <Link to="/reservations/new" className="btn-primary">
              Crear Reserva
            </Link>
          </div>
        ) : (
          <ul className="reservations-list">
            {reservations.map((r) => (
              <li
                key={r.id}
                className={`reservation-card ${isUpcoming(r.date, r.time) ? 'upcoming' : 'past'}`}
              >
                <div className="reservation-info">
                  <h3 className="reservation-court">{r.court || 'Pista sin nombre'}</h3>
                  <p className="reservation-date">{formatDate(r.date)}</p>
                  <p className="reservation-time">
                    🕐 {formatTime(r.time)}
                    {r.duration && ` · ${r.duration} min`}
                  </p>
                  {r.notes && (
                    <p className="reservation-notes">📝 {r.notes}</p>
                  )}
                  <span className={`reservation-badge ${isUpcoming(r.date, r.time) ? 'badge-upcoming' : 'badge-past'}`}>
                    {isUpcoming(r.date, r.time) ? 'Próxima' : 'Pasada'}
                  </span>
                </div>
                <div className="reservation-actions">
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/reservations/edit/${r.id}`)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(r.id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
