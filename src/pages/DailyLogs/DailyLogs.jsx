import React, { useState } from 'react';
import { FileText, Plus, MessageSquare, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Modal from '../../components/UI/Modal/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import styles from './DailyLogs.module.css';
import { useAuth } from '../../contexts/AuthContext';

const logSchema = z.object({
  text: z.string().min(5, 'A anotação deve ter pelo menos 5 caracteres'),
  time: z.string().optional()
});

export default function DailyLogs() {
  const { logs, addLog, deleteLog } = useStore();
  const { currentUser, userProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(logSchema)
  });

  const onSubmit = (data) => {
    addLog({
      text: data.text,
      author: currentUser?.displayName || 'Usuário',
      role: userProfile?.role || 'caregiver',
      ...(data.time && { time: data.time })
    });
    toast.success('Ocorrência registrada!');
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Diário de Ocorrências</h1>
          <p>Registro de eventos diários, observações e repasse de turno.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={20} /> Nova Ocorrência
        </button>
      </div>

      <div className={styles.logsList}>
        {logs.map(log => (
          <div key={log.id} className={styles.logCard}>
            <div className={styles.logHeader}>
              <div className={styles.authorInfo}>
                <div className={styles.avatar}>
                  {log.author.charAt(0)}
                </div>
                <div>
                  <strong>{log.author}</strong>
                  <span className={log.role === 'admin' ? styles.roleAdmin : styles.roleCaregiver}>
                    {log.role === 'admin' ? 'Admin' : 'Cuidador'}
                  </span>
                </div>
              </div>
              <div className={styles.timeInfo} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {log.date} às {log.time}
                {userProfile?.role === 'admin' && (
                  <button 
                    onClick={() => deleteLog(log.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                    title="Excluir Ocorrência"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            <div className={styles.logBody}>
              <p>{log.text}</p>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className={styles.emptyState}>
            <MessageSquare size={48} className={styles.emptyIcon} />
            <p>Nenhuma ocorrência registrada ainda.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Ocorrência">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <label className="formLabel">Descreva o que aconteceu</label>
            <textarea 
              className="formInput" 
              placeholder="Ex: Dona Maria não aceitou a janta hoje..." 
              rows={5}
              {...register('text')}
              style={{ resize: 'vertical' }}
            />
            {errors.text && <span className="formError">{errors.text.message}</span>}
          </div>

          <div className="formGroup">
            <label className="formLabel">Horário da ocorrência (Opcional)</label>
            <input 
              type="time" 
              className="formInput" 
              {...register('time')}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Deixe em branco para usar o horário atual.</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer', fontWeight: 500 }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}
            >
              Registrar Ocorrência
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
