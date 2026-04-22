import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { 
  HeartPulse, LayoutDashboard, UserCircle, Pill, 
  Calendar, CheckSquare, Activity, LogOut, Bell, Settings as SettingsIcon, MessageSquare, Menu, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import styles from './DashboardLayout.module.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { requestPermission } = usePushNotifications();
  const { currentUser, userProfile, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao sair', error);
    }
  };

  return (
    <div className={styles.layout}>
      {/* Mobile Overlay */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse className={styles.logoIcon} size={28} />
            <span>Cuidado 360</span>
          </div>
          <button className={styles.closeMenuBtn} onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className={styles.sidebarNav}>
          <div className={styles.navGroup}>
            <p className={styles.navTitle}>Menu Principal</p>
            <NavLink to="/app/dashboard" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink to="/app/profile" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              <UserCircle size={20} /> Perfil do Idoso
            </NavLink>
          </div>
          
          <div className={styles.navGroup}>
            <p className={styles.navTitle}>Cuidados</p>
            <NavLink to="/app/medications" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              <Pill size={20} /> Remédios
            </NavLink>
            <NavLink to="/app/appointments" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              <Calendar size={20} /> Consultas
            </NavLink>
            <NavLink to="/app/checklist" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
              <CheckSquare size={20} /> Checklist Diário
            </NavLink>
            <NavLink to="/app/logs" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem} onClick={() => setSidebarOpen(false)}>
              <MessageSquare size={20} /> Ocorrências
            </NavLink>
            <NavLink to="/app/health" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem} onClick={() => setSidebarOpen(false)}>
              <Activity size={20} /> Saúde
            </NavLink>
            {userProfile?.role === 'admin' && (
              <NavLink to="/app/settings" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem} onClick={() => setSidebarOpen(false)}>
                <SettingsIcon size={20} /> Configurações
              </NavLink>
            )}
          </div>
        </nav>
        
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainArea}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button className={styles.menuToggleBtn} onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.iconBtn} onClick={requestPermission} title="Ativar Notificações">
              <Bell size={20} />
              <span className={styles.badge}>3</span>
            </button>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className={styles.userInfo}>
                <strong>{currentUser?.displayName || 'Usuário'}</strong>
                <span>{userProfile?.role === 'admin' ? 'Responsável' : 'Cuidador'}</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
