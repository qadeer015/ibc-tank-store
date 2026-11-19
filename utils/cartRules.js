function cartKey(user, sessionId) {
    if (user && user.id) {
        return { key: `user:${user.id}`, userId: user.id };
    }
    return { key: `guest:${sessionId}`, userId: null };
}

function addQuantity(current, requested, stock) {
    const add = Number(requested);
    const available = Number(stock);
    if (!Number.isInteger(add) || add < 1) {
        return { ok: false, error: 'Quantity must be at least 1.' };
    }
    if (!Number.isInteger(available) || available < 1) {
        return { ok: false, error: 'This product is out of stock.' };
    }
    const next = Number(current || 0) + add;
    if (next > available) {
        return { ok: false, error: `Only ${available} available.` };
    }
    return { ok: true, quantity: next };
}

function setQuantity(requested, stock) {
    const qty = Number(requested);
    const available = Number(stock);
    if (!Number.isInteger(qty)) {
        return { ok: false, error: 'Enter a whole number.' };
    }
    if (qty <= 0) {
        return { ok: true, remove: true, quantity: 0 };
    }
    if (!Number.isInteger(available) || qty > available) {
        return { ok: false, error: `Only ${Math.max(available || 0, 0)} available.` };
    }
    return { ok: true, remove: false, quantity: qty };
}

module.exports = { cartKey, addQuantity, setQuantity };
