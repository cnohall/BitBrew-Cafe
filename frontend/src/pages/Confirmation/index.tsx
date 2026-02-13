import { useEffect, useState } from "react";
import NordicButton from "../../components/NordicButton";
import { useAppContext } from "../../hooks/useAppContext";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const { usdtAddress, product, handleNewOrder } = useAppContext();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Poll for order status updates until confirmed
  useEffect(() => {
    if (!usdtAddress) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`http://localhost:3001/order_status/${usdtAddress}`);
        if (response.ok) {
          const data = await response.json();
          setOrderData(data);
          setLoading(false);
          // Stop polling once confirmed
          if (data.status === 'confirmed') return true;
        }
      } catch (err) {
        console.error('Error fetching order status:', err);
      }
      return false;
    };

    let stopped = false;
    fetchStatus().then(done => { if (done) stopped = true; });

    const interval = setInterval(async () => {
      if (stopped) { clearInterval(interval); return; }
      const done = await fetchStatus();
      if (done) clearInterval(interval);
    }, 5000);

    return () => clearInterval(interval);
  }, [usdtAddress]);

  const isConfirmed = orderData?.status === 'confirmed';
  const isPending = !orderData || orderData.status === 'pending';

  const onNewOrder = () => {
    handleNewOrder();
    navigate("/");
  };

  return (
    <main className="py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className={`inline-block p-6 rounded-full mb-4 ${isConfirmed ? 'bg-green-100' : 'bg-yellow-100'}`}>
            {isConfirmed ? (
              <svg className="w-24 h-24 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-24 h-24 text-yellow-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isConfirmed ? 'Payment Confirmed!' : 'Transaction Submitted'}
          </h1>
          <p className="text-xl text-gray-600">
            {isConfirmed
              ? 'Your coffee is being prepared.'
              : isPending
                ? 'Waiting for blockchain confirmation. This may take several minutes...'
                : 'Payment detected, waiting for final confirmation...'}
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
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {product.priceUSDT} USDT
                  </span>
                </div>
              </div>
            </div>

            {orderData?.txid && (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Blockchain Info</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Transaction Hash</label>
                    <p className="text-sm font-mono text-gray-600 break-all bg-white p-3 rounded border border-gray-200">
                      {orderData.txid}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Confirmations</label>
                      <p className="text-2xl font-bold text-gray-900">{orderData.confirmations ?? 0}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                      <p className={`text-2xl font-bold ${
                        isConfirmed ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {isConfirmed ? 'Confirmed' : isPending ? 'Pending' : 'Paid'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex justify-center">
          <NordicButton onClick={onNewOrder}>Place Another Order</NordicButton>
        </div>
      </div>
    </main>
  );
};

export default Confirmation;
