function toNumberOrNull(value) {
    if (value === undefined || value === null || String(value).trim() === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : NaN;
}

function validateSaleAndMargin({ price, salePrice, marginPercent }) {
    const errors = [];
    const list = Number(price);

    if (!Number.isFinite(list) || list < 0) {
        errors.push('Price must be zero or greater.');
    }

    const sale = toNumberOrNull(salePrice);
    if (Number.isNaN(sale)) {
        errors.push('Sale price must be a number.');
    } else if (sale != null && sale < 0) {
        errors.push('Sale price must be zero or greater.');
    } else if (sale != null && Number.isFinite(list) && sale >= list) {
        errors.push('Sale price must be lower than the regular price.');
    }

    const margin = toNumberOrNull(marginPercent);
    if (Number.isNaN(margin)) {
        errors.push('Margin must be a number.');
    } else if (margin != null && (margin < 0 || margin > 100)) {
        errors.push('Margin must be between 0 and 100.');
    }

    return {
        errors,
        salePrice: Number.isNaN(sale) ? null : sale,
        marginPercent: Number.isNaN(margin) ? null : margin,
    };
}

function pricingFrom(product) {
    const list = Number(product && product.price) || 0;
    const sale = toNumberOrNull(product && product.sale_price);
    const onSale = sale != null && !Number.isNaN(sale) && sale >= 0 && list > 0 && sale < list;
    const current = onSale ? sale : list;
    const discountPercent = onSale ? Math.round((1 - current / list) * 100) : 0;
    const margin = toNumberOrNull(product && product.margin_percent);
    const marginPercent = margin != null && !Number.isNaN(margin) ? margin : null;
    const estimatedCost = marginPercent == null ? null : Math.round(current * (1 - marginPercent / 100) * 100) / 100;

    return { list, current, onSale, discountPercent, marginPercent, estimatedCost };
}

module.exports = { validateSaleAndMargin, pricingFrom };
