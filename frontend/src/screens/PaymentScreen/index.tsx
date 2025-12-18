import NordicButton from "../../components/NordicButton";
import OrderSummary from "../../components/OrderSummary";
import PaymentDetails from "../../components/PaymentDetails";
import PaymentStatus from "../../components/PaymentStatus";
import { useAppContext } from "../../hooks/useAppContext";

const PaymentScreen = () => {
  const {
    setCurrentScreen,
  } = useAppContext();

  return (
    <main className="py-8">
      <div className="mb-4">
        <NordicButton onClick={() => setCurrentScreen('landing')}>
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

export default PaymentScreen;