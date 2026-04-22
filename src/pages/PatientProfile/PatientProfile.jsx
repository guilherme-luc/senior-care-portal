import React from 'react';
import { User, Phone, FileText, AlertTriangle, Pill } from 'lucide-react';
import styles from './PatientProfile.module.css';

const PatientProfile = () => {
  return (
    <div className={styles.profilePage}>
      <div className={styles.pageHeader}>
        <h1>Perfil do Idoso</h1>
        <p>Informações pessoais, contatos e dados médicos.</p>
      </div>

      <div className={styles.contentGrid}>
        {/* Basic Info */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <User className={styles.icon} size={24} />
            <h2>Dados Pessoais</h2>
          </div>
          <div className={styles.profileHeader}>
            <div className={styles.avatarLarge}>MS</div>
            <div className={styles.profileNames}>
              <h3>Maria Silva</h3>
              <p>78 anos • Nasc: 12/05/1945</p>
            </div>
            <button className={styles.editBtn}>Editar</button>
          </div>
          
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <span>CPF</span>
              <strong>123.456.789-00</strong>
            </div>
            <div className={styles.infoItem}>
              <span>Plano de Saúde</span>
              <strong>Unimed - Cartão: 99887766</strong>
            </div>
            <div className={styles.infoItem}>
              <span>Endereço</span>
              <strong>Rua das Flores, 123 - Apto 42</strong>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Phone className={styles.icon} size={24} />
            <h2>Contatos de Emergência</h2>
          </div>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <div className={styles.contactInfo}>
                <strong>Mariana Silva (Filha)</strong>
                <p>(11) 98765-4321</p>
              </div>
              <button className={styles.callBtn}>Ligar</button>
            </li>
            <li className={styles.contactItem}>
              <div className={styles.contactInfo}>
                <strong>Carlos Silva (Filho)</strong>
                <p>(11) 91234-5678</p>
              </div>
              <button className={styles.callBtn}>Ligar</button>
            </li>
            <li className={styles.contactItem}>
              <div className={styles.contactInfo}>
                <strong>Dr. Roberto (Médico)</strong>
                <p>(11) 3333-4444</p>
              </div>
              <button className={styles.callBtn}>Ligar</button>
            </li>
          </ul>
        </div>

        {/* Medical Info */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <AlertTriangle className={styles.icon} size={24} />
            <h2>Alergias e Condições</h2>
          </div>
          
          <div className={styles.medicalSection}>
            <h3>Alergias</h3>
            <div className={styles.tags}>
              <span className={styles.tagDanger}>Penicilina</span>
              <span className={styles.tagDanger}>Frutos do Mar</span>
            </div>
          </div>

          <div className={styles.medicalSection}>
            <h3>Doenças Crônicas</h3>
            <div className={styles.tags}>
              <span className={styles.tagWarning}>Hipertensão</span>
              <span className={styles.tagWarning}>Osteoporose</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FileText className={styles.icon} size={24} />
            <h2>Observações Importantes</h2>
          </div>
          <p className={styles.notesText}>
            Dona Maria tem dificuldade de locomoção e precisa de apoio para entrar no banho. Prefere que a luz do abajur fique acesa à noite. 
            Não gosta de tomar medicamentos dissolvidos em água, prefere o comprimido inteiro.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PatientProfile;
