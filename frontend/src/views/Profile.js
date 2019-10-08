import React, { Component } from "react";
import UserContext from "../context/UserContext";
import {BrowserRouter as Redirect} from "react-router-dom";
import ProfileButton from "../components/ProfileButton";
import Contribution from "../components/Contribution";
import axios from "axios";

export default class Profile extends Component{

    static contextType = UserContext;

    state = {
      user: window.location.pathname.substring(9) || this.context.profileRef,
      following: "",
      followers: "",
      isFollowing: false,
      loaded: false,
      contributions: []
    };

    logOut = async ()=>{
        await axios.post("https://localhost:7034/user/logout", {withCredentials: true});
        this.props.history.push("/login")
    }

    getUserDetails = async ()=>{
      let contributionRes = await axios.get("https://localhost:7034/contribution/" + this.state.user);
      let followStatsRes = await axios.get("https://localhost:7034/user/followStats/" + this.state.user);
      //let isFollowingRes= await axios.get("https://localhost:7034/user/isFollowing/" + this.state.user, {withCredentials: true});
      this.setState({
        contributions: contributionRes.data,
        following: followStatsRes.data.following,
        followers: followStatsRes.data.followers,
        isFollowing: false,
        loaded: true
      });
    }

    async componentWillMount(){
      await this.getUserDetails();
      let tasks = this.state.contributions.length;
      let total = (tasks > 0) ? this.state.contributions.reduce((prev, curr)=>{
        return {duration: prev.duration + curr.duration};
      }).duration
      : 0;
      let avg = (tasks > 0) ? (total / tasks).toFixed(2) : 0.00;
      this.setState({tasks, total, avg});
      //await this.getContributions();
    }

    renderButtons = ()=>{
      if(this.state.user.toLowerCase() === this.context.profileRef.toLowerCase()){
        return(
          <div id="profileButtons">
            <ProfileButton text="Create New Contribution" href="/CreateContribution"/>
            <ProfileButton text="Manage Account" href="/Account"/>
          </div>
        );
      }
      const followText = this.state.isFollowing ? "UnFollow" : "Follow";
      return( 
        <div id="profileButtons">
          <ProfileButton text={followText} href="/Account"/>
          <ProfileButton text="52 Followers" href="/CreateContribution"/>
          <ProfileButton text="12 Following" href="/Account"/>
        </div>
        );
    }

    renderContributions = ()=>{
      if(this.state.contributions.length === 0){
        return(
          <h2 style={{paddingLeft: "100px", paddingTop: "50px"}}>
            No contributions to dispaly.
          </h2>);
      }
      return this.state.contributions.map(contribution=>{
        return(
          <Contribution
          profileRef={contribution.profile_ref}
          date={contribution.date}
          duration={contribution.duration}
          task={contribution.task}
          />
        );
      });
    };

    render(){
        return !this.state.loaded ? null : (
          <main
            style={{width: "800px"}}
            className="mx-auto mt-16 pt-4 flex flex-col justify-center "
          >
          {console.log(this.state.user)}
            <section className="flex items-center">
              <div
                className="m-4 p-6 rounded-lg bg-white flex-1 shadow flex flex-col-reverse"
              >
                <h3 className="uppercase text-sm text-indigo-light font-semibold">
                  Total Number of Tasks
                </h3>
                <div className="text-5xl text-indigo font-semibold">
                  {this.state.tasks}
                  <span className="text-grey-dark uppercase text-base -ml-2 leading-none" style={{paddingLeft: "10px"}}>tasks</span>
                </div>
              </div>
      
              <div
                className="m-4 p-6 rounded-lg bg-white flex-1 shadow flex flex-col-reverse"
              >
                <h3 className="uppercase text-sm text-blue-light font-semibold">
                  Total time
                </h3>
                <div className="text-5xl text-blue font-semibold">
                {this.state.total}
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
                  {this.state.avg}
                  <span className="text-grey-dark uppercase text-base -ml-2" style={{paddingLeft: "10px"}}>hrs</span>
                </div>
              </div>
            </section>
      
            <section
              className="flex flex-wrap border border-grey-light border-l-0 border-r-0 border-b-0 mt-6 pt-6"
            >
              {this.renderButtons()}
              {this.renderContributions()}
            </section>
          </main>
        );
    }
}