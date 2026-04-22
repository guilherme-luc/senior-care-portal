import { useEffect, useState } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../services/firebase';
import { toast } from 'sonner';

export const usePushNotifications = () => {
  const [fcmToken, setFcmToken] = useState(null);

  const requestPermission = async () => {
    try {
      if (!('Notification' in window)) {
        toast.error('Este navegador não suporta notificações de área de trabalho.');
        return;
      }

      console.log('Solicitando permissão de notificação...');
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Permissão concedida.');
        // Em um app real, geraríamos o token com sua VAPID_KEY do Firebase aqui
        // const token = await getToken(messaging, { vapidKey: 'SUA_CHAVE_VAPID' });
        // setFcmToken(token);
        toast.success('Notificações ativadas! Você receberá alertas importantes.');
      } else {
        toast.error('Permissão para notificações negada.');
      }
    } catch (error) {
      console.error('Erro ao pedir permissão', error);
      toast.error('Erro ao configurar notificações.');
    }
  };

  useEffect(() => {
    if (!messaging) return;

    // Fica escutando mensagens caso o app esteja aberto (Foreground)
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Mensagem recebida no app: ', payload);
      toast(payload.notification?.title || 'Novo Alerta', {
        description: payload.notification?.body,
        action: {
          label: 'Ver',
          onClick: () => console.log('Clicou na notificação')
        },
      });
    });

    return () => unsubscribe();
  }, []);

  return { fcmToken, requestPermission };
};
