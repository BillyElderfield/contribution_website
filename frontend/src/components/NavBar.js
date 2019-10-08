import React, { Component, useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import {BrowserRouter as Redirect} from "react-router-dom";
import axios from "axios";

export default function NavBar(){

    const { user } = useContext(UserContext);
    const [ followers, setFollowers ] = useState("");
    const [ following, setFollowing ] = useState("");

    async function logOut(){
        await axios.post("https://localhost:7034/user/logout", {withCredentials: true});
        this.props.history.push("/login")
    }

    useEffect(()=>{ 
        async function func(){
            let res = await axios.get("https://localhost:7034/follow/followStats/" + user.profileRef);
            setFollowers(res.data.followers);
            setFollowing(res.data.followings);
        }
        func();
    }, []);

    return(
        <header className="fixed w-full top-0 bg-purple-800 shadow text-white">
            <div
            className="mx-auto h-16 p-4 flex items-center justify-between"
            style={{width: "800px"}}
            >
                <a className="text-white text-3xl"
                href="/profile"
                style={{color: "#fff", textDecoration: "none"}}>
                    <h2>Contribute</h2>
                </a>
                <div>
                    <a
                    href="/followedUsers"
                    className="text-white border border-white rounded p-2 no-underline hover:bg-purple-light ml-4"
                    >
                        {following + " Following"}
                    </a>
                    <a
                    href="/followers"
                    className="text-white border border-white rounded p-2 no-underline hover:bg-purple-light ml-4"
                    style={{marginRight: "10px"}}
                    >
                        {followers + " Followers"}
                    </a>
                    <a
                    href="/profile"
                    style={{color: "#fff", textDecoration: "none"}}>
                    {user.username}
                    </a>
                    <a
                    href=""
                    onClick={logOut}
                    className="text-white border border-white rounded p-2 no-underline hover:bg-purple-light ml-4"
                    >
                        Log Out
                    </a>
                </div>
            </div>
        </header>
    );
}