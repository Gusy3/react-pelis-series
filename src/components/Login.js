import React, { Component } from 'react';
import environments from '../environments';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';

class Login extends Component{

    // Url api
    apiUrl = environments.apiUrl;

    state = {
        user: {},
        error: null
    }

    constructor(){

        super();
        this.validator = new SimpleReactValidator(
            {
                autoForceUpdate: this,
                className: 'msg-validator',
                messages: {
                    required: ':attribute es requerido.'
                }
            }

        );

    }

    changeState = (event)=>{

        let field = event.target.name
        let value = event.target.value;

        this.setState({
            user: {
                ...this.state.user, [field]: value
            }
        });

    }

    loginUser = (event)=>{

        event.preventDefault();

        axios.post(this.apiUrl+'login', this.state.user)

            .then(response => {

                if(response.data.status==='success'){

                    this.setState({

                        error: false

                    });

                    localStorage.setItem('ACCESS_TOKEN', response.data.user.accessToken);

                }else{
    
                    this.setState({

                        error: true

                    });

                }

            })
            .catch(error=>{

                this.setState({

                    error: true

                });
    
                console.log(error);
    
            });

    }

    render(){

        
        var isLogged = localStorage.getItem('ACCESS_TOKEN') ? true : false;

        if(isLogged){

            return <Navigate to="/" />
    
        }

        return(

            <section id="login" className="center">

                <h1>LOGIN</h1>

                <form onSubmit={this.loginUser}>

                    <input type="text" name="username" placeholder="Usuario" onChange={this.changeState} />
                    <input type="password" name="password" placeholder="Contraseña" onChange={this.changeState} />

                    { this.state.error &&

                        <small className="msg-validator">El usuario o la contraseña son incorrectas</small>

                    }

                    {/* LIMPIAR FLOTADOS */}
                    <div className="clearfix"></div>

                    <input type="submit" name="submit" value="ENTRAR"/>

                </form>

            </section>

        );

    }

}

export default Login;