// Utilidad para obtener el estado de pago de una suscripción según la fecha de vencimiento
export function getSubscriptionStatus(dueDate: string): "late" | "pending" | "paid" {
  const today = new Date();
  const due = new Date(dueDate);
  const duePlusFive = new Date(dueDate);
  duePlusFive.setDate(duePlusFive.getDate() + 5);

  if (today > duePlusFive) return "late";
  if (today > due) return "pending";
  return "paid";
}
