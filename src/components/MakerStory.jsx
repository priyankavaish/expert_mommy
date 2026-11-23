import { Instagram, Youtube } from 'lucide-react'
import { imageSlots } from '../data/siteImages'
import { useStore } from '../context/StoreContext'
import { SOCIAL_LINKS } from '../data/social'
import useReveal from '../hooks/useReveal'

export default function MakerStory() {
  const { state } = useStore()
  useReveal()
  return (
    <section className="maker-story reveal" id="about" aria-labelledby="maker-heading">
      <div className="container maker-story-grid">
        <figure className="maker-portrait">
          <div className="maker-photo-frame">
            <img
              src={state.siteImages?.maker || imageSlots.maker.src}
              alt="Pushpa Rani, the maker behind Expert Mommy, wearing a floral sari"
              loading="lazy"
              width="1089"
              height="1444"
            />
          </div>
          <figcaption className="maker-portrait-caption">
            <div><span className="handwritten">Pushpa Rani</span><span>The hands behind Expert Mommy</span></div>
            <span className="maker-experience"><strong>44</strong><span>years of<br />handmade love</span></span>
          </figcaption>
        </figure>

        <div className="maker-copy">
          <span className="eyebrow">MEET THE HEART BEHIND EXPERT MOMMY</span>
          <h2 id="maker-heading">Her hands.<br />Her heart.<br /><em>Your little piece of warmth.</em></h2>
          <p className="maker-introduction">Meet <strong>Pushpa Rani</strong>, the woman who makes every single piece at Expert Mommy.</p>
          <p>She began knitting sweaters at just 14. Today, at 58, she brings 44 years of practice, patience and love to a craft that has been part of her life since childhood.</p>
          <p>Every hand-knitted sweater and crochet creation you see here is made by Pushpa Rani herself, stitch by stitch. Expert Mommy is her love for handmade, shared with you through pieces that are as personal as the hands that make them.</p>

          <div className="maker-milestones" aria-label="Pushpa Rani's knitting journey">
            <div><strong>14</strong><span>the age she<br />started knitting</span></div>
            <div><strong>44</strong><span>years of knitting<br />experience</span></div>
            <div><strong>1</strong><span>maker behind<br />every piece</span></div>
          </div>

          <div className="maker-connect">
            <span>Follow her handmade journey</span>
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
