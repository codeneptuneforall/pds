import type { Product } from '../types/store';

/** Demo catalogue — replace names, prices, images, and details with real store data. */
export const products: Product[] = [
{
  id: 'murugan-idol',
  name: 'Colourful Murugan Idol',
  collectionId: 'idols',
  price: 4800,
  salePrice: 4200,
  image: "/82fea51f-523b-42a4-ac1e-0bdd617bd2f7.jpg",
  summary: 'Hand-painted idol with peacock and lotus base.',
  description: 'A joyful, colourful form of Lord Murugan holding the Vel, with his peacock beside him. Made to bring warmth to a home altar or reading corner.',
  details: ['Hand-painted finish', 'Approx. 30 cm tall (demo detail)', 'Peacock and lotus base included'],
  featured: true
},
{
  id: 'decorative-vel',
  name: 'Decorative Vel',
  collectionId: 'idols',
  price: 2650,
  image: "/103a5b15-1459-4b50-ac49-6d9d993c269d.jpg",
  summary: 'Brass Vel with leaf-shaped blade on a wooden stand.',
  description: 'A polished Vel with an ornate collar and leaf-shaped blade, mounted on a turned wooden base for the pooja room or entrance.',
  details: ['Brass with polished finish', 'Turned wooden stand', 'Approx. 45 cm tall (demo detail)'],
  featured: true
},
{
  id: 'pooja-diya',
  name: 'Traditional Pooja Diya',
  collectionId: 'pooja',
  price: 1250,
  image: "/4ccd4b2e-9694-4128-b059-4c0280c98cd6.jpg",
  summary: 'Petal-rimmed brass lamp for daily aarti.',
  description: 'A classic brass diya with a petal-shaped rim, sized for daily lighting and festival evenings.',
  details: ['Brass', 'Single wick', 'Wipe clean with a soft dry cloth'],
  featured: true
},
{
  id: 'gift-set',
  name: 'Devotional Gift Set',
  collectionId: 'gifts',
  price: 3400,
  salePrice: 2990,
  image: "/6d156fcb-416b-484f-a282-0060d24f2fa6.jpg",
  summary: 'Lamp, incense, kumkum box, and silk cloth in a keepsake box.',
  description: 'A ready-to-give set for festivals and housewarmings, presented in a maroon keepsake box with gold trim.',
  details: ['Small brass lamp', 'Incense sticks and kumkum box', 'Silk cloth and keepsake box'],
  featured: true
},
{
  id: 'rudraksha-mala',
  name: 'Rudraksha Mala',
  collectionId: 'accessories',
  price: 1800,
  image: "/55145aff-0cca-4f95-82b2-f0eb52254229.jpg",
  summary: 'Bead mala with silk tassel for japa.',
  description: 'A rudraksha mala finished with a silk tassel, for daily japa or as a quiet keepsake.',
  details: ['108 + 1 beads (demo detail)', 'Silk tassel', 'Store in a dry pouch'],
  featured: false
},
{
  id: 'vel-pendant',
  name: 'Vel Pendant',
  collectionId: 'accessories',
  price: 2400,
  image: "/c3a8d323-63fc-4a19-a7eb-fb070b77319c.jpg",
  summary: 'Gold-tone Vel pendant on a fine chain.',
  description: 'A small Vel pendant on a fine chain — a simple, everyday reminder of courage and devotion.',
  details: ['Gold-tone finish', 'Fine chain included', 'Pendant approx. 2.5 cm (demo detail)'],
  featured: false
},
{
  id: 'kuthu-vilakku',
  name: 'Peacock Kuthu Vilakku',
  collectionId: 'gifts',
  price: 5900,
  image: "/e6900d77-8f61-491b-8f74-7d8c93d7f967.jpg",
  summary: 'Five-wick brass lamp with peacock finial.',
  description: 'A tall traditional lamp crowned with a peacock, made for festival evenings and auspicious beginnings.',
  details: ['Brass', 'Five wicks', 'Approx. 50 cm tall (demo detail)'],
  featured: false
},
{
  id: 'sandalwood-incense',
  name: 'Sandalwood Incense Set',
  collectionId: 'pooja',
  price: 650,
  image: "/96c7a8f4-1fb2-4f20-9428-e0e81284b2f6.jpg",
  summary: 'Hand-tied incense with a brass holder.',
  description: 'Bundled sandalwood incense sticks with a small brass holder and wooden box.',
  details: ['Sandalwood fragrance', 'Brass holder', 'Wooden storage box'],
  featured: false
}];