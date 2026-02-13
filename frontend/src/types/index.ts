export interface AppContextType {
  usdtAddress: string;
  loading: boolean;
  error: string;
  txSubmitted: boolean;
  product: {
    name: string;
    description: string;
    priceUSD: number;
    priceUSDT: number;
  };
  generateUSDTAddress: () => Promise<void>;
  handleBuyClick: () => void;
  handleNewOrder: () => void;
  submitTransaction: (txhash: string) => Promise<{ success: boolean; error?: string }>;
}

// Type declaration for Blockonomics web3-payment custom element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'web3-payment': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        order_amount?: string;
        receive_address?: string;
        testnet?: string;
      };
    }
  }
}
