import React, { useReducer } from "react";

import authContext from "./authContext";

import authReducer from "./authReducer";
import { useRouter } from "next/router";
import {
  AUTH_USER,
  REGISTER_SUCCES,
  REGISTER_ERROR,
  LOGIN_ERROR,
  LOGIN_SUCCES,
  LOG_OUT,
  CLEAN_ALERT,
  SHOW_ALERT,
} from "../../types";


import clienteAxios from "../../config/clienteAxios";
import tokenAuth from "../../config/tokenAuth";

const AuthState = ({children}) => {

    const router = useRouter()
    const initialState = {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : '',
        auth: null,
        user: null,
        alert:null
    }

    //definir el state

    const [state,dispatch] = useReducer(authReducer,initialState)


    const registerUser = async data => {
        try {
            const response = await clienteAxios.post('/api/users', data)

            dispatch({
                type: REGISTER_SUCCES,
                payload: response.data.msg
            })
        } catch(error){
            dispatch({
                type: REGISTER_ERROR,
                payload: error.response.data.msg
            })
        }

        setTimeout(() => {
            dispatch({
                type: CLEAN_ALERT
            })
        }, 3000)
    }


    const login = async (data) => {

        try {
            const response =await clienteAxios.post('/api/users/login',data)

            dispatch({
                type: LOGIN_SUCCES,
                payload:response.data.token
            })

        } catch (error) {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.response.data.msg
            })
        }

    }


    const authUser = async () => {
        const token = localStorage.getItem('token')
        if(token) {
            tokenAuth(token)
        }

        try {
            const response = await clienteAxios.get('/api/users/profile')
            if(response.data.user) {
                dispatch({
                    type: AUTH_USER,
                    payload: response.data.user
                })

                // Redirigir al usuario a la página principal
                router.push('/home');
            }
        } catch (error) {
            console.log(error)
        }
    }


    const logOut = () => {
        dispatch({
           type: LOG_OUT
        })
    }
    return (
        <authContext.Provider value={{
            token: state.token,
            auth: state.auth,
            user: state.user,
            alert: state.alert,
            registerUser,
            login,
            authUser,
            logOut
        }}>
            {children}
        </authContext.Provider>
    )
}




export default AuthState