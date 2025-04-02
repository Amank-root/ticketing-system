export interface Coupon {
  id: string;
  code: string;
  discount: string;
  description: string;
}

export const coupons: Coupon[] = [
  {
    id: '1',
    code: 'SAVE10',
    discount: '10%',
    description: '10% off your purchase'
  },
  {
    id: '2',
    code: 'SAVE20',
    discount: '20%',
    description: '20% off your purchase'
  },
  {
    id: '3',
    code: 'SAVE30',
    discount: '30%',
    description: '30% off your purchase'
  },
  {
    id: '4',
    code: 'FREESHIP',
    discount: 'FREE',
    description: 'Free shipping on your order'
  },
  {
    id: '5',
    code: 'BOGO50',
    discount: '50%',
    description: 'Buy one get one 50% off'
  }
]; 