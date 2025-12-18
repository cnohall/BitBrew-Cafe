import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../hooks/useAppContext';
import NordicButton from '../../components/NordicButton';
import OrderSummary from '../../components/OrderSummary';
import PaymentDetails from '../../components/PaymentDetails';
import PaymentStatus from '../../components/PaymentStatus';

const Checkout = () => {
  const navigate = useNavigate();
  const { paymentStatus } = useAppContext();

  // Navigate to confirmation when payment is detected
  useEffect(() => {
    if (paymentStatus !== null && paymentStatus >= 0) {
      // Add a slight delay for better UX (show success state briefly)
      const timer = setTimeout(() => {
        navigate('/confirmation');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [paymentStatus, navigate]);

  return (
    <main className="py-8">
      <div className="mb-4">
        <NordicButton onClick={() => navigate('/')}>
          Back to Product
        </NordicButton>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <OrderSummary />

        <div className="lg:col-span-2">
          <PaymentDetails />
          <PaymentStatus />
        </div>
      </div>
    </main>
  );
};

export default Checkout;