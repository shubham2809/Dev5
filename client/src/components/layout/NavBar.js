import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class NavBar extends Component {
    render() {
        return (
            <div className="ui container">
                <div className="ui massive borderless inverted menu">
                    <NavLink to="/" exact>
                        <h1 className="header item">Dev5</h1>
                    </NavLink>
                    <div className="right item">
                        <div className="ui massive secondary inverted pointing menu">
                            <NavLink
                                exact
                                to="/login"
                                activeClassName="active"
                                className="item"
                            >
                                Login
                            </NavLink>
                            <NavLink
                                exact
                                to="/register"
                                activeClassName="active"
                                className="item"
                            >
                                Register
                            </NavLink>
                            <NavLink
                                exact
                                to="/profiles"
                                activeClassName="active"
                                className="item"
                            >
                                Profiles
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NavBar;
