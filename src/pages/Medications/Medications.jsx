import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Modal from '../../components/UI/Modal/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Medications.module.css';

const medSchema = z.object({
  name: z.string().min(2, 'Nome do remédio é obrigatório'),
  dose: z.string().min(1, 'A dose é obrigatória'),
  time: z.string().min(1, 'O horário é obrigatório'),
  notes: z.string().optional()
});

const Medications = () => {
  const { medications, markMedicationDone, addMedication, deleteMedication } = useStore();
  const { userProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(medSchema)
  });

  const onSubmit = (data) => {
    addMedication(data);
    toast.success(`Remédio ${data.name} adicionado com sucesso!`);
    setIsModalOpen(false);
    reset();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Controle de Remédios</h1>
          <p>Gerencie as medicações e registre as doses administradas.</p>
        </div>
        {userProfile?.role === 'admin' && (
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Novo Remédio
          </button>
        )}
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${styles.active}`}>Para Hoje</button>
        <button className={styles.tab}>Todos os Medicamentos</button>
        <button className={styles.tab}>Histórico</button>
      </div>

      <div className={styles.medList}>
        {medications.map(med => (
          <div 
            key={med.id} 
            className={`${styles.medCard} ${
              med.status === 'late' ? styles.medCardAlert : 
              med.status === 'done' ? styles.medCardDone : ''
            }`}
          >
            <div className={styles.medTime}>
              {med.status === 'done' ? <CheckCircle2 size={18} /> : <Clock size={18} />} 
              {med.time}
              {med.status === 'late' && <span className={styles.badgeAlert}>Atrasado</span>}
              {med.status === 'done' && <span className={styles.badgeDone}>Administrado</span>}
            </div>
            
            <div className={styles.medInfo}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3>{med.name}</h3>
                {userProfile?.role === 'admin' && (
                  <button 
                    onClick={() => deleteMedication(med.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                    title="Excluir Remédio"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p>{med.dose}</p>
              {med.notes && <p className={styles.medNotes}>{med.notes}</p>}
            </div>
            
            <div className={styles.medActions}>
              {med.status === 'late' && (
                <button 
                  className={styles.btnRegisterAlert}
                  onClick={() => markMedicationDone(med.id)}
                >
                  Registrar Agora
                </button>
              )}
              {med.status === 'pending' && (
                <button 
                  className={styles.btnRegister}
                  onClick={() => markMedicationDone(med.id)}
                >
                  Marcar como Administrado
                </button>
              )}
              {med.status === 'done' && (
                <span className={styles.doneText}>Registrado por {med.registeredBy} às {med.registeredAt}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Adicionar Novo Remédio">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <label className="formLabel">Nome do Remédio</label>
            <input 
              type="text" 
              className="formInput" 
              placeholder="Ex: Losartana 50mg" 
              {...register('name')}
            />
            {errors.name && <span className="formError">{errors.name.message}</span>}
          </div>
          
          <div className="formGroup">
            <label className="formLabel">Dosagem</label>
            <input 
              type="text" 
              className="formInput" 
              placeholder="Ex: 1 comprimido, 10 gotas" 
              {...register('dose')}
            />
            {errors.dose && <span className="formError">{errors.dose.message}</span>}
          </div>

          <div className="formGroup">
            <label className="formLabel">Horário (Hoje)</label>
            <input 
              type="time" 
              className="formInput" 
              {...register('time')}
            />
            {errors.time && <span className="formError">{errors.time.message}</span>}
          </div>

          <div className="formGroup">
            <label className="formLabel">Observações (Opcional)</label>
            <input 
              type="text" 
              className="formInput" 
              placeholder="Ex: Tomar em jejum, após o almoço..." 
              {...register('notes')}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button 
              type="button" 
              onClick={handleCloseModal}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', fontWeight: 500 }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}
            >
              Salvar Remédio
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Medications;
