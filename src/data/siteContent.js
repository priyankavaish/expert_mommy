// Every editable storefront text, grouped by page section.
// Formatting in values: a new line becomes a line break, *text* is italic and **text** is bold.
const text = (label, value, long = false) => ({ label, value, long })

export const contentSections = [
  {
    id: 'header', title: 'Header & logo', page: 'All pages', images: ['logo'],
    fields: {
      announcement: text('Announcement bar', 'A little warmth, a lot of love.'),
      announcementNote: text('Announcement bar (small text)', '100% handmade · ₹149 delivery across India · Custom orders welcome'),
      chatButton: text('Header chat button', "Let's chat"),
    },
  },
  {
    id: 'homeHero', title: 'Home banner', page: 'Home', images: ['homeHero'],
    fields: {
      eyebrow: text('Small heading', 'FROM HER HANDS TO YOUR HEART'),
      title: text('Main heading', 'Little stitches.\nBig *warm hugs.*', true),
      text: text('Description', 'Hand-knitted & crochet sweaters with a little personality and a whole lot of love. Thoughtfully handmade, one beautiful piece at a time.', true),
      primaryButton: text('Main button', 'Find your favourite'),
      secondaryLink: text('Second link', 'Made just for you'),
      note: text('Note under buttons', 'Always handmade. Never ordinary.'),
      handwriting: text('Handwritten line on photo', 'a hug you can wear'),
      seal: text('Round seal', 'made with\n*love & care*', true),
      caption: text('Photo caption', 'THE FLOWER PATCH SWEATER'),
      captionSub: text('Photo caption (small)', 'HANDMADE BY EXPERT MOMMY'),
    },
  },
  {
    id: 'homeValues', title: 'Home highlights strip', page: 'Home', images: [],
    fields: {
      value1: text('Highlight 1', '100% handmade'),
      value2: text('Highlight 2', 'Hand knitted & crochet'),
      value3: text('Highlight 3', 'Just one of each'),
      value4: text('Highlight 4', '₹149 delivery · Order on WhatsApp'),
    },
  },
  {
    id: 'homeFeatured', title: 'Home featured products', page: 'Home', images: [],
    fields: {
      eyebrow: text('Small heading', 'SMALL COLLECTION. SO MUCH LOVE.'),
      title: text('Heading', 'Meet your next cosy favourite.'),
      link: text('Heading link', 'Explore all products'),
      intro: text('Description', 'Real handmade pieces, ready for a new home. Only one of each is available.', true),
      button: text('Bottom button', 'View more sweaters'),
    },
  },
  {
    id: 'gallery', title: 'Handmade gallery', page: 'Home', images: [], gallery: true,
    fields: {
      title: text('Heading', 'From tiny shoes to *treasured keepsakes.*', true),
      text1: text('Paragraph 1', 'Alongside our cosy sweaters, we crochet bags for little adventures, flower clips and gajras for your hair, soft toys to hug, and keepsake boxes for the things you love. We make caps and tiny shoes, too.', true),
      text2: text('Paragraph 2', "Have a colour, a gift, or a design in mind? Tell us what you'd love to have made.", true),
      button: text('Button', 'Discuss a custom order'),
    },
  },
  {
    id: 'maker', title: 'Our story (maker)', page: 'Home', images: ['maker'],
    fields: {
      eyebrow: text('Small heading', 'MEET THE HEART BEHIND EXPERT MOMMY'),
      title: text('Heading', 'Her hands.\nHer heart.\n*Your little piece of warmth.*', true),
      intro: text('Introduction', 'Meet **Pushpa Rani**, the woman who makes every single piece at Expert Mommy.', true),
      text1: text('Paragraph 1', 'She began knitting sweaters at just 14. Today, at 58, she brings 44 years of practice, patience and love to a craft that has been part of her life since childhood.', true),
      text2: text('Paragraph 2', 'Every hand-knitted sweater and crochet creation you see here is made by Pushpa Rani herself, stitch by stitch. Expert Mommy is her love for handmade, shared with you through pieces that are as personal as the hands that make them.', true),
      name: text('Name on photo', 'Pushpa Rani'),
      role: text('Role on photo', 'The hands behind Expert Mommy'),
      badgeNumber: text('Photo badge number', '44'),
      badgeText: text('Photo badge text', 'years of\nhandmade love', true),
      stat1Number: text('Milestone 1 number', '14'),
      stat1Text: text('Milestone 1 text', 'the age she\nstarted knitting', true),
      stat2Number: text('Milestone 2 number', '44'),
      stat2Text: text('Milestone 2 text', 'years of knitting\nexperience', true),
      stat3Number: text('Milestone 3 number', '1'),
      stat3Text: text('Milestone 3 text', 'maker behind\nevery piece', true),
      social: text('Social links heading', 'Follow her handmade journey'),
    },
  },
  {
    id: 'custom', title: 'Custom orders', page: 'Home', images: ['custom'],
    fields: {
      eyebrow: text('Small heading', 'YOUR IDEA. OUR HANDMADE TOUCH.'),
      title: text('Heading', 'A sweater with\n*your story in it.*', true),
      text: text('Description', "A favourite colour, a special size, or a design you've been dreaming of? We take custom orders. Share your inspiration and we'll discuss what we can make, the price and the making time.", true),
      button: text('Button', "Let's make something special"),
      handwriting: text('Handwritten line on photo', 'a little more you ♥'),
    },
  },
  {
    id: 'how', title: 'How to order', page: 'Home', images: [],
    fields: {
      eyebrow: text('Small heading', 'A PERSONAL TOUCH, FROM START TO FINISH'),
      title: text('Heading', 'Your favourite is just a chat away.'),
      step1Title: text('Step 1 title', 'Find your sweater'),
      step1Text: text('Step 1 text', 'Browse the collection and take a closer look at all the photos.', true),
      step2Title: text('Step 2 title', 'Say hello on WhatsApp'),
      step2Text: text('Step 2 text', 'Send an enquiry. We’ll help confirm availability and measurements. Delivery is a flat ₹149 across India.', true),
      step3Title: text('Step 3 title', 'Make it yours'),
      step3Text: text('Step 3 text', 'Confirm the details and payment with us in the chat. Then we’ll arrange your order.', true),
      note: text('Note', 'Each ready-made sweater has a quantity of 1. An enquiry does not reserve a piece; we confirm your order personally on WhatsApp.', true),
    },
  },
  {
    id: 'instagram', title: 'Instagram', page: 'Home', images: Array.from({ length: 8 }, (_, i) => 'instagram' + i),
    fields: {
      eyebrow: text('Small heading', 'FROM OUR INSTAGRAM'),
      title: text('Heading', 'Little moments.\n*Lots of handmade love.*', true),
      text: text('Description', 'A peek at the creations and celebrations shared by Expert Mommy.', true),
      footer: text('Bottom link', 'See more on Instagram'),
    },
  },
  {
    id: 'shop', title: 'Our Products page', page: 'Our Products', images: ['shopHero'],
    fields: {
      eyebrow: text('Banner small heading', 'THE HANDMADE EDIT'),
      title: text('Banner heading', 'A little collection.\n*A whole lot of warmth.*', true),
      text: text('Banner description', 'Hand-knitted & crochet sweaters, each made with love.\nOne piece per design. Find the one that feels like you.', true),
      countNote: text('Note next to product count', 'Just 1 of each · ₹149 delivery across India · Confirm measurements on WhatsApp', true),
      customEyebrow: text('Custom box small heading', 'DREAMING OF SOMETHING DIFFERENT?'),
      customTitle: text('Custom box heading', 'We take custom orders, too.'),
      customText: text('Custom box text', "Tell us your colour, size and design ideas. We'll take it from there.", true),
      customButton: text('Custom box button', 'Discuss your idea'),
    },
  },
  {
    id: 'footer', title: 'Footer', page: 'All pages', images: [],
    fields: {
      tagline: text('Tagline under name', 'little stitches. lasting love.'),
      about: text('About text', 'Hand-knitted and crochet sweaters, made by Pushpa Rani with 44 years of knitting experience. One special piece at a time.', true),
      linksTitle: text('Links column heading', 'Take a little look'),
      customTitle: text('Custom column heading', 'Made just for you'),
      customText: text('Custom column text', 'Have a colour or design in mind? We welcome custom orders.', true),
      customLink: text('Custom column link', 'Discuss a custom order'),
      contactTitle: text('Contact column heading', 'Say hello'),
      email: text('Email address', 'expertmommy6199@gmail.com'),
      contactNote: text('Contact column note', 'Delivery: flat ₹149 across India. Availability, sizing and payment are confirmed on WhatsApp.', true),
    },
  },
]

export const defaultContent = Object.fromEntries(contentSections.flatMap(section =>
  Object.entries(section.fields).map(([key, field]) => [section.id + '.' + key, field.value])))
