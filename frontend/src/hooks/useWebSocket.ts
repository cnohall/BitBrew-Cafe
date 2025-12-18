import { useState, useEffect, useRef } from 'react';

type AddLogFunction = (type: string, message: string, data?: any) => void;

export const useWebSocket = (
  btcAddress: string,
  addLog: AddLogFunction,
  onPaymentSuccess: () => void
) => {
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [paymentStatus, setPaymentStatus] = useState<number | null>(null);
  const [transactionData, setTransactionData] = useState(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!btcAddress) {
      return;
    }

    const connectWebSocket = () => {
      setWsStatus('connecting');
      addLog('info', `Connecting to WebSocket: wss://www.blockonomics.co/payment/${btcAddress}`);

      const ws = new WebSocket(`wss://www.blockonomics.co/payment/${btcAddress}`);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('connected');
        addLog('success', 'WebSocket connected - Listening for payment...');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          addLog('websocket', 'Received WebSocket message', data);

          if (data.status !== undefined) {
            setPaymentStatus(data.status);
            setTransactionData(data);

            if (data.status >= 0) {
              addLog('success', `Payment detected with status: ${data.status}. Transitioning...`);
              onPaymentSuccess();
              wsRef.current?.close();
            }
          }
        } catch (err) {
          addLog('error', 'Error parsing WebSocket message', event.data);
        }
      };

      ws.onerror = () => setWsStatus('error');
      ws.onclose = () => setWsStatus('disconnected');
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        addLog('info', 'Closing WebSocket connection.');
        wsRef.current.close();
        wsRef.current = null;
      }
      setWsStatus('disconnected');
    };
  }, [btcAddress, addLog, onPaymentSuccess]);

  return { wsStatus, paymentStatus, transactionData, setWsStatus, setPaymentStatus, setTransactionData };
};