/* GlowKart WhatsApp Helper & Pre-Formatter */

const GLOWKART_WHATSAPP_NUMBER = "919561762651"; // Direct store owner contact (+91 9561762651)

function buildWhatsAppOrderUrl(order) {
  let itemsText = "";
  order.items.forEach((item, index) => {
    const shadeInfo = item.shade ? ` (${item.shade})` : "";
    itemsText += `${index + 1}. ${item.productName}${shadeInfo} — Qty ${item.qty} — ₹${item.price * item.qty}\n`;
  });

  const locationText = order.address.locationLink ? `📍 *Google Maps Location:* ${order.address.locationLink}\n` : '';

  const message = 
`🛍️ *GlowKart Order*
Order ID: *${order.orderId}*

👤 *Customer Details:*
Name: ${order.address.fullName}
WhatsApp: ${order.address.whatsapp}

💅 *Products:*
${itemsText}
Subtotal: ₹${order.totals.subtotal}
Delivery Charge: ₹${order.totals.deliveryFee} (${order.totals.deliveryFee === 0 ? 'FREE Delivery' : 'Shikrapur Local'})
*Total Amount: ₹${order.totals.total}*

📍 *Delivery Address:*
House/Flat: ${order.address.house}
Area/Street: ${order.address.area}
Landmark: ${order.address.landmark || 'N/A'}
Pincode: ${order.address.pincode || '412208'} (Shikrapur)
${locationText}
📝 *Order Notes:*
${order.orderNotes || 'None'}

Please confirm my order & send UPI payment details. Thank you! 💕`;

  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${GLOWKART_WHATSAPP_NUMBER}&text=${encodedMessage}`;
}

function buildProductRequestUrl(productQuery) {
  const message = 
`Hi GlowKart! ✨

I am looking for this beauty product:
*"${productQuery}"*

Could you please check if it is available for delivery in Shikrapur? Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${GLOWKART_WHATSAPP_NUMBER}&text=${encodedMessage}`;
}

function buildSupportWhatsAppUrl() {
  const message = `Hi GlowKart Team! I need help with my beauty order in Shikrapur. 💕`;
  return `https://api.whatsapp.com/send?phone=${GLOWKART_WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
}
