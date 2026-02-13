import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import NordicButton from '../../components/NordicButton';
import OrderSummary from '../../components/OrderSummary';
import PaymentDetails from '../../components/PaymentDetails';

const Checkout = () => {
  const navigate = useNavigate();
  const { txSubmitted } = useAppContext();

  // Redirect to confirmation once the transaction is submitted to backend
  useEffect(() => {
    if (txSubmitted) {
      const timer = setTimeout(() => navigate('/confirmation'), 1500);
      return () => clearTimeout(timer);
    }
  }, [txSubmitted, navigate]);

  return (
    <main className="py-8">
      <div className="mb-4">
        <NordicButton onClick={() => navigate('/')}>
          Back to Product
        </NordicButton>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <OrderSummary />
        <PaymentDetails />
      </div>
    </main>
  );
};

export default Checkout;
