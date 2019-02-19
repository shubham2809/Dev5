import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';

const emailTooltip =
    'This site uses Gravatar so if you want a profile image, use a Gravatar email';

const passwordTooltip =
    "Choose a distinct password, I didn't invest much on this app security!!";

class Register extends Component {
    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
        errors: {}
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onClose = () => {
        this.setState({ errors: {} });
    };

    onSubmit = e => {
        e.preventDefault();

        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };

        axios
            .post('/api/users/register', newUser)
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                this.setState({ errors: err.response.data });
            });
    };

    render() {
        const { errors } = this.state;

        let ErrorMesagge = null;

        if (Object.keys(errors).length > 0) {
            ErrorMesagge = (
                <div className="ui error message fluid">
                    <i className="close icon" onClick={this.onClose} />
                    <div className="header">
                        There were some errors with your submission
                    </div>
                    <ul className="list">
                        {Object.keys(errors).map(errName => {
                            return <li key={errName}>{errors[errName]}</li>;
                        })}
                    </ul>
                </div>
            );
        }

        return (
            <div className="ui inverted segment">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">
                                Create your Dev5 account
                            </p>
                            <form
                                className="inverted ui form"
                                onSubmit={this.onSubmit}
                            >
                                <div
                                    className={classnames('required field', {
                                        error: errors.name
                                    })}
                                >
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="Name"
                                        value={this.state.name}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div
                                    data-inverted=""
                                    data-tooltip={emailTooltip}
                                    data-position="bottom right"
                                    className={classnames('required field', {
                                        error: errors.email
                                    })}
                                >
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="Email"
                                        value={this.state.email}
                                        onChange={this.onChange}
                                    />
                                </div>

                                <div
                                    data-inverted=""
                                    data-tooltip={passwordTooltip}
                                    data-position="bottom right"
                                    data-variation="inverted"
                                    className={classnames('required  field', {
                                        error: errors.password
                                    })}
                                >
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        placeholder="Password"
                                        value={this.state.password}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div
                                    className={classnames('required field', {
                                        error: errors.password2
                                    })}
                                >
                                    <input
                                        type="password"
                                        name="password2"
                                        required
                                        placeholder="Confirm Password"
                                        value={this.state.password2}
                                        onChange={this.onChange}
                                    />
                                </div>
                                <input
                                    type="submit"
                                    className="fluid ui primary button"
                                />
                            </form>
                            {ErrorMesagge}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;
