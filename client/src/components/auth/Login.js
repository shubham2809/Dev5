import React, { Component } from 'react';

class Login extends Component {
    state = {
        email: '',
        password: '',
        errors: {}
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        console.log(this.state);
    };

    render() {
        return (
            <div>
                <div className='ui segment"'>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-8 m-auto">
                                <h1 className="display-4 text-center">
                                    Log In
                                </h1>
                                <form
                                    className="ui inverted form"
                                    onSubmit={this.onSubmit}
                                >
                                    <div className="required field">
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="Email"
                                            value={this.state.email}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <div className="required field">
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            placeholder="Passowrd"
                                            value={this.state.passord}
                                            onChange={this.onChange}
                                        />
                                    </div>
                                    <input
                                        type="submit"
                                        className="fluid ui primary button"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
