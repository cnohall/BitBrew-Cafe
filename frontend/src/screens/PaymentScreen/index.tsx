import NordicButton from "../../components/NordicButton";
import OrderSummary from "../../components/OrderSummary";
import PaymentDetails from "../../components/PaymentDetails";
import PaymentStatus from "../../components/PaymentStatus";
import { useAppContext } from "../../context/AppContext";

const PaymentScreen = () => {
  const {
    setCurrentScreen,
    btcAddress,
    product,
    getQRCodeUrl,
    copyToClipboard,
    loading,
    error,
    wsStatus,
    paymentStatus,
    transactionData
  } = useAppContext();

  return (
    <main className="py-8">
      <div className="mb-4">
        <NordicButton onClick={() => setCurrentScreen('landing')}>
          Back to Product
        </NordicButton>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <OrderSummary product={product} />

        <div className="lg:col-span-2">
          <PaymentDetails
            btcAddress={btcAddress}
            product={product}
            getQRCodeUrl={getQRCodeUrl}
            copyToClipboard={copyToClipboard}
            loading={loading}
            error={error}
            wsStatus={wsStatus}
            paymentStatus={paymentStatus || 0}
          />
          <PaymentStatus
            paymentStatus={paymentStatus || 0}
            transactionData={transactionData}
          />
        </div>
      </div>
    </main>
  );
};

export default PaymentScreen;