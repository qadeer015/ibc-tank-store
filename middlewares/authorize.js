// middlewares/authorize.js

const getRequestedResourceId = (req) => {
    return req.user?.id
        || null;
};

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.redirect('/auth/signin');
        }

        const userRole = String(req.user.role || 'customer').toLowerCase();
        console.log('Authorizing user with role:', userRole, 'against allowed roles:', allowedRoles);
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).render('error', {
                message: 'You do not have permission to access this page.',
                title: 'Access Denied',
                redirect_url: req.get('Referer') || '/'
            })
        }

        if (userRole === 'customer') {
            const requestedUserId = getRequestedResourceId(req);
            console.log('Requested resource ID:', requestedUserId);
            // If no specific resource is being requested, allow it
            if (requestedUserId === null) return next();

            const currentUserId = String(req.user.id || '');

            if (String(requestedUserId).toLowerCase() !== currentUserId.toLowerCase()) {
                return res.status(403).render('error', {
                    message: 'You do not have permission to access this page.',
                    title: 'Access Denied',
                    redirect_url: req.get('Referer') || '/'
                });
            }
        }

        next();
    };
};

const canAccessUser = (req, res, next) => {
    const requestedUserId = req.params.userId || req.body.user_id;
    const user = req.user;

    if (!requestedUserId) {
        return next();
    }

    if (user.role === 'admin') return next();
    if ((user.role === 'customer') && String(user.id) === String(requestedUserId)) return next();

    return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot access this resource.'
    });
};

module.exports = {
    authorize,
    canAccessUser
};