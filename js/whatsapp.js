/* GlowKart WhatsApp Helper & Pre-Formatter */

const GLOWKART_WHATSAPP_NUMBER = "919561762651"; // Direct store owner contact (+91 9561762651)

function buildWhatsAppOrderUrl(order) {
  let itemsText = "";
  if (order.items && Array.isArray(order.items)) {
    order.items.forEach((item, index) => {
      const shadeInfo = item.shade ? ` (${item.shade})` : "";
      itemsText += `${index + 1}. ${item.productName || 'Item'}${shadeInfo} — Qty ${item.qty || 1} — ₹${(item.price || 0) * (item.qty || 1)}\n`;
    });
  }

  const locationText = order.address && order.address.locationLink ? `📍 *Google Maps Location:* ${order.address.locationLink}\n` : '';

  const message = 
`🛍️ *GlowKart Order*
Order ID: *${order.orderId || 'GK-ORDER'}*

👤 *Customer Details:*
Name: ${order.address.fullName || 'Customer'}
WhatsApp: ${order.address.whatsapp || ''}

💅 *Products:*
${itemsText}Subtotal: ₹${order.totals.subtotal}
Delivery Charge: ₹${order.totals.deliveryFee} (${order.totals.deliveryFee === 0 ? 'FREE Delivery' : 'Shikrapur Local'})
*Total Amount: ₹${order.totals.total}*

📍 *Delivery Address:*
House/Flat: ${order.address.house || ''}
Area/Street: ${order.address.area || ''}
Landmark: ${order.address.landmark || 'N/A'}
Pincode: ${order.address.pincode || '412208'} (Shikrapur)
${locationText}
📝 *Order Notes:*
${order.orderNotes || 'None'}

Please confirm my order & send UPI payment details. Thank you! 💕`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${GLOWKART_WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

function buildProductRequestUrl(productQuery) {
  const message = 
`Hi GlowKart! ✨

I am looking for this beauty product:
*"${productQuery}"*

Could you please check if it is available for delivery in Shikrapur? Thank you!`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${GLOWKART_WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

function buildSupportWhatsAppUrl() {
  const message = `Hi GlowKart Team! I need help with my beauty order in Shikrapur. 💕`;
  return `https://wa.me/${GLOWKART_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function launchWhatsAppUrl(url) {
  if (!url) return;
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Direct link click failed:", err);
  }

  setTimeout(() => {
    window.location.href = url;
  }, 150);
}
