export type Screen = 'landing' | 'payment' | 'confirmation' | 'error';

export interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  btcAddress: string;
  loading: boolean;
  error: string;
  showTechnicalDetails: boolean;
  setShowTechnicalDetails: (show: boolean) => void;
  apiLog: any[];
  addLog: (type: string, message: string, data?: any) => void;
  wsStatus: string;
  paymentStatus: number | null;
  transactionData: any;
  product: {
    name: string;
    description: string;
    priceUSD: number;
    priceBTC: number;
  };
  generateBitcoinAddress: () => Promise<void>;
  handleBuyClick: () => void;
  getQRCodeUrl: (address: string) => string;
  copyToClipboard: (text: string) => void;
  handleNewOrder: () => void;
}