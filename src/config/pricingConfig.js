const PRICE_SMALL  = parseFloat(import.meta.env.VITE_PRICE_TIER_SMALL)  || 160;
const PRICE_MEDIUM = parseFloat(import.meta.env.VITE_PRICE_TIER_MEDIUM) || 130;
const PRICE_LARGE  = parseFloat(import.meta.env.VITE_PRICE_TIER_LARGE)  || 119.99;

export const pricingTiers = [
  {
    id: 'small',
    name: 'Eventos Pequeños',
    range: [1, 499],
    price: PRICE_SMALL,
  },
  {
    id: 'medium',
    name: 'Eventos Medianos',
    range: [500, 1000],
    price: PRICE_MEDIUM,
    popular: true,
  },
  {
    id: 'large',
    name: 'Eventos Grandes',
    range: [1001, Infinity],
    price: PRICE_LARGE,
  },
];

/**
 * Returns the matching tier for a given ticket count.
 * Falls back to the largest tier for counts above all ranges.
 */
export function getTierForCount(count) {
  return (
    pricingTiers.find((t) => count >= t.range[0] && count <= t.range[1]) ??
    pricingTiers[pricingTiers.length - 1]
  );
}

/**
 * Returns the total price for a given ticket count.
 */
export function calcTotalPrice(count) {
  if (!count || count <= 0) return 0;
  return count * getTierForCount(count).price;
}
