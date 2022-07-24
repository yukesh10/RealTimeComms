import mongoose from "mongoose";

const RefreshTokensSchema = new mongoose.Schema({
    userId: {type: String, unique: true, required: true},
    token: {type: String, unique: true, required: true}
})

export default mongoose.model('RefreshTokens', RefreshTokensSchema);