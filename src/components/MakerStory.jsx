import { Instagram, Youtube } from 'lucide-react'
import { imageSlots } from '../data/siteImages'
import { useStore } from '../context/StoreContext'
import { SOCIAL_LINKS } from '../data/social'
import useReveal from '../hooks/useReveal'
import { Rich, useContent } from './Content'

export default function MakerStory() {
  const { state } = useStore()
  const t = useContent('maker')
  useReveal()
  return (
    <section className="maker-story reveal" id="about" aria-labelledby="maker-heading">
      <div className="container maker-story-grid">
        <figure className="maker-portrait">
          <div className="maker-photo-frame">
            <img
              src={state.siteImages?.maker || imageSlots.maker.src}
              alt={t('name') + ', the maker behind Expert Mommy'}
              loading="lazy"
              width="1089"
              height="1444"
            />
          </div>
          <figcaption className="maker-portrait-caption">
            <div><span className="handwritten"><Rich text={t('name')} /></span><span><Rich text={t('role')} /></span></div>
            <span className="maker-experience"><strong><Rich text={t('badgeNumber')} /></strong><span><Rich text={t('badgeText')} /></span></span>
          </figcaption>
        </figure>

        <div className="maker-copy">
          <span className="eyebrow"><Rich text={t('eyebrow')} /></span>
          <h2 id="maker-heading"><Rich text={t('title')} /></h2>
          <p className="maker-introduction"><Rich text={t('intro')} /></p>
          <p><Rich text={t('text1')} /></p>
          <p><Rich text={t('text2')} /></p>

          <div className="maker-milestones" aria-label="Knitting journey milestones">
            {[1, 2, 3].map(n => <div key={n}><strong><Rich text={t('stat' + n + 'Number')} /></strong><span><Rich text={t('stat' + n + 'Text')} /></span></div>)}
          </div>

          <div className="maker-connect">
            <span><Rich text={t('social')} /></span>
            <div className="maker-social-links">
              {SOCIAL_LINKS.map(social => {
                const Icon = social.id === 'instagram' ? Instagram : Youtube
                return (
                  <a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={'Expert Mommy on ' + social.name + ' (opens in a new tab)'}>
                    <Icon size={19} />
                    <span><strong>{social.name}</strong><small>{social.handle}</small></span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
