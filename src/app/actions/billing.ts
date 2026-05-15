"use server";

export async function createCheckoutSession() {
  return { error: "Billing not available in this project." };
}

export async function createPortalSession() {
  return { error: "Billing not available in this project." };
}
