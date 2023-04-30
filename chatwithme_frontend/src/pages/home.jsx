import React, { useEffect, useState } from "react";
import { useContext } from "react";
import authContext from "../../context/auth/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faUserGroup,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import clienteAxios from "../../config/clienteAxios";
import { ClipLoader } from "react-spinners";
import Chat from "../../components/Chat";
import io from "socket.io-client";
import { useRouter } from "next/router";
let socket;

const Home = () => {
  const AuthContext = useContext(authContext);

  const { user, authUser, logOut } = AuthContext;

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [chatRoom, setChatRoom] = useState([]);
  const [selectChatRoom, setSelectChatroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [input, setInput] = useState({
    content: "",
    recipient: "",
    chatRoomId: "",
    name: "",
  });

  const router = useRouter();

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
        setLoading(true);
        if (selectChatRoom) {
          const response = await clienteAxios.get(
            `/api/users/chatroom/${selectChatRoom}/messages`
          );
          setMessages(response.data.messages);

          setLoading(false);
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
    socket = io(process.env.NEXT_PUBLIC_BACKEND_URL);
    socket.emit("open chat", selectChatRoom);
  }, [selectChatRoom]);

  useEffect(() => {
    socket.on("new message", (id) => {
      setMessages([...messages, id])
    });

    socket.on("new chatroom", (data) => {
      const getChatRooms = async () => {
        const response = await clienteAxios("/api/users/chatroom/getChatrooms");
       
        setChatRoom(response.data);
      };
      getChatRooms();
    });
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await clienteAxios.post(
        "/api/users/chatroom/message",
        input
      );
       
      setMessages([...messages, response.data]);
      setInput({ ...input, content: "" });
      socket.emit("new message", response.data);
    } catch (error) {
      setInput({ ...input, content: "" });
    }
  };

  const handleSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleUserClick = async (id) => {
    try {
      setLoading(true)
      const response = await clienteAxios.get(
        `/api/users/chatroom/showchatroom/${id}`
      );

      const chatrooms = await clienteAxios("/api/users/chatroom/getChatrooms");
      setChatRoom(chatrooms.data);
      
      setSelectChatroom(response.data._id);
      setShowSearch(false);


      setInput({
        ...input,
        chatRoomId: response.data._id,
        recipient: response.data.users[1],
      });
      console.log(response.data)

      socket.emit("new chatroom", chatrooms.data);
      setLoading(false)

    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = () => {
    logOut();

    router.push("/login");
  };
  return user ? (
    <div className="bg-red-200 h-full min-h-screen flex fixed w-full">
      <div className="bg-gray-900 text-white w-1/4  border-r-2 border-black   ">
        <div className="flex justify-between items-center bg-gray-800 p-1  ">
          <img
            src={user.profile_img}
            alt=""
            className="rounded-full max-w-full w-20"
          />

          <div className="flex gap-3 ">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="hover: cursor-pointer mr-1"
              onClick={handleSearch}
            />
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="hover: cursor-pointer mr-1"
              onClick={handleLogOut}
            />
          </div>
        </div>

        <div>
          <div>
            {chatRoom.map((room) => (
              <div
              className={`flex items-center gap-2 mt-3 hover: cursor-pointer ${
                room._id == selectChatRoom ? "bg-green-800" : null
              }`}
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
                <img
                  src={room.recipient.profile_img}
                  className="rounded-full max-w-full w-20 	"
                />

                <p className="flex-2">{room.recipient.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-700 text-white p-3 w-full ">
        {showSearch && (
          <div className="absolute right-20 bg-gray-900  w-full">
            {users &&
              users.map((user) => (
                <div
                  onClick={() => handleUserClick(user._id)}
                  key={user._id}
                  className="flex items-center gap-2 p-3 hover: cursor-pointer hover:bg-gray-800 transition duration-300 ease-out hover:ease-in "
                >
                  <img
                    src={user.profile_img}
                    className="rounded-full max-w-full w-20"
                    alt=""
                  />
                  <p>{user.name}</p>
                </div>
              ))}
          </div>
        )}
        {selectChatRoom &&
          (!loading ? (
            <Chat
              messages={messages}
              handleSubmit={handleSubmit}
              input={input}
              setInput={setInput}
              user={user}
            />
          ) : (
            <ClipLoader />
          ))}
      </div>
    </div>
  ) : (
    <p>Cargando</p>
  );
};

export default Home;
