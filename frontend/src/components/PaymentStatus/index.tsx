import { useAppContext } from "../../context/AppContext";

const PaymentStatus = () => {
  const { paymentStatus, transactionData } = useAppContext();

  const getStatusColor = (status: number) => {
    switch(status) {
      case 0: return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 1: return 'bg-blue-50 border-blue-200 text-blue-900';
      case 2: return 'bg-green-50 border-green-200 text-green-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getStatusIcon = (status: number) => {
    switch(status) {
      case 0: return '⏳';
      case 1: return '🔄';
      case 2: return '✅';
      default: return '⏱️';
    }
  };

  const getStatusMessage = (status: number) => {
    switch(status) {
      case 0: return 'Payment detected (unconfirmed)';
      case 1: return 'Payment confirming...';
      case 2: return 'Payment confirmed!';
      default: return 'Waiting for payment';
    }
  };

  const satoshisToBTC = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8);
  };

  return (
    <>
      {paymentStatus !== null && (
        <div className={`mb-6 p-4 rounded-lg border ${getStatusColor(paymentStatus)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getStatusIcon(paymentStatus)}</span>
              <div>
                <p className="font-bold text-lg">{getStatusMessage(paymentStatus)}</p>
                {transactionData && (
                  <div className="mt-2 space-y-1">
                    {transactionData.value && (
                      <p className="text-sm">
                        Amount: <span className="font-mono font-semibold">{satoshisToBTC(transactionData.value)} BTC</span>
                        {' '}({transactionData.value.toLocaleString()} satoshis)
                      </p>
                    )}
                    {transactionData.txid && (
                      <p className="text-sm">
                        TX: <span className="font-mono text-xs">{transactionData.txid.substring(0, 16)}...</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {paymentStatus === 2 && (
              <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentStatus;
