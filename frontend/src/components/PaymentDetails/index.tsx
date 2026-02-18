import { useEffect, useRef } from "react";
import { useAppContext } from "../../hooks/useAppContext";

const PaymentDetails = () => {
  const {
    usdtAddress,
    product,
    error,
    submitTransaction,
  } = useAppContext();

  const web3Ref = useRef<any>(null);

  // Attach the onTxnSubmitted callback to the Blockonomics web3 component
  useEffect(() => {
    if (web3Ref.current && usdtAddress) {
      web3Ref.current.onTxnSubmitted = (result: { crypto: string; txhash: string }) => {
        console.log(`Transaction submitted: ${result.txhash}`);
        submitTransaction(result.txhash);
      };
    }
  }, [usdtAddress, submitTransaction]);

  return (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Pay with USDT</h3>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-900 font-medium">Error: {error}</p>
          </div>
        )}

        {usdtAddress && (
          <>
            {/* Amount to Pay */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount to Pay
              </label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">USDT Amount:</span>
                  <span className="text-xl font-bold text-gray-900 font-mono">
                    {product.priceUSDT} USDT
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-gray-500">USD Equivalent:</span>
                  <span className="text-gray-700">${product.priceUSD}</span>
                </div>
              </div>
            </div>

            {/* Blockonomics Web3 Payment Component */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pay with Web3 Wallet
              </label>
              <web3-payment
                ref={web3Ref}
                order_amount={product.priceUSDT}
                receive_address={usdtAddress}
                testnet="1"
              ></web3-payment>
              <p className="text-xs text-gray-500 mt-1">
                Connect your Web3 wallet (e.g. MetaMask) to pay directly.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentDetails;
