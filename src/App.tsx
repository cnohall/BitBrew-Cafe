import { useEffect, useRef, useState } from "react";
import { Container } from "./components/Container";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Section } from "./components/Section";
import LandingScreen from "./screens/LandingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import type { Screen } from "./types";
import ConfirmationScreen from "./screens/ConfirmationScreen";

export default function BitBrewCafe() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [btcAddress, setBtcAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [apiLog, setApiLog] = useState([]);
  const [wsStatus, setWsStatus] = useState('disconnected');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const wsRef = useRef(null);
  const pollIntervalRef = useRef(null);
  
  const product = {
    name: 'Ethiopian Yirgacheffe',
    description: 'Premium Single Origin',
    priceUSD: 24.99,
    priceBTC: 0.00026
  };

  const addLog = (type, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLog(prev => [...prev, { timestamp, type, message, data }]);
  };

  // WebSocket connection management
  useEffect(() => {
    if (!btcAddress) return;

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
            
            // Move to confirmation screen on any valid payment detection (status >= 0)
            if (data.status >= 0) {
              addLog('success', `Payment detected with status: ${data.status}. Transitioning...`);
              setTimeout(() => setCurrentScreen('confirmation'), 1500); // Slight delay for UX
              
              if (wsRef.current) {
                wsRef.current.close();
              }
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
      if (wsRef.current) wsRef.current.close();
    };
  }, [btcAddress]);

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
    } catch (err) {
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
    setOrderData(null);
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

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .transition-screen {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
      
      <Header />

      <Container>
        {currentScreen === 'landing' && (
          <Section>
            <div className="transition-screen">
              <LandingScreen onBuyClick={handleBuyClick} />
            </div>
          </Section>
        )}

        {currentScreen === 'payment' && (
          <Section>
            <div className="transition-screen">
              <PaymentScreen 
                setCurrentScreen={setCurrentScreen} 
                btcAddress={btcAddress} 
                loading={loading} 
                error={error} 
                showTechnicalDetails={showTechnicalDetails} 
                apiLog={apiLog} 
                getQRCodeUrl={getQRCodeUrl}
                copyToClipboard={copyToClipboard}
                setShowTechnicalDetails={setShowTechnicalDetails}
                product={product}
                wsStatus={wsStatus}
                paymentStatus={paymentStatus || 0}
                transactionData={transactionData}
              />
            </div>
          </Section>
        )}

        {currentScreen === 'confirmation' && (
          <Section>
            <div className="transition-screen">
              <ConfirmationScreen 
                btcAddress={btcAddress}
                product={product}
              />
            </div>
          </Section>
        )}
      </Container>

      <Footer />
    </div>
  );
}