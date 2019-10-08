import React, { Component } from "react";
import { UserContext } from "../context/UserContext";
import {BrowserRouter as Redirect} from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;

export default class CreateContribution extends Component{

    static contextType = UserContext;

    state = {
        date: "",
        task: "",
        duration: ""
    }

    onSubmit = async (e)=>{
        try{
            e.preventDefault();
            let res = await axios.post("https://localhost:7034/contribution/create", {
                date: this.state.date,
                duration: this.state.duration,
                task: this.state.task
            }, {withCredentials: true});
            if(res.status === 200){
                this.props.history.push("/profile")
            }
        }
        catch(err){
            console.log(err);
            let res = err.response;
            if(res.status === 401){
                this.setState({errorMessage: res.data.error});
            }
        }
    }

    onChange = (e)=> this.setState({[e.target.name]: e.target.value})

    render(){
    return(
        <main className="h-screen flex flex-col items-center justify-center">
            <form
                className="m-4 shadow-lg rounded-lg overflow-hidden w-64"
                onSubmit={this.onSubmit}
            >
                <h1 className="text-2xl bg-gray-100 p-4">Create new contribution</h1>

                <label className="m-4 block">
                Date
                <input
                    className="block rounded bg-gray-200 p-2 mt-2 w-full"
                    type="date"
                    name="date"
                    value={this.state.date}
                    onChange={this.onChange}
                    required
                />
                </label>

                <label className="m-4 block">
                Task
                <input
                    className="block rounded bg-gray-200 p-2 mt-2 w-full"
                    type="text"
                    name="task"
                    value={this.state.task}
                    onChange={this.onChange}
                    required
                />
                </label>

                <label className="m-4 block">
                Duration (hrs)
                <input
                    className="block rounded bg-gray-200 p-2 mt-2 w-full"
                    type="number"
                    name="duration"
                    value={this.state.duration}
                    onChange={this.onChange}
                    required
                />
                </label>

                <button
                type="submit"
                className="block w-auto rounded bg-purple-800 text-white p-2 m-4 ml-auto"
                >
                Log Contribution →
                </button>
            </form>
        </main>
        );
    }
}