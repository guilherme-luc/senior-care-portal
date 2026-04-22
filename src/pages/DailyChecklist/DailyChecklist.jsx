import React, { useState } from 'react';
import { Plus, Clock, Trash2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Modal from '../../components/UI/Modal/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import styles from './DailyChecklist.module.css';

const taskSchema = z.object({
  title: z.string().min(2, 'O título da tarefa é obrigatório'),
  time: z.string().min(1, 'O horário é obrigatório'),
  period: z.enum(['morning', 'afternoon', 'evening'], { required_error: 'Selecione um período' })
});

const DailyChecklist = () => {
  const { checklist, toggleChecklist, addChecklistTask, deleteTask } = useStore();
  const { userProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('today');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { period: 'morning' }
  });

  const onSubmit = (data) => {
    addChecklistTask(data);
    toast.success('Tarefa adicionada com sucesso!');
    setIsModalOpen(false);
    reset();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const displayChecklist = filterDate === 'today' ? checklist : [];

  const morningTasks = displayChecklist.filter(t => t.period === 'morning').sort((a,b) => a.time.localeCompare(b.time));
  const afternoonTasks = displayChecklist.filter(t => t.period === 'afternoon').sort((a,b) => a.time.localeCompare(b.time));
  const eveningTasks = displayChecklist.filter(t => t.period === 'evening').sort((a,b) => a.time.localeCompare(b.time));

  const completedCount = displayChecklist.filter(t => t.completed).length;
  const totalCount = displayChecklist.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const renderTasks = (tasks) => (
    <div className={styles.card}>
      {tasks.length > 0 ? tasks.map(task => (
        <label key={task.id} className={styles.checkItem}>
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={() => toggleChecklist(task.id)} 
          />
          <div className={styles.checkContent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <span className={styles.checkTitle}>{task.title}</span>
              <span className={styles.checkMeta}>
                {task.time} {task.meta && `• ${task.meta}`}
              </span>
            </div>
            {userProfile?.role === 'admin' && (
              <button 
                onClick={(e) => { e.preventDefault(); deleteTask(task.id); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                title="Excluir Tarefa"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </label>
      )) : (
        <p style={{ padding: 'var(--spacing-lg)', color: 'var(--text-muted)' }}>Nenhuma tarefa para este período.</p>
      )}
    </div>
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Checklist Diário</h1>
          <p>Tarefas de rotina, higiene e alimentação.</p>
        </div>
        {userProfile?.role === 'admin' && (
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Nova Tarefa
          </button>
        )}
      </div>

      <div className={styles.dateSelector}>
        <button 
          className={`${styles.dateBtnOutline} ${filterDate === 'yesterday' ? styles.active : ''}`}
          onClick={() => setFilterDate('yesterday')}
          style={filterDate === 'yesterday' ? { backgroundColor: 'var(--primary)', color: 'white' } : {}}
        >
          Ontem
        </button>
        <div className={styles.currentDate} style={{ cursor: 'pointer' }} onClick={() => setFilterDate('today')}>
          Hoje, {new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: 'long'})}
        </div>
        <button 
          className={`${styles.dateBtnOutline} ${filterDate === 'tomorrow' ? styles.active : ''}`}
          onClick={() => setFilterDate('tomorrow')}
          style={filterDate === 'tomorrow' ? { backgroundColor: 'var(--primary)', color: 'white' } : {}}
        >
          Amanhã
        </button>
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressHeader}>
          <span>Progresso Diário</span>
          <strong>{progressPercent}% ({completedCount}/{totalCount} tarefas)</strong>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className={styles.checklistGrid}>
        <div className={styles.timeSection}>
          <div className={styles.timeHeader}>
            <Clock size={20} />
            <h2>Manhã</h2>
          </div>
          {renderTasks(morningTasks)}
        </div>

        <div className={styles.timeSection}>
          <div className={styles.timeHeader}>
            <Clock size={20} />
            <h2>Tarde</h2>
          </div>
          {renderTasks(afternoonTasks)}
        </div>

        <div className={styles.timeSection}>
          <div className={styles.timeHeader}>
            <Clock size={20} />
            <h2>Noite</h2>
          </div>
          {renderTasks(eveningTasks)}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Adicionar Nova Tarefa">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <label className="formLabel">O que precisa ser feito?</label>
            <input 
              type="text" 
              className="formInput" 
              placeholder="Ex: Dar banho, Caminhada leve" 
              {...register('title')}
            />
            {errors.title && <span className="formError">{errors.title.message}</span>}
          </div>
          
          <div className="formGroup">
            <label className="formLabel">Horário Previsto</label>
            <input 
              type="time" 
              className="formInput" 
              {...register('time')}
            />
            {errors.time && <span className="formError">{errors.time.message}</span>}
          </div>

          <div className="formGroup">
            <label className="formLabel">Período do Dia</label>
            <select className="formSelect" {...register('period')}>
              <option value="morning">Manhã (06:00 - 12:00)</option>
              <option value="afternoon">Tarde (12:00 - 18:00)</option>
              <option value="evening">Noite (18:00 - 23:59)</option>
            </select>
            {errors.period && <span className="formError">{errors.period.message}</span>}
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
              Adicionar Tarefa
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DailyChecklist;
