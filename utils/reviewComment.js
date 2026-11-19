function cleanComment(input) {
    const authorName = typeof input.authorName === 'string' ? input.authorName.trim() : '';
    const email = typeof input.email === 'string' ? input.email.trim() : '';
    const body = typeof input.body === 'string' ? input.body.replace(/<[^>]*>/g, '').trim() : '';
    const errors = [];

    if (authorName.length < 2 || authorName.length > 100) {
        errors.push('Name must be between 2 and 100 characters.');
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Enter a valid email or leave it blank.');
    }
    if (email.length > 255) {
        errors.push('Email is too long.');
    }
    if (body.length < 2 || body.length > 1000) {
        errors.push('Comment must be between 2 and 1000 characters.');
    }

    return { errors, authorName, email: email || null, body };
}

module.exports = { cleanComment };
