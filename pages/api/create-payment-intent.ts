// This is your test secret API key.
import stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from 'next'

const s = new stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2020-08-27" });

type Data = {
    clientSecret: string
};
  
const calculateOrderAmount = () => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await s.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret || "",
  });
};