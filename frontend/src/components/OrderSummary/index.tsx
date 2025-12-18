import { useAppContext } from "../../hooks/useAppContext";

const OrderSummary = () => {
  const { product } = useAppContext();
  
  return (
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
  );
};

export default OrderSummary;
