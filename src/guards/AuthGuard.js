import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import AxiosInterceptor from '../interceptors/AxiosInterceptor';

import Header from '../components/Header';
import Menu from '../components/Menu';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useEffect } from "react";

AxiosInterceptor();

const AuthGuard = () =>{

    const navigate = useNavigate();

    useEffect(() =>{

        const isLogged = localStorage.getItem('ACCESS_TOKEN') ? true : false;

        if(!isLogged){

            navigate('/login');

        }

    });

    return(

        <React.Fragment>

            <Header />
            <Menu />

            <div id="container" className="center">

                <Outlet />
            
                <Sidebar />

            {/* LIMPIAR FLOTADOS */}
            <div className="clearfix"></div>

            </div>

            <Footer />

        </React.Fragment>

    )

}

export default AuthGuard;