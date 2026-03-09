import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  createReservation,
  getReservation,
  updateReservation,
} from '../services/reservations.js';
import '../styles/dashboard.css';

const DURATIONS = [30, 60, 90, 120];

export default function ReservationForm() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    court: '',
    date: '',
    time: '',
    duration: 90,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    async function load() {
      try {
        const data = await getReservation(id);
        if (!data || data.userId !== user.id) {
          navigate('/reservations');
          return;
        }
        setForm({
          court: data.court || '',
          date: data.date || '',
          time: data.time || '',
          duration: data.duration || 90,
          notes: data.notes || '',
        });
      } catch {
        setError('No se pudo cargar la reserva.');
      } finally {
        setLoadingData(false);
      }
    }
    load();
  }, [id, isEditing, user.id, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.court || !form.date || !form.time) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updateReservation(id, form);
      } else {
        await createReservation(user.id, form);
      }
      navigate('/reservations');
    } catch (err) {
      setError('Error al guardar la reserva. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );
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
          <Link to="/reservations" className="btn-back">
            ← Volver
          </Link>
          <h2 className="page-title">
            {isEditing ? 'Editar Reserva' : 'Nueva Reserva'}
          </h2>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-card">
          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-group">
              <label htmlFor="court">Pista *</label>
              <input
                id="court"
                name="court"
                type="text"
                value={form.court}
                onChange={handleChange}
                placeholder="Ej: Pista 1 - Club Padel"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Fecha *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="time">Hora *</label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="duration">Duración</label>
              <select
                id="duration"
                name="duration"
                value={form.duration}
                onChange={handleChange}
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d} minutos
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="notes">Notas (opcional)</label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Añade notas adicionales..."
                rows={3}
              />
            </div>
            <div className="form-actions">
              <Link to="/reservations" className="btn-secondary">
                Cancelar
              </Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading
                  ? 'Guardando...'
                  : isEditing
                  ? 'Guardar Cambios'
                  : 'Crear Reserva'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
