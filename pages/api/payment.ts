import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client'
import stripe from "stripe";

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!
const s = new stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2020-08-27" });

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = `${req.query["payment_intent"]}`;
  const { status } = await s.paymentIntents.retrieve(token);

  if (status === "succeeded") {
    const prisma = new PrismaClient()
    const session = getSession(req, res);
    const email = session?.user.email || "";
    await prisma.hectare.create({ data: { email, token }});
  }

  res.redirect("/");
};

export default webhookHandler;
