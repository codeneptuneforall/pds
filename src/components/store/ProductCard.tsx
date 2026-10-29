import React from 'react';
import { HeartIcon, ShoppingBagIcon } from 'lucide-react';
import { ProductImage } from './ProductImage';
import { PriceTag } from './PriceTag';
import { getCollectionTitle } from '../../utils/store';
import { useStore } from '../../contexts/StoreContext';
import type { Product } from '../../types/store';

export function ProductCard({ product }: {product: Product;}) {
  const { addToCart, toggleWishlist, isWishlisted, openProduct } = useStore();
  const saved = isWishlisted(product.id);

  return (
    <article className="flex h-full flex-col">
      <div className="relative">
        <button
          type="button"
          onClick={() => openProduct(product.id)}
          className="group block w-full overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon"
          aria-label={`View details for ${product.name}`}>
          
          <ProductImage
            src={product.image}
            alt={product.name}
            className="aspect-square w-full"
            imgClassName="transition-[transform,opacity] duration-300 group-hover:scale-[1.03]" />
          
        </button>
        {product.salePrice &&
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-maroon px-2.5 py-1 text-[11px] font-medium text-ivory">Sale</span>
        }
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-charcoal transition-[transform,background-color] duration-150 hover:bg-ivory active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-maroon">
          
          <HeartIcon className={`h-[18px] w-[18px] ${saved ? 'fill-maroon text-maroon' : ''}`} />
        </button>
      </div>

      <p className="mt-4 text-xs text-charcoal/60">{getCollectionTitle(product.collectionId)}</p>
      <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-charcoal">
        <button type="button" onClick={() => openProduct(product.id)} className="text-left transition-colors duration-150 hover:text-maroon">
          {product.name}
        </button>
      </h3>
      <p className="mt-1 text-sm leading-snug text-charcoal/70">{product.summary}</p>

      <div className="mt-auto pt-4">
        <PriceTag product={product} />
        <button
          type="button"
          onClick={() => addToCart(product.id)}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-charcoal px-4 py-2.5 text-sm font-medium text-ivory transition-[transform,background-color] duration-150 hover:bg-maroon active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon">
          
          <ShoppingBagIcon className="h-4 w-4" />
          Add to bag
        </button>
      </div>
    </article>);

}