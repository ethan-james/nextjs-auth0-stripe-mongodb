import '../styles/globals.css'
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app'
import { UserProvider } from "@auth0/nextjs-auth0";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Appearance } from "@stripe/stripe-js/types";

const appearance: Appearance = { theme: 'night' };
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");


function MyApp({ Component, pageProps }: AppProps) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt" }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options = { clientSecret, appearance };

  if (!clientSecret) return "Loading..."
  
  return (
    <UserProvider>
      <Elements options={options} stripe={stripePromise}>
        <Component {...pageProps} />
      </Elements>
    </UserProvider>
  );
}

export default MyApp
