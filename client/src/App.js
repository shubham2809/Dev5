import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="ui inverted vertical center aligned segment">
                    <NavBar />
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Footer />
                </div>
            </Router>
        );
    }
}

export default App;
