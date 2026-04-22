import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, Clock, ShieldCheck, Activity, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Landing.module.css';

const Landing = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/app/dashboard');
    }
  }, [currentUser, navigate]);
  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.logo}>
            <HeartPulse className={styles.logoIcon} size={28} />
            <span>Cuidado 360</span>
          </div>
          <nav className={styles.nav}>
            <a href="#features">Funcionalidades</a>
            <a href="#benefits">Benefícios</a>
            <a href="#testimonials">Depoimentos</a>
            <Link to="/login" className={styles.loginBtn}>Entrar</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <div className={styles.heroText}>
              <h1>A organização do cuidado que o seu familiar merece.</h1>
              <p>Centralize remédios, consultas e o dia a dia do idoso em um painel único, acolhedor e simples de usar.</p>
              <div className={styles.heroActions}>
                <Link to="/app/dashboard" className={styles.primaryBtn}>
                  Começar Gratuitamente <ArrowRight size={20} />
                </Link>
                <a href="#features" className={styles.secondaryBtn}>Conhecer Plataforma</a>
              </div>
            </div>
            <div className={styles.heroImage}>
              {/* Using a mockup graphic representation instead of raw image */}
              <div className={styles.mockupWindow}>
                <div className={styles.mockupHeader}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
                <div className={styles.mockupBody}>
                  <div className={styles.mockupCard}>
                    <Activity size={24} className={styles.mockupIcon} />
                    <div>
                      <strong>Resumo do Dia</strong>
                      <p>2 medicamentos pendentes</p>
                    </div>
                  </div>
                  <div className={styles.mockupCard}>
                    <Clock size={24} className={styles.mockupIcon} />
                    <div>
                      <strong>Próxima Consulta</strong>
                      <p>Cardiologista - Hoje, 14:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className={styles.benefits}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Por que escolher o Cuidado 360?</h2>
            <div className={styles.grid3}>
              <div className={styles.benefitCard}>
                <div className={styles.iconWrapper}><ShieldCheck size={32} /></div>
                <h3>Segurança</h3>
                <p>Alertas precisos para medicamentos e checklists, evitando esquecimentos e superdosagem.</p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.iconWrapper}><Users size={32} /></div>
                <h3>Acompanhamento Familiar</h3>
                <p>Todos os familiares podem acompanhar a rotina e o bem-estar do idoso à distância.</p>
              </div>
              <div className={styles.benefitCard}>
                <div className={styles.iconWrapper}><Activity size={32} /></div>
                <h3>Histórico de Saúde</h3>
                <p>Registros detalhados de pressão, glicose e humor para apresentar em consultas médicas.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.features}>
          <div className={`container ${styles.featuresContainer}`}>
            <div className={styles.featuresText}>
              <h2>Tudo o que você precisa em um só lugar.</h2>
              <ul className={styles.featureList}>
                <li><CheckCircle2 className={styles.checkIcon} /> <strong>Controle de Remédios:</strong> Alertas e histórico de administração.</li>
                <li><CheckCircle2 className={styles.checkIcon} /> <strong>Agenda Integrada:</strong> Marcações de consultas e exames.</li>
                <li><CheckCircle2 className={styles.checkIcon} /> <strong>Checklist Diário:</strong> Alimentação, banho, hidratação.</li>
                <li><CheckCircle2 className={styles.checkIcon} /> <strong>Diário de Sinais Vitais:</strong> Gráficos de pressão e glicose.</li>
              </ul>
              <Link to="/login" className={styles.btnPrimary}>Começar Gratuitamente</Link>
              <Link to="/login" className={styles.btnSecondary}>Saber Mais</Link>
            </div>
            <div className={styles.featuresImagePlaceholder}>
              <div className={styles.placeholderImg}></div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className={styles.testimonials}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Quem usa, recomenda</h2>
            <div className={styles.grid2}>
              <div className={styles.testimonialCard}>
                <p>"Desde que começamos a usar o Cuidado 360, a nossa família está muito mais tranquila. Consigo ver do trabalho se minha mãe já tomou os remédios do dia."</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>M</div>
                  <div>
                    <strong>Mariana Silva</strong>
                    <span>Filha responsável</span>
                  </div>
                </div>
              </div>
              <div className={styles.testimonialCard}>
                <p>"Como cuidadora particular, o painel facilita muito meu trabalho e passa mais profissionalismo e segurança para as famílias que me contratam."</p>
                <div className={styles.author}>
                  <div className={styles.avatar}>A</div>
                  <div>
                    <strong>Ana Costa</strong>
                    <span>Cuidadora</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.cta}>
          <div className="container">
            <h2>Pronto para melhorar a qualidade do cuidado?</h2>
            <p>Junte-se a milhares de famílias que já simplificaram sua rotina.</p>
            <Link to="/login" className={styles.btnPrimaryLarge}>Criar Conta Gratuita</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <HeartPulse size={24} />
              <span>Cuidado 360</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#">Termos de Uso</a>
              <a href="#">Privacidade</a>
              <a href="#">Contato</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} Cuidado 360. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
