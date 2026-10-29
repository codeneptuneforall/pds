import type { CinematicSection } from '../types/cinematic';

export const heroCopy = {
  eyebrow: 'PUSKARA DIVINITY STORE',
  headline: 'Bring the Divine Into Your Home.',
  body: 'Discover sacred idols, devotional treasures, and timeless expressions of faith, curated with reverence.',
  primary: { label: 'Explore Collections', target: 'collections' },
  secondary: { label: 'Discover Our Story', target: 'story' }
};

export const cinematicSections: CinematicSection[] = [
{
  id: 'face',
  tone: 'light',
  layout: 'right',
  blocks: [
  {
    eyebrow: 'THE DIVINE GAZE',
    headline: 'A Presence That Inspires Devotion.',
    body: 'Discover devotional forms inspired by the timeless grace and spiritual significance of Lord Murugan.',
    cta: { label: 'Explore Sacred Idols', action: { type: 'filter', collectionId: 'idols' } }
  }]

},
{
  id: 'jewels',
  tone: 'light',
  layout: 'split',
  blocks: [
  {
    eyebrow: 'THE ART OF DEVOTION',
    headline: 'Every Detail Tells a Story.',
    body: 'Intricate forms and layered ornaments celebrate the richness of traditional devotional artistry.'
  },
  {
    eyebrow: 'CRAFTED WITH CARE',
    headline: 'Tradition in Every Curve.',
    body: 'Explore devotional treasures inspired by sacred sculpture and enduring craftsmanship.'
  }]

},
{
  id: 'vel',
  tone: 'dark',
  layout: 'split',
  blocks: [
  {
    eyebrow: 'THE SACRED SYMBOL',
    headline: 'A Symbol of Divine Strength.',
    body: "Explore sacred forms inspired by the enduring symbolism of Lord Murugan's Vel."
  },
  {
    eyebrow: 'ROOTED IN TRADITION',
    headline: 'Faith, Courage, and Devotion.',
    body: 'Discover devotional treasures that celebrate a meaningful connection to spiritual heritage.'
  }]

},
{
  id: 'crown',
  tone: 'dark',
  layout: 'left',
  blocks: [
  {
    eyebrow: 'ROYAL DIVINITY',
    headline: 'A Timeless Expression of Grace.',
    body: 'Discover the beauty of sacred forms through carefully considered details and traditional visual language.'
  }]

},
{
  id: 'peacock',
  tone: 'dark',
  layout: 'left',
  blocks: [
  {
    eyebrow: 'INSPIRED BY DIVINITY',
    headline: 'Grace, Strength, and Sacred Tradition.',
    body: 'Explore devotional treasures inspired by the timeless symbolism and spiritual heritage associated with Lord Murugan.',
    cta: { label: 'Discover Sacred Collections', action: { type: 'scroll', target: 'collections' } }
  }]

}];