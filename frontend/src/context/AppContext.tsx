import { createContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

const USDT_ADDRESS = '0x5C0ed91604E92D7f488d62058293ce603BCC68eF';

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState('');
  const [txSubmitted, setTxSubmitted] = useState(false);

  const product = {
    name: 'Ethiopian Yirgacheffe',
    description: 'Premium Single Origin',
    priceUSD: 24.99,
    priceUSDT: 24.99
  };

  const handleNewOrder = useCallback(() => {
    setError('');
    setTxSubmitted(false);
  }, []);

  const submitTransaction = useCallback(async (txhash: string) => {
    try {
      const response = await fetch('http://localhost:3001/monitor_usdt_transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txhash, usdtAddress: USDT_ADDRESS }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to monitor transaction.');
      }

      console.log(`Transaction ${txhash} submitted for monitoring.`);
      setTxSubmitted(true);
      return { success: true };
    } catch (err: any) {
      console.error(`Error submitting transaction: ${err.message}`);
      return { success: false, error: err.message };
    }
  }, []);

  const value: AppContextType = {
    usdtAddress: USDT_ADDRESS,
    error,
    txSubmitted,
    product,
    handleNewOrder,
    submitTransaction,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
