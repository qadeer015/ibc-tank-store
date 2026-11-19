function digits(value) {
    return String(value || '').replace(/\D/g, '');
}

function phonesMatch(stored, given) {
    const storedDigits = digits(stored);
    const givenDigits = digits(given);
    if (givenDigits.length < 10 || storedDigits.length < 10) return false;
    return storedDigits.slice(-10) === givenDigits.slice(-10);
}

function readOrderInput(body = {}) {
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const addressLine1 = typeof body.addressLine1 === 'string' ? body.addressLine1.trim() : '';
    const addressLine2 = typeof body.addressLine2 === 'string' ? body.addressLine2.trim() : '';
    const city = typeof body.city === 'string' ? body.city.trim() : '';
    const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
    const paymentMethod = body.paymentMethod === 'bank_transfer' ? 'bank_transfer' : body.paymentMethod === 'cod' ? 'cod' : '';
    const errors = [];

    if (fullName.length < 2 || fullName.length > 255) errors.push('Enter the recipient name.');
    if (digits(phone).length < 10 || phone.length > 32) errors.push('Enter a phone number with at least 10 digits.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Enter a valid email or leave it blank.');
    if (addressLine1.length < 5 || addressLine1.length > 255) errors.push('Enter the delivery address.');
    if (!city || city.length > 100) errors.push('Enter the city.');
    if (!paymentMethod) errors.push('Choose cash on delivery or bank transfer.');
    if (notes.length > 1000) errors.push('Notes must be 1000 characters or fewer.');

    return {
        errors,
        value: { fullName, phone, email: email || null, addressLine1, addressLine2: addressLine2 || null, city, notes: notes || null, paymentMethod },
    };
}

module.exports = { digits, phonesMatch, readOrderInput };
