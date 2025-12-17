interface LandingScreenProps {
  onBuyClick: () => void;
}

export default function LandingScreen(props: LandingScreenProps) {
  const { onBuyClick } = props;

  return (
    <main className="py-16">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Premium coffee. Paid in Bitcoin.
        </h2>
        <p className="text-xl text-gray-600">
          Experience the future of payments with exceptional coffee
        </p>
      </div>

      {/* Product Showcase */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-gradient-to-br from-amber-900 via-amber-700 to-amber-600 rounded-lg shadow-lg flex items-center justify-center">
          <div className="text-center text-white">
            <svg className="w-24 h-24 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <p className="text-lg font-semibold">Ethiopian Yirgacheffe</p>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Ethiopian Yirgacheffe
            </h3>
            <p className="text-lg text-gray-600 mb-1">Premium Single Origin</p>
            <p className="text-4xl font-bold text-gray-900">$24.99</p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            12oz bag of freshly roasted specialty coffee beans sourced from the highlands of Ethiopia. 
            Known for its bright, floral notes and clean finish.
          </p>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <span className="text-sm">✓ Single Origin</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-sm">✓ Freshly Roasted</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="text-sm">✓ 12oz (340g)</span>
            </div>
          </div>

          {/* Buy Button */}
          <button
            onClick={onBuyClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg text-lg"
            style={{ backgroundColor: '#F7931A' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8830F'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F7931A'}
          >
            Buy with Bitcoin ₿
          </button>

          <p className="text-sm text-gray-500 text-center">
            Fast, secure, and decentralized payment
          </p>
        </div>
      </div>
    </main>
  );
}
