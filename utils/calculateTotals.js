const DELIVERY_FEE = 1500;
const FREE_DELIVERY_FROM = 50000;

function calculateTotals(cartItems, options = {}) {
    const subtotal = cartItems.reduce((sum, item) => {
        const price = Number(item.price != null ? item.price : item.product && item.product.price) || 0;
        return sum + price * (Number(item.quantity) || 0);
    }, 0);

    const deliveryCharges = options.deliveryCharges != null
        ? Number(options.deliveryCharges)
        : (subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE);

    let discount = 0;
    if (options.discountPercent) discount = subtotal * (Number(options.discountPercent) / 100);
    else if (options.discountAmount) discount = Number(options.discountAmount);

    const total = Math.max(0, subtotal + deliveryCharges - discount);
    return { subtotal, deliveryCharges, discount, total };
}

module.exports = calculateTotals;
module.exports.DELIVERY_FEE = DELIVERY_FEE;
module.exports.FREE_DELIVERY_FROM = FREE_DELIVERY_FROM;
