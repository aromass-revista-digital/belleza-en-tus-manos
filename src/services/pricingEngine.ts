// Strict Pricing & Commission Calculation Engine
// Fórmulas obligatorias:
// Precio público = P * 1.30
// Comisión revendedor = P * 0.10
// Margen distribuidora = P * 0.20
// Importe distribuidora = P * 1.20

export interface PriceBreakdown {
  referencePrice: number;    // P (solo visible por el administrador)
  publicPrice: number;       // P * 1.30
  resellerGain: number;      // P * 0.10
  distributorMargin: number; // P * 0.20
  distributorAmount: number; // P * 1.20
}

export function calculatePrices(referencePrice: number): PriceBreakdown {
  const p = Math.round(Number(referencePrice) || 0);
  const publicPrice = Math.round(p * 1.30);
  const resellerGain = Math.round(p * 0.10);
  const distributorMargin = Math.round(p * 0.20);
  const distributorAmount = Math.round(p * 1.20);

  return {
    referencePrice: p,
    publicPrice,
    resellerGain,
    distributorMargin,
    distributorAmount
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}
