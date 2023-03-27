import mongoose from "mongoose";

const chatRoomSchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },

    users: {
        type: Array
    },

    messages: {
        type: Array,
    }
})

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema)

export default ChatRoom