import ChatRoom from "../model/ChatRoom.js";
import User from "../model/User.js";
import mongoose from "mongoose";
const getChatRooms = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id).populate("chatrooms");
    const chatRooms = user.chatrooms;

    let recipients = [];
    for (let i = 0; i < chatRooms.length; i++) {
      recipients.push(
        chatRooms[i].users.filter((user) => String(user) !== String(_id))
      );
    }
    const recipientPromise = recipients.map((recipient) =>
      User.findById(recipient)
    );
    const userRecipient = await Promise.all(recipientPromise);

    chatRooms.recipient = userRecipient;

    chatRooms.forEach((room, index) => {
      room.recipient = userRecipient[index];
    });

    const formattedChatRooms = chatRooms.map((room, index) => {
      return {
        ...room.toObject(),
        recipient: userRecipient[index].toObject(),
      };
    });

    res.json(formattedChatRooms);
  } catch (error) {
    console.log(error);
  }
};

const showChatRoom = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userCurrent = await User.findById(req.user._id);

    const user = await User.findById(userId);


    // Si el usuario actual y el usuario seleccionado ya tienen un chatroom en común,
    // mostramos los mensajes en ese chatroom
    const chatRoomId = user.chatrooms.find((roomId) =>
      userCurrent.chatrooms.includes(roomId)
    );
   
    if (chatRoomId) {
      const chatRoom = await ChatRoom.findById(chatRoomId)
      return res.json(chatRoom);
    }

    // De lo contrario, creamos un nuevo chatroom con el usuario seleccionado
    const recipientObjectId = new mongoose.Types.ObjectId(userId);
  
    const newChatRoom = await ChatRoom.create({
      name: user.name,
      users: [userCurrent._id, recipientObjectId],
    });
  
  

    await user.chatrooms.push(newChatRoom._id);
  
    await userCurrent.chatrooms.push(newChatRoom._id);

    await user.save();
    await userCurrent.save();
    res.json(newChatRoom);

    return;
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export { getChatRooms, showChatRoom };
