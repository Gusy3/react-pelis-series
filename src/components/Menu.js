import React, { Component } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
const images = require.context("../assets/images");

class Menu extends Component{

    logout = () =>{

        localStorage.removeItem('ACCESS_TOKEN');
        this.props.navigate('/login');

    }

    render(){

        return(

            <div id="slider" className="slider">

                <nav id="menu">
                    <ul>
                        <li><NavLink to="/home" activeactiveclassname="active">Inicio</NavLink></li>
                        <li><NavLink to="/peliculas" activeactiveclassname="active">Peliculas</NavLink></li>
                        <li><NavLink to="/series" activeactiveclassname="active">Series</NavLink></li>

                        <img className="logout" src={ images('./logout.png') } onClick={this.logout} alt="Logout" title="Logout" />
                    </ul>
                </nav>

            </div>

        );

    }

}

function MenuLogout(){

    let navigate = useNavigate(); 

    return <Menu navigate={navigate} />

}

export default MenuLogout;