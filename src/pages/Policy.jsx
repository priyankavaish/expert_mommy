import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { CONTACT_PHONE, customUrl } from '../data/whatsapp'

const EMAIL = 'expertmommy6199@gmail.com'
const UPDATED = '25 November 2026'

const Contact = () => <p>WhatsApp: <a href={customUrl} target="_blank" rel="noopener noreferrer">{CONTACT_PHONE}</a><br />Email: <a href={'mailto:' + EMAIL}>{EMAIL}</a></p>

export const POLICIES = {
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    description: 'Terms for browsing Expert Mommy and ordering handmade knitted and crochet pieces through WhatsApp.',
    sections: [
      ['About us', <p>Expert Mommy is a small handmade business in India. Every hand-knitted and crochet piece is made by Pushpa Rani. By using this website or placing an order with us, you agree to these terms.</p>],
      ['How orders work', <>
        <p>This website is a catalogue. It does not take payments or place orders automatically. When you send an enquiry on WhatsApp, we confirm availability, measurements, delivery charges and payment details with you in the chat.</p>
        <p>An order is confirmed only after we confirm it on WhatsApp and receive your payment. Sending an enquiry or adding a piece to your enquiry list does not reserve it.</p>
      </>],
      ['Products, photos and sizes', <>
        <p>Each ready-made piece is one of a kind, with a quantity of 1. Because every item is made by hand, small differences in stitches, size and finish are part of its character and are not defects.</p>
        <p>Colours may look slightly different on your screen. Ages shown are approximate; please confirm chest, length and sleeve measurements with us before ordering.</p>
      </>],
      ['Prices and payment', <p>Prices are listed in Indian Rupees (₹). Delivery charges of ₹149 are added to every order. We may change prices on the website at any time, but the price we confirm with you on WhatsApp is the price you pay.</p>],
      ['Custom orders', <p>For custom orders we agree the design, colours, size, price and making time with you before we start. Making times are estimates, as each piece is made by hand. Once work has started, a custom order cannot be cancelled.</p>],
      ['Delivery', <p>We ship within India for a flat delivery charge of ₹149 per order. Delivery time depends on your location and is shared before you pay. We are not responsible for delays caused by the courier, but we will help you track your parcel.</p>],
      ['Returns', <p>We do not accept returns or exchanges. Any claim for a damaged or wrong item must include a complete, uncut unboxing video; without it, the claim will not be accepted. Please read our <Link to="/return-policy">No Return Policy</Link> for details.</p>],
      ['Use of this website', <p>All photos, text and designs on this website belong to Expert Mommy. Please do not copy or reuse them without our permission.</p>],
      ['Liability', <p>To the extent allowed by law, our total liability for any order is limited to the amount you paid for that order.</p>],
      ['Governing law', <p>These terms are governed by the laws of India. Any disputes are subject to the jurisdiction of the courts in India.</p>],
      ['Changes to these terms', <p>We may update these terms from time to time. The latest version is always on this page.</p>],
      ['Contact us', <Contact />],
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'How Expert Mommy collects, uses and protects your personal information.',
    sections: [
      ['Overview', <p>Expert Mommy respects your privacy. This policy explains what information we collect, why, and how we look after it.</p>],
      ['Information we collect', <>
        <p><strong>When you message us on WhatsApp or email:</strong> your name, phone number, delivery address, the measurements you share, and your messages. We need these to answer your enquiry and deliver your order.</p>
        <p><strong>When you report a problem with an order:</strong> the unboxing video and photos you send. We use them only to check your claim, as an uncut unboxing video is required for any return, replacement or refund request (see our <Link to="/return-policy">No Return Policy</Link>).</p>
        <p><strong>When you browse the website:</strong> we do not ask you to create an account and we do not take card or bank details on this website. Your enquiry list is saved only in your own browser.</p>
        <p><strong>Technical data:</strong> our hosting provider (Cloudflare) processes basic technical information, such as your IP address and browser type, to deliver the website securely.</p>
      </>],
      ['How we use your information', <ul>
        <li>To answer your enquiries and confirm orders</li>
        <li>To arrange payment and delivery</li>
        <li>To make custom pieces to your measurements</li>
        <li>To keep the website secure and working</li>
      </ul>],
      ['Sharing your information', <p>We do not sell or rent your personal information. We share your name, phone number and address with a courier only to deliver your order. WhatsApp, payment apps and Cloudflare process data under their own privacy policies.</p>],
      ['Cookies and browser storage', <p>We do not use advertising or tracking cookies. Your browser stores your enquiry list locally. Fonts are loaded from Google Fonts, which may receive your IP address.</p>],
      ['How long we keep it', <p>We keep order details only as long as needed to complete your order and meet legal or accounting requirements.</p>],
      ['Your choices', <p>You can ask us to see, correct or delete the personal information we hold about you by contacting us below.</p>],
      ["Children's privacy", <p>Our products are made for children, but this website is meant for parents and adults. We do not knowingly collect information from children.</p>],
      ['Changes to this policy', <p>We may update this policy from time to time. The latest version is always on this page.</p>],
      ['Contact us', <Contact />],
    ],
  },
  'return-policy': {
    title: 'No Return Policy',
    description: 'Expert Mommy does not accept returns or exchanges on handmade pieces. An uncut unboxing video is required for any damaged or wrong item claim.',
    sections: [
      ['All sales are final', <>
        <p>Every Expert Mommy piece is handmade and one of a kind. For this reason, <strong>we do not accept returns or exchanges</strong>, and we do not give refunds for change of mind, size or colour preference.</p>
        <p>Please check the photos and confirm the measurements with us on WhatsApp before you pay. We are always happy to answer questions and send extra photos.</p>
      </>],
      ['Custom orders', <p>Custom pieces are made especially for you, so they cannot be returned, exchanged or cancelled once work has started.</p>],
      ['Unboxing video is required', <>
        <p>Please record a <strong>clear, uncut video while opening your parcel</strong>, starting from the sealed package and showing the product clearly.</p>
        <p><strong>Without a complete unboxing video, we cannot accept any return, replacement or refund request</strong>, including claims of a damaged, missing or wrong item.</p>
      </>],
      ['Damaged or wrong item', <>
        <p>If your parcel arrives damaged, or you receive a different item from the one you ordered, please tell us on WhatsApp <strong>within 48 hours of delivery</strong>. Send the unboxing video along with photos of the item and the packaging.</p>
        <p>After checking the video, we will repair the piece, send a replacement where possible, or refund you. Refunds are made to your original payment method.</p>
      </>],
      ['Cancellations', <p>You can cancel a ready-made order before we dispatch it. Once your parcel has been dispatched, the order cannot be cancelled.</p>],
      ['Contact us', <Contact />],
    ],
  },
}

export default function Policy({ slug }) {
  const policy = POLICIES[slug]
  return (
    <main className="atelier container policy-page">
      <Seo title={policy.title} description={policy.description} />
      <div className="atelier-breadcrumb"><Link to="/">Home</Link> / <span>{policy.title}</span></div>
      <h1>{policy.title}</h1>
      <p className="policy-updated">Last updated: {UPDATED}</p>
      {policy.sections.map(([heading, body]) => (
        <section key={heading}>
          <h2>{heading}</h2>
          {body}
        </section>
      ))}
      <nav className="policy-links" aria-label="Policies">
        {Object.entries(POLICIES).filter(([key]) => key !== slug).map(([key, item]) => <Link key={key} to={'/' + key}>{item.title}</Link>)}
      </nav>
    </main>
  )
}
