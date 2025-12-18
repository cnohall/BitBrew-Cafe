import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Screen, AppContextType } from '../types';
import { useWebSocket } from '../hooks/useWebSocket';

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [btcAddress, setBtcAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [apiLog, setApiLog] = useState<any[]>([]);
  
  const product = {
    name: 'Ethiopian Yirgacheffe',
    description: 'Premium Single Origin',
    priceUSD: 24.99,
    priceBTC: 0.00026
  };

  const addLog = useCallback((type: string, message: string, data: any = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLog(prev => [...prev, { timestamp, type, message, data }]);
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    setTimeout(() => setCurrentScreen('confirmation'), 1500);
  }, []);

  const {
    wsStatus, paymentStatus, transactionData,
    setWsStatus, setPaymentStatus, setTransactionData
  } = useWebSocket(btcAddress, addLog, handlePaymentSuccess);

  const generateBitcoinAddress = async () => {
    setLoading(true);
    setError('');
    addLog('info', 'Initiating API call to backend...');

    try {
      const response = await fetch('http://localhost:3001/new_address', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.address) {
        setBtcAddress(data.address);
        addLog('success', `Bitcoin address generated: ${data.address}`);
      } else {
        throw new Error('No address returned from API');
      }
    } catch (err: any) {
      setError(err.message);
      addLog('error', `Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = () => {
    setCurrentScreen('payment');
    setApiLog([]);
    setPaymentStatus(null);
    setTransactionData(null);
    setWsStatus('disconnected');
    setBtcAddress('');
    setError('');
    generateBitcoinAddress();
  };

  const getQRCodeUrl = (address: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=bitcoin:${address}?amount=${product.priceBTC}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('info', 'Address copied to clipboard');
  };

  const handleNewOrder = () => {
    setCurrentScreen('landing');
    setBtcAddress('');
    setApiLog([]);
    setPaymentStatus(null);
    setTransactionData(null);
    setWsStatus('disconnected');
    setError('');
    setLoading(false);
  };

  const value = {
    currentScreen,
    setCurrentScreen,
    btcAddress,
    loading,
    error,
    showTechnicalDetails,
    setShowTechnicalDetails,
    apiLog,
    addLog,
    wsStatus,
    paymentStatus,
    transactionData,
    product,
    generateBitcoinAddress,
    handleBuyClick,
    getQRCodeUrl,
    copyToClipboard,
    handleNewOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;