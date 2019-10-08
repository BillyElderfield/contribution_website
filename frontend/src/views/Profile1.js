import React, { Component, useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import {BrowserRouter as Redirect} from "react-router-dom";
import ProfileButton from "../components/ProfileButton";
import Contribution from "../components/Contribution";
import axios from "axios";

export default function Profile(props){

    const { user } = useContext(UserContext);
    //window.location.pathname.substring(9) || user.profileRef
    const [ profileRef ] = useState(window.location.pathname.substring(9) || user.profileRef);
    const [ followStats, setFollowStats ] = useState({following: "", followers: "", isFollowing: false});
    const [ contributions, setContributions ] = useState([]);
    const [ contStats, setContStats ] = useState({tasks: "0", total: "0", avg: "0"});
    const [ loaded, setLoaded ]= useState(false);

    async function getUserDetails(){
      let contributionRes = await axios.get("https://localhost:7034/contribution/" + profileRef);
      let followStatsRes = await axios.get("https://localhost:7034/follow/followStats/" + profileRef);
      //let isFollowingRes= await axios.get("https://localhost:7034/user/isFollowing/" + this.state.user, {withCredentials: true});
      setContributions(contributionRes.data);
      setFollowStats({
        following: followStatsRes.data.followings,
        followers: followStatsRes.data.followers,
        isFollowing: false
      });
      setLoaded(true);
      return contributionRes.data;
    }

    useEffect(()=>{
      let func = async ()=>{
        const contributions = await getUserDetails();
        let tasks = contributions.length;
        let total = (tasks > 0) ? contributions.reduce((prev, curr)=>{
          return {duration: prev.duration + curr.duration};
        }).duration
        : 0;
        let avg = (tasks > 0) ? (total / tasks).toFixed(2) : 0.00;
        setContStats({tasks, total, avg});}
      func();
    }, []);

    function renderButtons(){
      console.log(contributions)
      //if(profileRef.toLowerCase() === user.profileRef.toLowerCase()){
        if(true){
        return(
          <div id="profileButtons">
            <ProfileButton text="Create New Contribution" href="/CreateContribution"/>
            <ProfileButton text="Manage Account" href="/Account"/>
          </div>
        );
      }
      return( 
        <div id="profileButtons">
          <ProfileButton text={followStats.isFollowing ? "UnFollow" : "Follow"} href="/Account"/>
          <ProfileButton text={followStats.followers + " Followers"} href="/CreateContribution"/>
          <ProfileButton text={followStats.following + " Following"} href="/Account"/>
        </div>
        );
    }

    function renderContributions(){
      if(contributions.length === 0){
        return(
          <h2 style={{paddingLeft: "100px", paddingTop: "50px"}}>
            No contributions to dispaly.
          </h2>);
      }
      return contributions.map((contribution, i)=>{
        return(
          <Contribution
          key={i}
          profileRef={contribution.profile_ref}
          date={contribution.date}
          duration={contribution.duration}
          task={contribution.task}
          />
        );
      });
    };

    return !loaded ? null : (
      <main
        style={{width: "800px"}}
        className="mx-auto mt-16 pt-4 flex flex-col justify-center "
      >
        <section className="flex items-center">
          <div
            className="m-4 p-6 rounded-lg bg-white flex-1 shadow flex flex-col-reverse"
          >
            <h3 className="uppercase text-sm text-indigo-light font-semibold">
              Total Number of Tasks
            </h3>
            <div className="text-5xl text-indigo font-semibold">
              {contStats.tasks}
              <span className="text-gray-700 uppercase text-base -ml-2 leading-none" style={{paddingLeft: "10px"}}>tasks</span>
            </div>
          </div>
  
          <div
            className="m-4 p-6 rounded-lg bg-white flex-1 shadow flex flex-col-reverse"
          >
            <h3 className="uppercase text-sm text-blue-light font-semibold">
              Total time
            </h3>
            <div className="text-5xl text-blue font-semibold">
            {contStats.total}
              <span className="text-grey-dark uppercase text-base -ml-2" style={{paddingLeft: "10px"}}>hrs</span>
            </div>
          </div>
  
          <div
            className="m-4 p-6 rounded-lg bg-white flex-1 shadow flex flex-col-reverse"
          >
            <h3 className="uppercase text-sm text-teal-light font-semibold">
              Average time per Task
            </h3>
            <div className="text-5xl text-teal font-semibold">
              {contStats.avg}
              <span className="text-grey-dark uppercase text-base -ml-2" style={{paddingLeft: "10px"}}>hrs</span>
            </div>
          </div>
        </section>
  
        <section
          className="flex flex-wrap border border-grey-light border-l-0 border-r-0 border-b-0 mt-6 pt-6"
        >
          {renderButtons()}
          {renderContributions()}
        </section>
      </main>
    );
}