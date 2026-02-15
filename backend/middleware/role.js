exports.roleMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  // Admin can access everything
  if (req.user.role === 'admin') {
    return next();
  }

  // Librarian can access librarian routes
  if (req.user.role === 'librarian') {
    return next();
  }

  // Student can access student routes
  if (req.user.role === 'student') {
    return next();
  }

  return res.status(403).json({ success: false, message: 'Access denied' });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Only admin can access this route' });
};

exports.isLibrarian = (req, res, next) => {
  if (req.user && (req.user.role === 'librarian' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Only librarian can access this route' });
};
