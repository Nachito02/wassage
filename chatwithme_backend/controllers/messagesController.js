import ChatRoom from "../model/ChatRoom.js"
import Message from "../model/Message.js"
import mongoose from "mongoose"
import User from "../model/User.js"
const newMessage = async (req,res) => {
  const {name, chatRoomId, content, recipient } = req.body
  const { _id } = req.user
  
  try {
    const recipientObjectId = new mongoose.Types.ObjectId(recipient)
    let chatRoom = await ChatRoom.findById(chatRoomId)
    if (!chatRoom) {
      // Si la sala de chat no existe, la creamos con el usuario actual como primer miembro
      chatRoom = new ChatRoom({
        name: `Chat Room ${name}`,
        users: [_id,recipientObjectId],
        messages: []
      })
      await chatRoom.save()
    } else if (!chatRoom.users.includes(_id)) {
      // Si el usuario actual no está incluido en la sala de chat, lo agregamos
      chatRoom.users.push(_id)
      await chatRoom.save()
    }
    
    // Agregamos la sala de chat a los usuarios involucrados si aún no la tienen
    const userAuthor = await User.findById(_id);
    if (!userAuthor.chatrooms.includes(chatRoom._id)) {
      userAuthor.chatrooms.push(chatRoom._id);
      await userAuthor.save();
    }

    const userRecipient = await User.findById(recipient);
    if (!userRecipient.chatrooms.includes(chatRoom._id)) {
      userRecipient.chatrooms.push(chatRoom._id);
      await userRecipient.save();
    }

    const message = new Message({
      author: _id,
      content: content,
      chatRoom: chatRoom._id,
      recipient : recipientObjectId
    })
    await message.save()
    
    // Agregamos el nuevo mensaje a la lista de mensajes de la sala de chat
    chatRoom.messages.push(message._id)
    await chatRoom.save()

    res.json( message)
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}

const getMessagesForChatRoom = async (req, res) => {
  const { chatRoomId } = req.params;
  try {
    const chatRoom = await ChatRoom.findById(chatRoomId).populate('messages');
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }
    const messagesInChat = chatRoom.messages;

    const messagePromises = messagesInChat.map(msgId => Message.findById(msgId));
    const messages = await Promise.all(messagePromises);

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export {
    newMessage, getMessagesForChatRoom
}