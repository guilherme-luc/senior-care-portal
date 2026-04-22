import React from 'react';
import { Pill, Calendar, CheckSquare, AlertCircle, HeartPulse, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { patient, medications, checklist, markMedicationDone, toggleChecklist } = useStore();

  const completedChecklistCount = checklist.filter(t => t.completed).length;
  const totalChecklistCount = checklist.length;

  const administeredMedsCount = medications.filter(m => m.status === 'done').length;
  const totalMedsCount = medications.length;

  const lateMed = medications.find(m => m.status === 'late');
  const pendingMeds = medications.filter(m => m.status === 'pending' || m.status === 'late').slice(0, 3);
  const pendingChecklist = checklist.filter(t => !t.completed).slice(0, 4);

  return (
    <div className={styles.dashboard}>
      <div className={styles.pageHeader}>
        <h1>Resumo do Dia</h1>
        <p>Acompanhamento diário de <strong>Dona {patient.name}</strong>, {patient.age} anos.</p>
      </div>

      <div className={styles.gridContainer}>
        {/* Alerts and Priority */}
        {lateMed ? (
          <div className={`${styles.card} ${styles.alertCard}`}>
            <div className={styles.cardHeader}>
              <AlertCircle className={styles.alertIcon} size={24} />
              <h2>Atenção Necessária</h2>
            </div>
            <div className={styles.cardBody}>
              <p>O remédio <strong>{lateMed.name}</strong> está atrasado.</p>
              <button 
                className={styles.btnDanger}
                onClick={() => markMedicationDone(lateMed.id)}
              >
                Registrar Agora
              </button>
            </div>
          </div>
        ) : (
          <div className={`${styles.card}`} style={{ backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className={styles.cardHeader} style={{ color: 'var(--primary-dark)' }}>
              <HeartPulse className={styles.alertIcon} size={24} />
              <h2>Tudo em ordem!</h2>
            </div>
            <div className={styles.cardBody}>
              <p style={{ color: 'var(--text-main)' }}>Não há pendências urgentes para agora.</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Pill size={24} /></div>
            <div className={styles.statInfo}>
              <h3>Remédios</h3>
              <p>{administeredMedsCount}/{totalMedsCount} administrados</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><CheckSquare size={24} /></div>
            <div className={styles.statInfo}>
              <h3>Checklist</h3>
              <p>{completedChecklistCount}/{totalChecklistCount} tarefas</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><HeartPulse size={24} /></div>
            <div className={styles.statInfo}>
              <h3>Pressão</h3>
              <p>118/78 (Normal)</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Calendar size={24} /></div>
            <div className={styles.statInfo}>
              <h3>Consulta</h3>
              <p>Dia 24/04</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Upcoming Medications */}
        <div className={styles.card}>
          <div className={styles.cardHeaderFlex}>
            <h2>Próximos Remédios</h2>
            <Link to="/app/medications" className={styles.viewAllBtn}>Ver todos</Link>
          </div>
          {pendingMeds.length > 0 ? (
            <ul className={styles.list}>
              {pendingMeds.map(med => (
                <li key={med.id} className={styles.listItem}>
                  <div className={styles.timeTag}>{med.time}</div>
                  <div className={styles.itemContent}>
                    <strong>{med.name}</strong>
                    <span>{med.dose}</span>
                  </div>
                  <button 
                    className={styles.btnCheck}
                    onClick={() => markMedicationDone(med.id)}
                  >
                    Marcar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Nenhum remédio pendente no momento.</p>
          )}
        </div>

        {/* Checklist Pendente */}
        <div className={styles.card}>
          <div className={styles.cardHeaderFlex}>
            <h2>Checklist Pendente</h2>
            <Link to="/app/checklist" className={styles.viewAllBtn}>Ver checklist</Link>
          </div>
          {pendingChecklist.length > 0 ? (
            <ul className={styles.checklist}>
              {pendingChecklist.map(task => (
                <li key={task.id}>
                  <label className={styles.checkLabel}>
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => toggleChecklist(task.id)}
                    />
                    <span className={styles.checkText}>{task.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          ) : (
             <p style={{ color: 'var(--text-muted)' }}>Todas as tarefas concluídas!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
