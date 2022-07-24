import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import * as message from '../messages/messages.js';
import RefreshToken from '../models/RefreshToken.js';

export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) return res.status(400).json({error: true, message: message.USER_EXISTS});

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({message: message.USER_CREATED});

    } catch(error) {
        console.log(error);
        res.status(500).json({error: true, message: message.ERR_OCCURRED});
    }

}

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {

        const user = await User.findOne({email});

        if (!user) return res.status(404).json({error: true, message: message.USER_NOT_FOUND});

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({error: true, message: message.INVALID_CRED});

        const token = jwt.sign({
            name: user.name,
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, {expiresIn: process.env.TOKEN_LIFE});
        
        const refeshToken = jwt.sign({
            name: user.name, 
            id: user._id,
            email: user.email
        }, process.env.JWT_SECRET, {expiresIn: process.env.REFRESH_LIFE})

        res.status(200).json({message: message.LOGIN_SUCCESS, token, refeshToken});

    } catch(error) {
        console.log(error);
        res.status(500).json({error: true, message: message.ERR_OCCURRED});
    }
}

export const updateToken = async (req, res) => {
    const {refreshToken, id} = req.body;

    try {
        if (refreshToken){
            const isTokenExists = await RefreshToken.findOne({refreshToken, userId: id});
            if (!isTokenExists) return res.status(404).json({error: true, message: message.INVALID_REF_TOKEN})

            const user = await User.findOne({_id: id});
            if (!user) return res.status(404).json({error: true, message: USER_NOT_FOUND});

            const token = jwt.sign({
                name: user.name,
                id: user._id,
                email: user.email
            }, process.env.JWT_SECRET, {expiresIn: process.env.TOKEN_LIFE});
            
            isTokenExists[token] = token;
            res.status(200).json({message: message.UPDATE_TOKEN, token});
        } else {
            res.status(403).json({error: true, message: message.NO_TOKEN});
        }

    } catch(error) {
        console.log(error);
        res.status(500).json({error: true, message: message.ERR_OCCURRED});
    }
}