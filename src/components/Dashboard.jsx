import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getReservations } from '../services/reservations.js';
import '../styles/dashboard.css';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({ total: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const reservations = await getReservations(user.id);
        const now = new Date();
        const upcoming = reservations.filter((r) => {
          const dateTime = r.time ? `${r.date}T${r.time}` : `${r.date}T23:59`;
          return new Date(dateTime) >= now;
        }).length;
        setStats({ total: reservations.length, upcoming });
      } catch {
        setStats({ total: 0, upcoming: 0 });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [user.id]);

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
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <span className="stat-number">{loading ? '...' : stats.total}</span>
              <span className="stat-label">Total Reservas</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <span className="stat-number">
                {loading ? '...' : stats.upcoming}
              </span>
              <span className="stat-label">Próximas Reservas</span>
            </div>
          </div>
        </section>

        <section className="actions-section">
          <Link to="/reservations/new" className="btn-primary action-btn">
            ➕ Nueva Reserva
          </Link>
          <Link to="/reservations" className="btn-secondary action-btn">
            📋 Ver Mis Reservas
          </Link>
        </section>
      </main>
    </div>
  );
}
