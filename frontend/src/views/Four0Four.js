import React, {Component} from "react";

export default class FourOFour extends Component {

    componentDidMount() {
        document.title = "Page not found - Contribute"
    }

    render() {
        return (
            <div className="FourOFour">
                <img src="/logo.png" alt="logo" />
                <h3>There was an error finding this page.</h3>
                <p>It may not exists or have moved to a new location on the site.</p>
                <button className="site-button">Home</button>
            </div>
        );
    }
}