import { useState } from 'react';
import LandingScreen from './screens/LandingScreen';
import type { Screen } from './types';
import PaymentScreen from './screens/PaymentScreen';
import Footer from './components/Footer';
import Header from './components/Header';



export default function BitBrewCafe() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [btcAddress, setBtcAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [apiLog, setApiLog] = useState([]);
  
  // Product details
  const product = {
    name: 'Ethiopian Yirgacheffe',
    description: 'Premium Single Origin',
    priceUSD: 24.99,
    priceBTC: 0.00026 // Approximate, will be calculated based on current rates
  };

  // Function to add log entries
  const addLog = (type, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setApiLog(prev => [...prev, { timestamp, type, message, data }]);
  };

  // Generate Bitcoin address via Blockonomics API
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

  // Handle "Buy with Bitcoin" click
  const handleBuyClick = () => {
    setCurrentScreen('payment');
    setApiLog([]);
    generateBitcoinAddress();
  };

  // Generate QR code URL
  const getQRCodeUrl = (address: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=bitcoin:${address}?amount=${product.priceBTC}`;
  };

  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('info', 'Address copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Landing Page */}
      {currentScreen === 'landing' && (
        <LandingScreen onBuyClick={handleBuyClick} />
      )}

      {/* Payment Screen */}
      {currentScreen === 'payment' && (
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
        />
      )}
      <Footer />
    </div>
  );
}