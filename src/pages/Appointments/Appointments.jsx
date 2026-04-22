import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, MapPin, Stethoscope, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Modal from '../../components/UI/Modal/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Appointments.module.css';

const appointmentSchema = z.object({
  doctor: z.string().min(3, 'Especialidade/Médico é obrigatório'),
  date: z.string().min(1, 'A data é obrigatória'),
  time: z.string().min(1, 'O horário é obrigatório'),
  location: z.string().min(3, 'O local é obrigatório'),
  notes: z.string().optional()
});

const Appointments = () => {
  const { appointments, addAppointment, deleteAppointment } = useStore();
  const { userProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('upcoming');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(appointmentSchema)
  });

  const onSubmit = (data) => {
    addAppointment(data);
    toast.success('Consulta agendada com sucesso!');
    setIsModalOpen(false);
    reset();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const sortedAppointments = [...appointments].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const formatMonth = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();
  };
  
  const formatDay = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').getDate().toString().padStart(2, '0');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Agenda de Consultas</h1>
          <p>Acompanhe e agende consultas médicas e exames.</p>
        </div>
        {userProfile?.role === 'admin' && (
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Nova Consulta
          </button>
        )}
      </div>

      <div className={styles.viewToggle}>
        <button 
          className={`${styles.toggleBtn} ${view === 'upcoming' ? styles.active : ''}`}
          onClick={() => setView('upcoming')}
        >
          Próximas
        </button>
        <button 
          className={`${styles.toggleBtn} ${view === 'history' ? styles.active : ''}`}
          onClick={() => setView('history')}
        >
          Histórico
        </button>
      </div>

      <div className={styles.appointmentsList}>
        {sortedAppointments.length > 0 ? sortedAppointments.map(app => (
          <div key={app.id} className={styles.appointmentCard}>
            <div className={styles.dateCol}>
              <span className={styles.month}>{formatMonth(app.date)}</span>
              <span className={styles.day}>{formatDay(app.date)}</span>
              <span className={styles.time}>{app.time}</span>
            </div>
            <div className={styles.detailsCol}>
              <div className={styles.headerRow}>
                <h3>{app.doctor}</h3>
                <span className={styles.statusBadgePending}>Agendado</span>
              </div>
              {app.notes && (
                <div className={styles.infoRow}>
                  <Stethoscope size={16} /> {app.notes}
                </div>
              )}
              <div className={styles.infoRow}>
                <MapPin size={16} /> {app.location}
              </div>
            </div>
            {userProfile?.role === 'admin' && (
              <div className={styles.actionCol}>
                <button 
                  className={styles.btnOutlineDanger}
                  onClick={() => {
                    deleteAppointment(app.id);
                    toast.info('Consulta cancelada.');
                  }}
                >
                  <Trash2 size={16} /> Cancelar
                </button>
              </div>
            )}
          </div>
        )) : (
          <p style={{ color: 'var(--text-muted)' }}>Nenhuma consulta agendada.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Agendar Consulta">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <label className="formLabel">Médico ou Especialidade</label>
            <input 
              type="text" 
              className="formInput" 
              placeholder="Ex: Cardiologista - Dr. Roberto" 
              {...register('doctor')}
            />
            {errors.doctor && <span className="formError">{errors.doctor.message}</span>}
          </div>
          
          <div className="formRow">
            <div className="formGroup">
              <label className="formLabel">Data</label>
              <input 
                type="date" 
                className="formInput" 
                {...register('date')}
              />
              {errors.date && <span className="formError">{errors.date.message}</span>}
            </div>
            <div className="formGroup">
              <label className="formLabel">Horário</label>
              <input 
                type="time" 
                className="formInput" 
                {...register('time')}
              />
              {errors.time && <span className="formError">{errors.time.message}</span>}
            </div>
          </div>

          <div className="formGroup">
            <label className="formLabel">Local (Clínica/Hospital)</label>
            <input 
              type="text" 
              className="formInput" 
              placeholder="Ex: Clínica Vida Saudável" 
              {...register('location')}
            />
            {errors.location && <span className="formError">{errors.location.message}</span>}
          </div>

          <div className="formGroup">
            <label className="formLabel">Observações (Opcional)</label>
            <input 
              type="text" 
              className="formInput" 
              placeholder="Ex: Levar exames de sangue anteriores" 
              {...register('notes')}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button 
              type="button" 
              onClick={handleCloseModal}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', fontWeight: 500 }}
            >
              Voltar
            </button>
            <button 
              type="submit"
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}
            >
              Confirmar Agendamento
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
