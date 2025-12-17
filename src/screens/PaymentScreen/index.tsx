import type { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";
import NordicButton from "../../components/NordicButton";

interface PaymentScreenProps {
  setCurrentScreen: (screen: string) => void;
  btcAddress: string;
  product: any;
  getQRCodeUrl: (address: string) => string;
  copyToClipboard: (text: string) => void;
  loading: boolean;
  error: string;
  showTechnicalDetails: boolean;
  setShowTechnicalDetails: (show: boolean) => void;
  apiLog: any[];
  wsStatus: string;
  paymentStatus: number;
  transactionData: any;
}

const PaymentScreen = ({ 
  setCurrentScreen, 
  btcAddress, 
  product, 
  getQRCodeUrl, 
  copyToClipboard, 
  loading, 
  error, 
  showTechnicalDetails, 
  setShowTechnicalDetails, 
  apiLog,
  wsStatus,
  paymentStatus,
  transactionData
}: PaymentScreenProps) => {
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
    <main className="py-8">
      <div className="mb-4">
        <NordicButton onClick={() => setCurrentScreen('landing')}>
          Back to Product
        </NordicButton>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${product.priceUSD}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Pay with Bitcoin</h3>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-red-900 font-medium">Error generating address</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <span className="text-blue-900 font-medium">Generating payment address...</span>
                </div>
              </div>
            )}

            {/* WebSocket Status Indicator */}
            {btcAddress && !loading && (
              <div className={`mb-6 p-4 rounded-lg border ${
                wsStatus === 'connected' ? 'bg-blue-50 border-blue-200' :
                wsStatus === 'connecting' ? 'bg-yellow-50 border-yellow-200' :
                wsStatus === 'error' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center">
                  {wsStatus === 'connected' && (
                    <>
                      <div className="relative mr-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <span className="text-blue-900 font-medium">🎧 Listening for payment...</span>
                    </>
                  )}
                  {wsStatus === 'connecting' && (
                    <>
                      <div className="animate-spin mr-3">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <span className="text-yellow-900 font-medium">Connecting to payment monitor...</span>
                    </>
                  )}
                  {wsStatus === 'error' && (
                    <>
                      <svg className="w-5 h-5 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-900 font-medium">Connection error</span>
                    </>
                  )}
                  {wsStatus === 'disconnected' && (
                    <>
                      <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                      <span className="text-gray-700 font-medium">Not connected</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Payment Status */}
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

            {/* Payment Ready */}
            {btcAddress && !loading && paymentStatus === null && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-900 font-medium">Payment address ready!</span>
                </div>
              </div>
            )}

            {btcAddress && !loading && (
              <>
                {/* QR Code */}
                <div className="mb-6">
                  <div className="bg-white rounded-lg flex items-center justify-center border border-gray-200 p-4">
                    <img 
                      src={getQRCodeUrl(btcAddress)} 
                      alt="Bitcoin Payment QR Code"
                      className="w-64 h-64"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Scan with your Bitcoin wallet
                  </p>
                </div>

                {/* Bitcoin Address */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bitcoin Address
                  </label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 flex items-center justify-between">
                    <p className="text-gray-900 text-sm font-mono break-all flex-1">
                      {btcAddress}
                    </p>
                    <button
                      onClick={() => copyToClipboard(btcAddress)}
                      className="ml-3 p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      title="Copy to clipboard"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Amount in BTC */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount to Pay
                  </label>
                  <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">BTC Amount:</span>
                      <span className="text-xl font-bold text-gray-900 font-mono">
                        {product.priceBTC} BTC
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="text-gray-500">USD Equivalent:</span>
                      <span className="text-gray-700">${product.priceUSD}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  Send the exact amount to the address above. Payment will be detected automatically.
                </p>
              </>
            )}
          </div>

          {/* Technical Details Section */}
          <div className="bg-gray-50 rounded-lg border border-gray-200">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full px-6 py-4 flex items-center justify-between text-left 
                        bg-white text-gray-900 
                        hover:bg-gray-200 hover:text-gray-900 
                        transition-colors rounded-lg shadow-sm"
            >
              <span className="font-semibold">
                📋 Technical Details (API & WebSocket Log)
              </span>
              <svg
                className={`w-5 h-5 text-gray-600 transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showTechnicalDetails && (
              <div className="px-6 pb-6">
                <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                  {apiLog.length === 0 ? (
                    <p className="text-gray-400 text-sm">No API calls yet...</p>
                  ) : (
                    <div className="space-y-3">
                      {apiLog.map((log: { timestamp: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; type: string; message: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; data: any; }, index: Key | null | undefined) => (
                        <div key={index} className="text-sm">
                          <div className="flex items-start">
                            <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
                            <span className={`font-semibold mr-2 ${
                              log.type === 'error' ? 'text-red-400' :
                              log.type === 'success' ? 'text-green-400' :
                              log.type === 'websocket' ? 'text-purple-400' :
                              log.type === 'request' ? 'text-blue-400' :
                              log.type === 'response' ? 'text-yellow-400' :
                              'text-gray-400'
                            }`}>
                              {log.type.toUpperCase()}:
                            </span>
                          </div>
                          <p className="text-gray-300 ml-20 mt-1">{log.message}</p>
                          {log.data && (
                            <pre className="text-gray-400 ml-20 mt-2 text-xs overflow-x-auto">
                              {JSON.stringify(log.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentScreen;