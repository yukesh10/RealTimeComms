import mongoose from "mongoose";

const FriendsSchema = new mongoose.Schema({
    userId: {type: 'String', required: true},
    friendId: {type: 'String', required: true}
})

export default mongoose.model('Friends', FriendsSchema);