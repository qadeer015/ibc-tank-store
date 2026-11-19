function escapeLike(value) {
    return String(value).replace(/[\\%_]/g, (char) => `\\${char}`);
}

function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    }[char]));
}

function highlightText(text, query) {
    const safeText = escapeHtml(text);
    const term = String(query || '').trim();
    if (!term) return safeText;

    const safeTerm = escapeHtml(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safeText.replace(new RegExp(safeTerm, 'ig'), (match) => `<mark>${match}</mark>`);
}

function optionalNumber(value) {
    if (value === undefined || value === null || String(value).trim() === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

module.exports = { escapeLike, escapeHtml, highlightText, optionalNumber };
