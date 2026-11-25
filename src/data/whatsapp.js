export const CONTACT_PHONE = '+91 79918 28898'
export const WHATSAPP_NUMBER = CONTACT_PHONE.replace(/[^0-9]/g, '')
export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
export const DELIVERY_CHARGE = 149
export const DELIVERY_TEXT = '₹' + DELIVERY_CHARGE + ' delivery charges across India'
export const whatsappUrl = message => 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message)
export const customUrl = whatsappUrl("Hi Expert Mommy! I'd like a custom handmade sweater. Can we discuss the design, colour, measurements, price and making time?")
export function productUrl(product) {
  return whatsappUrl("Hi Expert Mommy! I'm interested in " + product.name + " (" + product.sku + "), listed at " + money(product.price) + " + " + money(DELIVERY_CHARGE) + " delivery.\n" + window.location.origin + "/product/" + product.id + "\nPlease confirm availability and measurements. Quantity: 1.")
}
