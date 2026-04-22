import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, UserPlus, Copy, ShieldCheck, User } from 'lucide-react';
import styles from './Settings.module.css';
import Modal from '../../components/UI/Modal/Modal';
import { toast } from 'sonner';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';

export default function Settings() {
  const { familyMembers, addFamilyMember } = useStore();
  const { currentUser, userProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const familyId = userProfile?.familyId || "Gerando...";

  if (userProfile?.role === 'caregiver') {
    return (
      <div className={styles.pageContainer} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <ShieldCheck size={64} style={{ color: 'var(--danger)', margin: '0 auto 16px' }} />
          <h2>Acesso Negado</h2>
          <p style={{ color: 'var(--text-muted)' }}>Apenas o Responsável pela família pode acessar as configurações.</p>
        </div>
      </div>
    );
  }

  const handleInvite = (e) => {
    e.preventDefault();
    if(email && name) {
      addFamilyMember({ name, email, role: 'caregiver' });
      toast.success(`Convite simulado e enviado para ${email}`);
      setIsModalOpen(false);
      setEmail('');
      setName('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(familyId);
    toast.success('ID da Família copiado!');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Configurações e Acessos</h1>
          <p>Gerencie quem tem acesso ao painel de cuidados.</p>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>Identificação da Família</h2>
            <SettingsIcon size={20} className={styles.iconMuted} />
          </div>
          <div className={styles.cardBody}>
            <p className={styles.label}>ID Único da Família</p>
            <div className={styles.idBox}>
              <code>{familyId}</code>
              <button onClick={copyToClipboard} className={styles.iconBtn} title="Copiar ID">
                <Copy size={18} />
              </button>
            </div>
            <p className={styles.helpText}>
              Este é o código exclusivo do painel do seu ente querido. Os cuidadores precisarão deste código caso se cadastrem sozinhos.
            </p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.titleWithIcon}>
              <Users size={20} className={styles.iconPrimary} />
              <h2>Membros e Cuidadores</h2>
            </div>
            <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
              <UserPlus size={18} /> Convidar
            </button>
          </div>
          <div className={styles.membersList}>
            {familyMembers.map(member => (
              <div key={member.id} className={styles.memberItem}>
                <div className={styles.memberAvatar}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.memberInfo}>
                  <p className={styles.memberName}>{member.id === 1 && currentUser?.displayName ? currentUser.displayName : member.name}</p>
                  <p className={styles.memberEmail}>{member.id === 1 && currentUser?.email ? currentUser.email : member.email}</p>
                </div>
                <div className={styles.memberRole}>
                  {member.role === 'admin' ? (
                    <span className={styles.badgeAdmin}><ShieldCheck size={14} /> Admin</span>
                  ) : (
                    <span className={styles.badgeCaregiver}><User size={14} /> Cuidador</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Convidar Cuidador">
        <form onSubmit={handleInvite}>
          <div className="formGroup">
            <label className="formLabel">Nome do Cuidador</label>
            <input 
              type="text" 
              className="formInput" 
              placeholder="Ex: Ana Souza" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label className="formLabel">E-mail do Cuidador</label>
            <input 
              type="email" 
              className="formInput" 
              placeholder="Digite o e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="formError" style={{ color: 'var(--text-muted)' }}>
              Um e-mail será enviado com um Link Mágico contendo o acesso à esta família.
            </p>
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
              Enviar Convite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
