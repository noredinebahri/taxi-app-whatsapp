const authMiddleware = (req, res, next) => {
    const apiKey = process.env.API_SECRET_KEY;
    const apiKeyHeader = req.headers['x-api-key'];

    if (!apiKeyHeader || apiKeyHeader !== apiKey) {
        return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }

    next();
};

export default authMiddleware;