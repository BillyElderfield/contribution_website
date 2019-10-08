import React, { Component } from "react";

export default class ProfileButton extends Component{

    render(){
        return(
            <a
                href={this.props.href}
                className="flex-auto w-64 m-4 p-5 bg-purple-500 shadow rounded-lg text-3xl text-white no-underline flex items-center justify-center text-center"
              >
                {this.props.text}
            </a>
        );
    }
}