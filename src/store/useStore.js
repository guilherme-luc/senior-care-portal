import { create } from 'zustand';
import { toast } from 'sonner';

export const useStore = create((set) => ({
  // User Profile
  patient: {
    name: '',
    age: '',
    birthdate: '',
    cpf: '',
    bloodType: ''
  },

  familyMembers: [],
  addFamilyMember: (member) => set((state) => ({
    familyMembers: [...state.familyMembers, { ...member, id: Date.now() }]
  })),

  // Medications
  medications: [],
  markMedicationDone: (id) => set((state) => {
    const updatedMeds = state.medications.map(med => {
      if (med.id === id) {
        toast.success(`Remédio ${med.name} administrado com sucesso.`);
        return { 
          ...med, 
          status: 'done', 
          registeredAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
          registeredBy: 'Você' 
        };
      }
      return med;
    });
    return { medications: updatedMeds };
  }),
  addMedication: (med) => set((state) => {
    const newMed = {
      ...med,
      id: Date.now(),
      status: 'pending'
    };
    const newMedications = [...state.medications, newMed].sort((a, b) => a.time.localeCompare(b.time));
    return { medications: newMedications };
  }),
  deleteMedication: (id) => set((state) => ({
    medications: state.medications.filter(med => med.id !== id)
  })),

  // Checklist
  checklist: [],
  toggleChecklist: (id) => set((state) => {
    const updatedChecklist = state.checklist.map(item => {
      if (item.id === id) {
        const isCompleted = !item.completed;
        if (isCompleted) {
          toast.success(`Tarefa "${item.title}" concluída!`);
        }
        return { 
          ...item, 
          completed: isCompleted, 
          meta: isCompleted ? `Concluído às ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : undefined 
        };
      }
      return item;
    });
    return { checklist: updatedChecklist };
  }),
  addChecklistTask: (task) => set((state) => {
    const newTask = {
      ...task,
      id: Date.now(),
      completed: false
    };
    return { checklist: [...state.checklist, newTask] };
  }),
  deleteTask: (id) => set((state) => ({
    checklist: state.checklist.filter(task => task.id !== id)
  })),

  // Daily Logs
  logs: [],
  addLog: (log) => set((state) => {
    const newLog = {
      ...log,
      id: Date.now(),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      date: new Date().toLocaleDateString()
    };
    return { logs: [newLog, ...state.logs] };
  }),
  deleteLog: (id) => set((state) => ({
    logs: state.logs.filter(log => log.id !== id)
  })),

  // Appointments
  appointments: [],
  addAppointment: (app) => set((state) => ({
    appointments: [...state.appointments, { ...app, id: Date.now() }]
  })),
  deleteAppointment: (id) => set((state) => ({
    appointments: state.appointments.filter(a => a.id !== id)
  })),

  // Health Records
  healthRecords: [],
  addHealthRecord: (record) => set((state) => ({
    healthRecords: [...state.healthRecords, { 
      ...record, 
      id: Date.now(), 
      date: new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'}),
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]
  }))
}));
