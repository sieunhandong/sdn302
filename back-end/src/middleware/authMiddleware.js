const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config();
const authAdminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(403).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        const { payload } = user
        if (payload?.role === "ADMIN") {
            next();
        } else {
            return res.status(403).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
    })
}
const authHRMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(403).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        const { payload } = user
        if (payload?.role === "HR") {
            next();
        } else {
            return res.status(403).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
    })
}
const authMentorMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(403).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        const { payload } = user
        if (payload?.role === "MENTOR") {
            req.user = { payload }
            next();
        } else {
            return res.status(403).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
    })
}
const authInternMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No token provided',
            status: 'ERROR'
        });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(403).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        const { payload } = user
        if (payload?.role === "INTERN") {
            next();
        } else {
            return res.status(403).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
    })
}

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
        const { payload } = user
        if (payload?.isAdmin || payload?.id === userId) {
            next();
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR'
            })
        }
    })
}

module.exports = {
    authAdminMiddleware,
    authHRMiddleware,
    authInternMiddleware,
    authMentorMiddleware,
    authUserMiddleware
}