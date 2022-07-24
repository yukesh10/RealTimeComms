import Friends from "../models/Friends.js";
import { ERR_OCCURRED, FRIEND_NOT_FOUND, INVALID_REQ, FRIEND_DELETE_SUCCESS} from "../messages/messages.js";

export const addFriend = async (req, res) => {

    const {email} = req.body;

    try {

        if (!req.decoded) return res.status(401).json({error: true, message: INVALID_REQ});

        const {id} = req.decoded;

        const friend = await Friends.findOne({email});
        if (!friend) return res.status(404).json({error: true, message: FRIEND_NOT_FOUND});

        await Friends.create({
            userId: id,
            friendId: friend._id
        });

        return res.status(200).json({message: FRIEND_ADDED});

    } catch(err) {
        console.log(err);
        return res.status(500).json({error: true, message: ERR_OCCURRED});
    }
}

export const deleteFriend = async (req, res) => {
    const {id} = req.query;

    try {

        if (!req.decoded) return res.status(401).json({error: true, message: INVALID_REQ});
        const {id} = req.decoded;

        const friend = await Friends.findOne({_id: id});
        if (!friend) return res.status(404).json({error: true, message: FRIEND_NOT_FOUND});

        await Friends.deleteOne({userId: id, friendId: friend._id});

        return res.status(200).json({message: FRIEND_DELETE_SUCCESS});

    } catch(error) {
        console.log(error);
        return res.status(500).json({error: true, message: ERR_OCCURRED});
    }
}

export const getFriends = async (req, res) => {

}