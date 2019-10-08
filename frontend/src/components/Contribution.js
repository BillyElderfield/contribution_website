import React, { Component } from "react";

export default class Contribution extends Component{

    render(){
        return(
            <a
                className="flex-auto w-64 m-4 p-5 bg-white shadow rounded-lg text-black no-underline"
                href={"https://localhost:3000/profile/" + this.props.profileRef}
                >
                <h3 className="text-gray-700 uppercase text-base font-normal">
                  {this.props.date.substring(0, 10)}
                </h3>
                <p className="text-xl mt-2">
                  {this.props.task}
                </p>
                <p className="uppercase text-sm text-gray-700 font-semibold -ml-1">
                    {this.props.duration}HRS
                </p>
            </a>
        );
    }
}