import jwt from 'jsonwebtoken';
import { INVALID_ACCESS_TOKEN, NO_TOKEN } from '../messages/messages.js';

const tokenChecker = (req, res, next) => {

    const token = req.headers['x-access-token'];
    
    if (token){
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                console.log(error);
                return res.status(401).json({error: true, message: INVALID_ACCESS_TOKEN});
            }
            req.decoded = decoded;
            next();
        })

    } else {
        return res.status(403).json({error: true, message: NO_TOKEN});
    }

}

export default tokenChecker;