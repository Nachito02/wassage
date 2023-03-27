import React from 'react'

const Chat = (props) => {

    const {messages, handleSubmit, input, setInput, user} = props

  return (
    <div className='flex flex-col justify-between h-full'>
        
    <div className="">
      {messages &&
        messages.map((message, i) =>
          message.author !== user._id ? (
            <p key={i} className="text-red-400">
              {message.content}{" "}
            </p>
          ) : (
            <p key={i} className="text-blue-400">
              {message.content}
            </p>
          )
        )}
    </div>

    <form onSubmit={handleSubmit} className="flex gap-2 ">
      <input
        className="text-black"
        value={input.content}
        type="text"
        onChange={(e) => {
          setInput({ ...input, content: e.target.value });
        }}
      />
      <button type="submit">Enviar</button>
    </form>
  </div>
  )
}

export default Chat