function getproductImages(product) {
    let productImages = [];
    if (product.image) {
        // Check if it's a JSON array
        if (product.image.trim().startsWith('[')) {
            try {
                const parsed = JSON.parse(product.image);
                if (Array.isArray(parsed)) {
                    productImages = parsed;
                } else if (typeof parsed === 'string') {
                    productImages = [parsed];
                }
            } catch (err) {
                // If JSON parse fails, treat as single string
                productImages = [product.image];
            }
        } else {
            // Plain string (old format), treat as single image
            productImages = [product.image];
        }
    }

    return productImages;
}

module.exports = { getproductImages };