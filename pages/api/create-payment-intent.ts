// This is your test secret API key.
import stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";

const s = new stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2020-08-27",
});

type Data = {
  clientSecret: string;
};

const calculateOrderAmount = () => 1400;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
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
}
