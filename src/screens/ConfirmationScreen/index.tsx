import { useEffect, useState } from "react";
import NordicButton from "../../components/NordicButton";

interface ConfirmationScreenProps {
  btcAddress: string;
  product: any;
}

const ConfirmationScreen = ({ btcAddress, product }: ConfirmationScreenProps) => {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinalStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3001/order_status/${btcAddress}`);
        if (response.ok) {
          const data = await response.json();
          setOrderData(data);
        }
      } catch (err) {
        console.error('Error fetching final order status:', err);
      } finally {
        setLoading(false);
      }
    };

    if (btcAddress) {
      fetchFinalStatus();
    }
  }, [btcAddress]);

  const handleNewOrder = () => {
    window.location.reload();
  };

  const satoshisToBTC = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8);
  };

  return (
    <main className="py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-6 bg-green-100 rounded-full mb-4">
            <svg className="w-24 h-24 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Payment Detected!
          </h1>
          <p className="text-xl text-gray-600">
            {orderData?.status === 'confirmed' ? 'Your coffee is being prepared.' : 'Waiting for network confirmation...'}
          </p>
        </div>

        {loading ? (
          <div className="text-center p-12 text-gray-500">Retrieving transaction details...</div>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Product</span>
                  <span className="font-semibold text-gray-900">{product.name}</span>
                </div>
                {orderData?.value && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">BTC Amount</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {satoshisToBTC(orderData.value)} BTC
                    </span>
                  </div>
                )}
              </div>
            </div>

            {orderData?.txid && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Blockchain Info</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Transaction ID</label>
                    <p className="text-sm font-mono text-gray-600 break-all bg-white p-3 rounded border border-gray-200">
                      {orderData.txid}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Confirmations</label>
                      <p className="text-2xl font-bold text-gray-900">{orderData.confirmations}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                      <p className={`text-2xl font-bold ${orderData.status === 'confirmed' ? 'text-green-600' : 'text-blue-600'}`}>
                        {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-center">
          <NordicButton onClick={handleNewOrder}>Place Another Order</NordicButton>
        </div>
      </div>
    </main>
  );
};

export default ConfirmationScreen;