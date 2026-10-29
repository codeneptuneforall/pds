import React from 'react';
import { formatINR } from '../../utils/store';
import type { Product } from '../../types/store';

export function PriceTag({ product, size = 'md' }: {product: Product;size?: 'md' | 'lg';}) {
  const main = size === 'lg' ? 'text-2xl' : 'text-base';
  if (product.salePrice) {
    return (
      <p className="flex items-baseline gap-2">
        <span className={`${main} font-semibold text-maroon`}>{formatINR(product.salePrice)}</span>
        <span className="text-sm text-charcoal/50 line-through">
          <span className="sr-only">Was </span>
          {formatINR(product.price)}
        </span>
      </p>);

  }
  return <p className={`${main} font-semibold text-charcoal`}>{formatINR(product.price)}</p>;
}