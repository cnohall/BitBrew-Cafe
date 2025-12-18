import LandingScreen from "./screens/LandingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import ConfirmationScreen from "./screens/ConfirmationScreen";
import Layout from "./components/Layout";
import { useAppContext } from "./hooks/useAppContext";

export default function BitBrewCafe() {
  const { currentScreen } = useAppContext();

  return (
    <Layout>
      <div className="transition-screen w-full py-4 sm:py-8">
        {currentScreen === 'landing' && <LandingScreen />}
        {currentScreen === 'payment' && <PaymentScreen />}
        {currentScreen === 'confirmation' && <ConfirmationScreen />}
      </div>
    </Layout>
  );
}