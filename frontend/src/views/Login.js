import React, { Component, useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import auth from "../util/auth";
import { UserContext } from "../context/UserContext";

export default function Login(props){
    const email = useFormInput("");
    const password = useFormInput("");
    const [errorMessage, setErrorMessage] = useState("");
    const { dispatch } = useContext(UserContext);

    const onSubmit = async (e)=>{
        try{
            e.preventDefault();
            let res = await axios.post("https://localhost:7034/user/login", {
                email: email.value,
                password: password.value
            }, {withCredentials: true});
            if(res.status === 200){
                const {username, profileRef} = await auth();
                dispatch({type: "auth", username, profileRef})
                props.history.push("/profile")
            }
        }
        catch(err){
            console.log(err);
            let res = err.response;
            if(res && res.status === 401){
                setErrorMessage(res.data.error);
            }
        }
    }

    function useFormInput(initial){
        const [value, setValue] = useState(initial)

        function onChange(e){
            setValue(e.target.value)
        }
        return{
            value,
            onChange
        }
    }

      return(
        <main className="h-screen flex flex-col items-center justify-center">
            <form className="m-4 shadow-lg rounded-lg overflow-hidden w-64" onSubmit={onSubmit}>
                <h1 className="text-2xl bg-gray-100 p-4">Sign In</h1>
                <label className="m-4 block">
                    Email Address
                    <input 
                    className="block rounded bg-gray-200 p-2 mt-2 w-full"
                    type="email"
                    name="email"
                    {...email}
                    required />
                </label>

                <label className="m-4 block">
                    Password
                    <input className="block rounded bg-gray-200 p-2 mt-2 w-full"
                    type="password"
                    name="password"
                    {...password}
                    required />
                </label>

                <button
                type="submit"
                className="block w-auto rounded bg-purple-900 text-white p-2 m-4 ml-auto">
                    Sign In →
                </button>
            </form>
            <p style={{color: "red", width: "500px", wordWrap: "break-word", textAlign: "center"}} >{errorMessage}</p>
            <Link to="/register" className="block mt-8 text-purple-700 no-underline hover:underline">
            Create an account
            </Link>
        </main>
    );
}