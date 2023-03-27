import React, { useEffect, useState } from "react";
import { useContext } from "react";
import authContext from "../../context/auth/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGroup,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import clienteAxios from "../../config/clienteAxios";
import Chat from "../../components/Chat";
import  io  from "socket.io-client";

let socket;

const Home = () => {
  const AuthContext = useContext(authContext);

  const [users, setUsers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [chatRoom, setChatRoom] = useState([]);
  const [selectChatRoom, setSelectChatroom] = useState(null);
  const { user, authUser } = AuthContext;
  const [messages, setMessages] = useState([]);
  const [openChat, setOpenChat] = useState(false)
  const [input, setInput] = useState({
    content: "",
    recipient: "",
    chatRoomId: "",
    name: "",
  });
  useEffect(() => {
    authUser();
  }, []);

  useEffect(() => {
    const getChatRooms = async () => {
      const response = await clienteAxios("/api/users/chatroom/getChatrooms");
      setChatRoom(response.data);
    };
    getChatRooms();
  }, []);

  useEffect(() => {
    let getMessages = async () => {
      try {
        if (selectChatRoom) {
          const response = await clienteAxios.get(
            `/api/users/chatroom/${selectChatRoom}/messages`
          );
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [selectChatRoom]);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await clienteAxios("/api/users/getAll");

      setUsers(response.data);
    };

    getAllUsers();
  }, []);


  
  useEffect(() => {
    socket = io('http://localhost:3001')
    socket.emit('open chat', selectChatRoom)
  },[selectChatRoom])

  useEffect(() => {
    socket.on('new message', (id) => {
        setMessages([...messages, id])
    })  
    
  })



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await clienteAxios.post(
        "/api/users/chatroom/message",
        input
      );

      setMessages([...messages, response.data]);
      setInput({ ...input, content: "" });
      socket.emit('new message', response.data)
    } catch (error) {
      setInput({ ...input, content: "" });
    }
  };

  const handleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleUserClick = async (id) => {

    try {
      const response = await clienteAxios.get(`/api/users/chatroom/showchatroom/${id}`)
     setSelectChatroom(response.data._id)
    } catch (error) { 
      console.log(error)
    }
  }

  return user ? (
    <div className="bg-red-200 h-screen flex">
      <div className="bg-gray-700 text-white w-1/4  p-3 border-r-2 border-black relative  ">
        <div className="flex justify-between items-center  ">
          <p>{user?.name}</p>
          <div className="flex gap-4 ">
            <FontAwesomeIcon
              icon={faUserGroup}
              className="hover: cursor-pointer"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="hover: cursor-pointer  top-0 bottom-0 left-72 right-72"
              onClick={handleSearch}
            />
          </div>
          {showSearch && (
            <div className="absolute mt-20 w-4/5">
              {users && users.map((user) => <p onClick={ () => handleUserClick(user._id)} key={user._id}>{user.name}</p>)}
            </div>
          )}
        </div>

        <div>
          <div>
            {chatRoom.map((room) => (
              <div
                key={room._id}
                onClick={() => {
                  setSelectChatroom(room._id);
                  setInput({
                    ...input,
                    chatRoomId: room._id,
                    recipient: room.recipient._id,
                  });
               
                }}
              >
                <p>{room.recipient.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-700 text-white p-3 w-full ">
        {selectChatRoom  && (
            <Chat messages={messages} handleSubmit={handleSubmit} input={input} setInput={setInput} user={user} />
        )}
      </div>
    </div>
  ) : (
    <p>Cargnndo</p>
  );
};

export default Home;
