import React, { useRef, useState } from 'react';
import { Plus, HeartPulse, Activity, Droplet, Scale, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../contexts/AuthContext';
import Modal from '../../components/UI/Modal/Modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import styles from './HealthRecords.module.css';

const recordSchema = z.object({
  type: z.enum(['bp', 'glucose'], { required_error: 'Selecione o tipo de medição' }),
  sistolica: z.string().optional(),
  diastolica: z.string().optional(),
  valor: z.string().optional()
}).refine(data => {
  if (data.type === 'bp') return !!data.sistolica && !!data.diastolica;
  if (data.type === 'glucose') return !!data.valor;
  return true;
}, { message: 'Preencha os valores da medição', path: ['type'] });

const HealthRecords = () => {
  const { healthRecords, addHealthRecord } = useStore();
  const { userProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metricType, setMetricType] = useState('bp');
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(recordSchema),
    defaultValues: { type: 'bp' }
  });

  const selectedType = watch('type');
  const reportRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = async () => {
    try {
      setIsExporting(true);
      toast.info('Gerando relatório... Isso pode levar alguns segundos.');
      
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#f8fafc',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Relatorio_Saude_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
      
      toast.success('Relatório baixado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório.');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const onSubmit = (data) => {
    const record = { type: data.type };
    if (data.type === 'bp') {
      record.sistolica = Number(data.sistolica);
      record.diastolica = Number(data.diastolica);
    } else {
      record.valor = Number(data.valor);
    }
    addHealthRecord(record);
    toast.success('Registro adicionado com sucesso!');
    setIsModalOpen(false);
    reset();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const bpData = healthRecords.filter(r => r.type === 'bp').slice(-10);
  const glucoseData = healthRecords.filter(r => r.type === 'glucose').slice(-10);
  
  const lastBp = bpData[bpData.length - 1];
  const lastGlucose = glucoseData[glucoseData.length - 1];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Registros de Saúde</h1>
          <p>Acompanhamento de sinais vitais e histórico métrico.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={styles.addBtn} 
            style={{ backgroundColor: 'white', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
            onClick={exportPDF}
            disabled={isExporting}
          >
            <Download size={20} /> {isExporting ? 'Gerando...' : 'Baixar PDF'}
          </button>
          {userProfile?.role === 'admin' && (
            <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
              <Plus size={20} /> Novo Registro
            </button>
          )}
        </div>
      </div>

      <div ref={reportRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Metric Cards */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper} style={{ color: '#EF4444', backgroundColor: '#FEE2E2' }}>
            <HeartPulse size={24} />
          </div>
          <div className={styles.metricInfo}>
            <h3>Pressão Arterial</h3>
            <div className={styles.metricValue}>
              {lastBp ? `${lastBp.sistolica}/${lastBp.diastolica}` : '--/--'} <span>mmHg</span>
            </div>
            <p>Última medição: {lastBp ? `${lastBp.date} ${lastBp.time}` : 'Sem registros'}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper} style={{ color: '#3B82F6', backgroundColor: '#DBEAFE' }}>
            <Droplet size={24} />
          </div>
          <div className={styles.metricInfo}>
            <h3>Glicose</h3>
            <div className={styles.metricValue}>
              {lastGlucose ? lastGlucose.valor : '--'} <span>mg/dL</span>
            </div>
            <p>Última medição: {lastGlucose ? `${lastGlucose.date} ${lastGlucose.time}` : 'Sem registros'}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper} style={{ color: '#F59E0B', backgroundColor: '#FEF3C7' }}>
            <Activity size={24} />
          </div>
          <div className={styles.metricInfo}>
            <h3>Temperatura</h3>
            <div className={styles.metricValue}>36.5 <span>°C</span></div>
            <p>Última medição: Ontem, 20:00</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrapper} style={{ color: '#10B981', backgroundColor: '#D1FAE5' }}>
            <Scale size={24} />
          </div>
          <div className={styles.metricInfo}>
            <h3>Peso</h3>
            <div className={styles.metricValue}>64.2 <span>kg</span></div>
            <p>Última medição: 15/04</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2>Evolução da Pressão Arterial</h2>
            <select className={styles.chartSelect}>
              <option>Últimos 5 dias</option>
              <option>Últimos 15 dias</option>
              <option>Último mês</option>
            </select>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bpData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="sistolica" name="Sistólica" stroke="#EF4444" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="diastolica" name="Diastólica" stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h2>Glicemia em Jejum</h2>
            <select className={styles.chartSelect}>
              <option>Últimos 5 dias</option>
              <option>Últimos 15 dias</option>
              <option>Último mês</option>
            </select>
          </div>
          <div className={styles.chartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={glucoseData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="valor" name="Glicose (mg/dL)" stroke="#10B981" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Novo Registro de Saúde">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formGroup">
            <label className="formLabel">Tipo de Medição</label>
            <select className="formSelect" {...register('type')}>
              <option value="bp">Pressão Arterial</option>
              <option value="glucose">Glicose</option>
            </select>
            {errors.type && <span className="formError">{errors.type.message}</span>}
          </div>
          
          {selectedType === 'bp' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="formGroup">
                <label className="formLabel">Sistólica (Alta)</label>
                <input type="number" className="formInput" placeholder="Ex: 120" {...register('sistolica')} />
              </div>
              <div className="formGroup">
                <label className="formLabel">Diastólica (Baixa)</label>
                <input type="number" className="formInput" placeholder="Ex: 80" {...register('diastolica')} />
              </div>
            </div>
          )}

          {selectedType === 'glucose' && (
            <div className="formGroup">
              <label className="formLabel">Valor (mg/dL)</label>
              <input type="number" className="formInput" placeholder="Ex: 95" {...register('valor')} />
            </div>
          )}

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
              Salvar Registro
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HealthRecords;
