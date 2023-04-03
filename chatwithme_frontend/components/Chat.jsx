import React from "react";

const Chat = (props) => {
  const { messages, handleSubmit, input, setInput, user } = props;

  return (
    <div className="flex flex-col justify-between h-full">
      <div className=" overflow-auto max-h-80vh">
        {messages &&
          messages.map((message, i) =>
            message.author !== user._id ? (
              <div className="flex justify-start">
                <p key={i} className="text-white bg-blue-500 p-2">
                  {message.content}
                </p>
              </div>
            ) : (
              <div className="flex justify-end">
                <p key={i} className="text-white bg-gray-800 p-2">
                  {message.content}
                </p>
              </div>
            )
          )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 ">
        <input
          className="text-black w-full p-3"
          value={input.content}
          type="text"
          onChange={(e) => {
            setInput({ ...input, content: e.target.value });
          }}
        />
        <button className="bg-green-600 px-5" type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;
