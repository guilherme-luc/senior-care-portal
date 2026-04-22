import React, { useState } from 'react';
import { User, Phone, FileText, AlertTriangle, Pill, Plus, Trash2, Edit2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/UI/Modal/Modal';
import { toast } from 'sonner';
import styles from './PatientProfile.module.css';

const PatientProfile = () => {
  const { patient, updateBasicInfo, addEmergencyContact, removeEmergencyContact, addMedicalItem, removeMedicalItem, updateNotes } = useStore();
  const { userProfile } = useAuth();
  
  const [modalType, setModalType] = useState(null); // 'basic', 'contact', 'medical', 'notes'
  
  // States for forms
  const [basicFormData, setBasicFormData] = useState(patient.basicInfo);
  const [contactData, setContactData] = useState({ name: '', relation: '', phone: '' });
  const [medicalData, setMedicalData] = useState({ type: 'allergies', text: '' });
  const [notesData, setNotesData] = useState(patient.notes);

  const isAdmin = userProfile?.role === 'admin';

  const openModal = (type) => {
    if (type === 'basic') setBasicFormData(patient.basicInfo);
    if (type === 'notes') setNotesData(patient.notes);
    setModalType(type);
  };

  const handleBasicSubmit = (e) => {
    e.preventDefault();
    updateBasicInfo(basicFormData);
    toast.success('Dados pessoais atualizados!');
    setModalType(null);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactData.name && contactData.phone) {
      addEmergencyContact(contactData);
      toast.success('Contato adicionado!');
      setContactData({ name: '', relation: '', phone: '' });
      setModalType(null);
    }
  };

  const handleMedicalSubmit = (e) => {
    e.preventDefault();
    if (medicalData.text) {
      addMedicalItem(medicalData.type, medicalData.text);
      toast.success('Registro adicionado!');
      setMedicalData({ type: 'allergies', text: '' });
      setModalType(null);
    }
  };

  const handleNotesSubmit = (e) => {
    e.preventDefault();
    updateNotes(notesData);
    toast.success('Observações atualizadas!');
    setModalType(null);
  };

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User className={styles.icon} size={24} />
              <h2>Dados Pessoais</h2>
            </div>
            {isAdmin && (
              <button className={styles.editBtn} onClick={() => openModal('basic')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>
                <Edit2 size={16} /> Editar
              </button>
            )}
          </div>
          
          {patient.basicInfo.name ? (
            <>
              <div className={styles.profileHeader} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div className={styles.avatarLarge} style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                  {patient.basicInfo.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.profileNames}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem' }}>{patient.basicInfo.name}</h3>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    {patient.basicInfo.age ? `${patient.basicInfo.age} anos` : 'Idade não informada'} 
                    {patient.basicInfo.birthdate && ` • Nasc: ${patient.basicInfo.birthdate}`}
                  </p>
                </div>
              </div>
              
              <div className={styles.infoList} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className={styles.infoItem} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>CPF</span>
                  <strong>{patient.basicInfo.cpf || 'Não informado'}</strong>
                </div>
                <div className={styles.infoItem} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Plano de Saúde</span>
                  <strong>{patient.basicInfo.healthPlan || 'Não informado'}</strong>
                </div>
                <div className={styles.infoItem} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Endereço</span>
                  <strong style={{ textAlign: 'right', maxWidth: '60%' }}>{patient.basicInfo.address || 'Não informado'}</strong>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <p>Nenhum dado cadastrado.</p>
              {isAdmin && <button onClick={() => openModal('basic')} style={{ marginTop: '12px', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Cadastrar Idoso</button>}
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone className={styles.icon} size={24} />
              <h2>Contatos de Emergência</h2>
            </div>
            {isAdmin && (
              <button onClick={() => openModal('contact')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                <Plus size={20} />
              </button>
            )}
          </div>
          
          <ul className={styles.contactList} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {patient.emergencyContacts.length > 0 ? patient.emergencyContacts.map(contact => (
              <li key={contact.id} className={styles.contactItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-main)', borderRadius: '8px' }}>
                <div className={styles.contactInfo}>
                  <strong style={{ display: 'block' }}>{contact.name} {contact.relation && `(${contact.relation})`}</strong>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{contact.phone}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={`tel:${contact.phone}`} className={styles.callBtn} style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'white', border: '1px solid var(--border-color)', color: 'var(--text-dark)', textDecoration: 'none', fontSize: '0.875rem' }}>Ligar</a>
                  {isAdmin && (
                    <button onClick={() => removeEmergencyContact(contact.id)} style={{ padding: '6px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </li>
            )) : (
              <li style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px 0' }}>Nenhum contato cadastrado.</li>
            )}
          </ul>
        </div>

        {/* Medical Info */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle className={styles.icon} size={24} />
              <h2>Alergias e Condições</h2>
            </div>
            {isAdmin && (
              <button onClick={() => openModal('medical')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                <Plus size={20} />
              </button>
            )}
          </div>
          
          <div className={styles.medicalSection} style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-dark)' }}>Alergias</h3>
            <div className={styles.tags} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {patient.allergies.length > 0 ? patient.allergies.map(item => (
                <span key={item.id} className={styles.tagDanger} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: '16px', fontSize: '0.875rem' }}>
                  {item.text}
                  {isAdmin && <Trash2 size={14} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeMedicalItem('allergies', item.id)} />}
                </span>
              )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nenhuma alergia registrada.</span>}
            </div>
          </div>

          <div className={styles.medicalSection}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--text-dark)' }}>Doenças Crônicas</h3>
            <div className={styles.tags} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {patient.conditions.length > 0 ? patient.conditions.map(item => (
                <span key={item.id} className={styles.tagWarning} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '16px', fontSize: '0.875rem' }}>
                  {item.text}
                  {isAdmin && <Trash2 size={14} style={{ cursor: 'pointer', opacity: 0.7 }} onClick={() => removeMedicalItem('conditions', item.id)} />}
                </span>
              )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nenhuma doença registrada.</span>}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText className={styles.icon} size={24} />
              <h2>Observações Importantes</h2>
            </div>
            {isAdmin && (
              <button onClick={() => openModal('notes')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}>
                <Edit2 size={16} /> Editar
              </button>
            )}
          </div>
          {patient.notes ? (
            <p className={styles.notesText} style={{ lineHeight: 1.6, color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {patient.notes}
            </p>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma observação registrada.</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={modalType === 'basic'} onClose={() => setModalType(null)} title="Editar Dados Pessoais">
        <form onSubmit={handleBasicSubmit}>
          <div className="formGroup">
            <label className="formLabel">Nome Completo</label>
            <input type="text" className="formInput" required value={basicFormData.name} onChange={e => setBasicFormData({...basicFormData, name: e.target.value})} />
          </div>
          <div className="formRow">
            <div className="formGroup">
              <label className="formLabel">Idade</label>
              <input type="text" className="formInput" value={basicFormData.age} onChange={e => setBasicFormData({...basicFormData, age: e.target.value})} />
            </div>
            <div className="formGroup">
              <label className="formLabel">Data de Nasc.</label>
              <input type="text" className="formInput" placeholder="DD/MM/AAAA" value={basicFormData.birthdate} onChange={e => setBasicFormData({...basicFormData, birthdate: e.target.value})} />
            </div>
          </div>
          <div className="formGroup">
            <label className="formLabel">CPF</label>
            <input type="text" className="formInput" value={basicFormData.cpf} onChange={e => setBasicFormData({...basicFormData, cpf: e.target.value})} />
          </div>
          <div className="formGroup">
            <label className="formLabel">Plano de Saúde</label>
            <input type="text" className="formInput" value={basicFormData.healthPlan} onChange={e => setBasicFormData({...basicFormData, healthPlan: e.target.value})} />
          </div>
          <div className="formGroup">
            <label className="formLabel">Endereço</label>
            <input type="text" className="formInput" value={basicFormData.address} onChange={e => setBasicFormData({...basicFormData, address: e.target.value})} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setModalType(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer' }}>Salvar</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'contact'} onClose={() => setModalType(null)} title="Novo Contato">
        <form onSubmit={handleContactSubmit}>
          <div className="formGroup">
            <label className="formLabel">Nome do Contato</label>
            <input type="text" className="formInput" required value={contactData.name} onChange={e => setContactData({...contactData, name: e.target.value})} />
          </div>
          <div className="formGroup">
            <label className="formLabel">Parentesco / Função</label>
            <input type="text" className="formInput" placeholder="Ex: Filho, Médico, Vizinho" value={contactData.relation} onChange={e => setContactData({...contactData, relation: e.target.value})} />
          </div>
          <div className="formGroup">
            <label className="formLabel">Telefone</label>
            <input type="tel" className="formInput" required value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setModalType(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer' }}>Adicionar</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'medical'} onClose={() => setModalType(null)} title="Nova Condição Médica">
        <form onSubmit={handleMedicalSubmit}>
          <div className="formGroup">
            <label className="formLabel">Tipo</label>
            <select className="formSelect" value={medicalData.type} onChange={e => setMedicalData({...medicalData, type: e.target.value})}>
              <option value="allergies">Alergia</option>
              <option value="conditions">Doença Crônica</option>
            </select>
          </div>
          <div className="formGroup">
            <label className="formLabel">Descrição</label>
            <input type="text" className="formInput" required placeholder="Ex: Penicilina, Hipertensão..." value={medicalData.text} onChange={e => setMedicalData({...medicalData, text: e.target.value})} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setModalType(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer' }}>Adicionar</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={modalType === 'notes'} onClose={() => setModalType(null)} title="Editar Observações">
        <form onSubmit={handleNotesSubmit}>
          <div className="formGroup">
            <label className="formLabel">Observações e Preferências da Rotina</label>
            <textarea 
              className="formInput" 
              rows="6" 
              placeholder="Digite detalhes importantes sobre os cuidados..."
              value={notesData} 
              onChange={e => setNotesData(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={() => setModalType(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', cursor: 'pointer' }}>Salvar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientProfile;
