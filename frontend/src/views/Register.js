import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default class Register extends Component{

    state = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        errorMessage: " "
    };

    componentDidMount() {
        document.title = "Register - Contribute";
    }

    onSubmit = async (e)=>{
        try{
            e.preventDefault();
            if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(this.state.password)){
              return this.setState({errorMessage: "Password should have a minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"})
            };
            if(this.state.password !== this.state.confirmPassword) return this.setState({errorMessage: "Passwords do not match."});
            let res = await axios.post("https://localhost:7034/user/register", {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password,
            }, {withCredentials: true});
            if(res.status === 200){
                this.props.history.push("/login")
            }
        }
        catch(err){
            console.log(err);
            let res = err.response;
            if(res.status === 401){
                this.setState({errorMessage: res.data.error})
            }
        }
    }

    onChange = (e)=> this.setState({[e.target.name]: e.target.value})

    render(){
        return(
            <main className="h-screen flex flex-col items-center justify-center ">
            <form className="m-4 shadow-lg rounded-lg overflow-hidden w-64" id="registration_form"
              onSubmit={this.onSubmit}>
              <h1 className="text-2xl bg-gray-100 p-4">Create Account</h1>
      
              <label className="m-4 block">
                Username
                <input
                  className="block rounded bg-gray-200 p-2 mt-2 w-full"
                  type="text"
                  name="username"
                  value={this.state.username}
                  onChange={this.onChange}
                  required
                />
              </label>
      
              <label className="m-4 block">
                Email Address
                <input 
                    className="block rounded bg-gray-200 p-2 mt-2 w-full"
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    required />
              </label>
      
              <label className="m-4 block">
                Password
                <input className="block rounded bg-gray-200 p-2 mt-2 w-full"
                    type="password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    required />
              </label>
      
              <label className="m-4 block">
                Confirm Password
                <input
                  className="block rounded bg-gray-200 p-2 mt-2 w-full"
                  type="password"
                  name="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.onChange}
                  required
                />
              </label>
      
              <button
                type="submit"
                className="block w-auto rounded bg-purple-800 text-white p-2 m-4 ml-auto"
              >
                Create Account →
              </button>
            </form>
            <p style={{color: "red", width: "500px", wordWrap: "break-word", textAlign: "center"}} >{this.state.errorMessage}</p>        
            <Link
              to="/"
              className="block mt-8 text-purple-700 no-underline hover:underline"
              >Sign in
              </Link>
          </main>
        );
    }
}