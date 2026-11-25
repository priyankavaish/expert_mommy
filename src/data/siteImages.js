import { logoImg, categoryBag, categoryHat, categoryToy } from '../assets/images'
import { SWEATER_GROUPS } from '../assets/products'
import maker from '../assets/maker/pushpa-rani-portrait.png'

const instagramFiles = import.meta.glob('../assets/instagram/post-*.jpg', { eager: true, import: 'default' })

export const imageSlots = {
  logo: { label: 'Website and login logo', src: logoImg, alt: 'Expert Mommy' },
  homeHero: { label: 'Home banner', src: SWEATER_GROUPS.patchworkCream[0], alt: 'Handmade cream sweater with colourful flowers' },
  shopHero: { label: 'Shop banner' },
  maker: { label: 'Maker portrait', src: maker, alt: 'Pushpa Rani, the maker behind Expert Mommy' },
  custom: { label: 'Custom orders photo', src: SWEATER_GROUPS.mustardRuffle[0], alt: 'Handmade yellow ruffle sweater' },
  ...Object.fromEntries(Array.from({ length: 8 }, (_, i) => {
    const label = 'Instagram photo ' + (i + 1)
    return ['instagram' + i, { label, alt: label, src: instagramFiles['../assets/instagram/post-' + (i + 1) + '.jpg'] }]
  })),
}

export const defaultGallery = [
  { src: categoryBag, label: 'Crochet bags' },
  { src: categoryToy, label: 'Crochet toys' },
  { src: categoryHat, label: 'Handmade caps' },
]
