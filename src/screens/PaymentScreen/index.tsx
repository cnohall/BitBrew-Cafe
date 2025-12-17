import type { Screen } from "../../types";

interface PaymentScreenProps {
  setCurrentScreen: (screen: Screen ) => void; // Define the onBuyClick
  btcAddress: string;
  loading: boolean;
  error: string;
  showTechnicalDetails: boolean;
  apiLog: any[]; // Define the apiLog type
  getQRCodeUrl: (address: string) => string;
  copyToClipboard: (text: string) => void;
  setShowTechnicalDetails: (show: boolean) => void;
  product: {
    name: string;
    description: string;
    priceUSD: number;
    priceBTC: number;
  }
}

export default function PaymentScreen(props: PaymentScreenProps) {
  const { 
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
  } = props;

  return (
      <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => setCurrentScreen('landing')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Product
          </button>

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

                {/* Payment Ready */}
                {btcAddress && !loading && (
                  <>
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-green-900 font-medium">Payment address ready!</span>
                      </div>
                    </div>

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
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors rounded-lg"
                >
                  <span className="font-semibold text-gray-900">
                    📋 Technical Details (API Log)
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
                          {apiLog.map((log, index) => (
                            <div key={index} className="text-sm">
                              <div className="flex items-start">
                                <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
                                <span className={`font-semibold mr-2 ${
                                  log.type === 'error' ? 'text-red-400' :
                                  log.type === 'success' ? 'text-green-400' :
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
  )
}
