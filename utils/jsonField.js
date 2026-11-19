// Parse JSON columns that may arrive as objects, JSON strings, or double-encoded strings.
function parseJsonField(value) {
    if (value == null || value === '' || value === 'null') return {};

    let current = value;
    for (let depth = 0; depth < 3 && typeof current === 'string'; depth += 1) {
        const trimmed = current.trim();
        if (!trimmed) return {};
        try {
            current = JSON.parse(trimmed);
        } catch {
            return {};
        }
    }

    if (current && typeof current === 'object' && !Array.isArray(current)) {
        return current;
    }

    return {};
}

module.exports = { parseJsonField };
