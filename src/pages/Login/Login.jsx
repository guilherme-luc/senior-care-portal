import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { HeartPulse } from 'lucide-react';
import styles from './Login.module.css';
import { toast } from 'sonner';

export default function Login() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [role, setRole] = useState('admin');
  const [familyId, setFamilyId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!isLoginView && password !== confirmPassword) {
      return toast.error('As senhas não coincidem!');
    }

    try {
      setLoading(true);
      if (isLoginView) {
        await login(email, password);
        toast.success('Login realizado com sucesso!');
      } else {
        if (!name.trim()) return toast.error('Preencha seu nome completo!');
        if (role === 'caregiver' && !familyId.trim()) return toast.error('Informe o Código de Vinculação!');
        await signup(email, password, name, role, familyId);
        toast.success('Conta criada com sucesso!');
      }
      navigate('/app');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Este e-mail já está em uso.');
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        toast.error('E-mail ou senha incorretos.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('A senha deve ter pelo menos 6 caracteres.');
      } else {
        toast.error(`Falha na autenticação: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.brand}>
          <div className={styles.logoWrapper}>
            <HeartPulse size={28} />
          </div>
          <h1>{isLoginView ? 'Cuidado 360' : 'Criar Nova Conta'}</h1>
          <p>{isLoginView ? 'Acesse o painel de cuidados do seu ente querido.' : 'Cadastre-se para organizar a rotina de cuidados.'}</p>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tabBtn} ${isLoginView ? styles.activeTab : ''}`}
            onClick={() => setIsLoginView(true)}
            type="button"
          >
            Entrar
          </button>
          <button 
            className={`${styles.tabBtn} ${!isLoginView ? styles.activeTab : ''}`}
            onClick={() => setIsLoginView(false)}
            type="button"
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLoginView && (
            <div className={styles.roleSelector} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${role === 'admin' ? 'var(--primary)' : 'var(--border-color)'}`, backgroundColor: role === 'admin' ? 'var(--primary-light)' : 'transparent', fontWeight: role === 'admin' ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setRole('admin')}
              >
                Sou Responsável
              </button>
              <button
                type="button"
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${role === 'caregiver' ? 'var(--primary)' : 'var(--border-color)'}`, backgroundColor: role === 'caregiver' ? 'var(--primary-light)' : 'transparent', fontWeight: role === 'caregiver' ? 'bold' : 'normal', cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => setRole('caregiver')}
              >
                Sou Cuidador(a)
              </button>
            </div>
          )}

          {!isLoginView && (
            <div className="formGroup">
              <label className="formLabel">Nome Completo</label>
              <input 
                type="text" 
                className="formInput" 
                required={!isLoginView} 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
          )}
          
          {!isLoginView && role === 'caregiver' && (
            <div className="formGroup">
              <label className="formLabel">Código de Vinculação</label>
              <input 
                type="text" 
                className="formInput" 
                required 
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value)}
                placeholder="Ex: FAM-1234-ABC"
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Solicite este código ao Responsável familiar.</span>
            </div>
          )}

          <div className="formGroup">
            <label className="formLabel">E-mail</label>
            <input 
              type="email" 
              className="formInput" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
            />
          </div>
          <div className="formGroup">
            <label className="formLabel">Senha</label>
            <input 
              type="password" 
              className="formInput" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          {!isLoginView && (
            <div className="formGroup">
              <label className="formLabel">Confirmar Senha</label>
              <input 
                type="password" 
                className="formInput" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength="6"
              />
            </div>
          )}

          <button disabled={loading} className={styles.loginBtn} type="submit">
            {loading ? 'Aguarde...' : (isLoginView ? 'Entrar no Portal' : 'Criar Conta e Entrar')}
          </button>
        </form>
        
        <div className={styles.footer}>
          <Link to="/">Voltar para a página inicial</Link>
        </div>
      </div>
    </div>
  );
}
