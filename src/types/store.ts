export type CollectionId = 'idols' | 'pooja' | 'accessories' | 'gifts';

export type Collection = {
  id: CollectionId;
  title: string;
  description: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  collectionId: CollectionId;
  price: number;
  salePrice?: number;
  image: string;
  summary: string;
  description: string;
  details: string[];
  featured: boolean;
};

export type CartLine = {
  productId: string;
  quantity: number;
};

export type ShopFilter = 'featured' | 'all' | CollectionId;