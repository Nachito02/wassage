import express from 'express';
import { getChatRooms, showChatRoom } from '../controllers/chatRoomController.js';
import { register, confirm, login, profile,getAllUsers } from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuth.js';
import { newMessage, getMessagesForChatRoom } from '../controllers/messagesController.js';
const router = express.Router();


//auth, confirm and register users

router.post('/', register)

router.get('/confirm/:token',confirm)

router.post('/login',login)

router.get('/profile', checkAuth, profile)


router.post('/chatroom/message', checkAuth, newMessage)
router.get('/chatroom/getChatrooms', checkAuth, getChatRooms)

router.get('/chatroom/:chatRoomId/messages', checkAuth, getMessagesForChatRoom);

router.get('/chatroom/:chatRoomId/messages', checkAuth, getMessagesForChatRoom);


router.get('/chatroom/showchatroom/:userId', checkAuth, showChatRoom);


router.get('/getAll/', checkAuth, getAllUsers);

export default router