import React, { useState,useContext } from "react";
import authContext from "../context/auth/authContext";
import Link from "next/link";
const RegisterForm = () => {

    const AuthContext = useContext(authContext);

    const {registerUser, alert} = AuthContext;

  const [data, setData] = useState({
    name : '',
    email:'',
    password:''
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(data);
    setData({
      name: "",
      email: "",
      password: "",
    });
  };


  return (
    <>
    {alert && <p>{alert}</p>}
      <form
        className="bg-green-400 flex flex-col items-center gap-3 h-screen justify-center"
        onSubmit={handleSubmit}
      >
        <div className=" flex flex-col items-center">
          <label htmlFor="">Your Name</label>

          <input
            className="px-3 py-2"
            type="text"
            placeholder="Your Name"
            value={data.name}
            onChange={(e) => setData({...data, name: e.target.value}) }
            name="name"
          />
        </div>

        <div className=" flex flex-col items-center">
          <label htmlFor="">Your email</label>
          <input
            className="px-3 py-2"
            type="email"
            placeholder="Your Email"
            onChange={(e) => setData({...data, email: e.target.value}) }
            value={data.email}

            name="email"
          />
        </div>

        <div className=" flex flex-col items-center">
          <label htmlFor="">Your password</label>

          <input
            className="px-3 py-2"
            type="password"
            placeholder="Your Password"
            name="password"
            onChange={(e) => setData({...data, password: e.target.value}) }
            value={data.password}

          />
        </div>

        <button type="submit" className="bg-green-600 px-10 py-2">
          Register
        </button>

      <Link href="/login">You have account? Login</Link>

      </form>

    </>
  );
};

export default RegisterForm;
