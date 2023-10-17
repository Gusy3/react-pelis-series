import React, {Component} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';

class Sidebar extends Component{

    state = {
        title: null
    }

    constructor(){

        super();
        this.validator = new SimpleReactValidator(
            {
                autoForceUpdate: this,
                className: 'msg-validator',
                messages: {
                    required: 'El :attribute es requerido.'
                }

            }

        );

    }

    changeState = (event)=>{

        this.setState({
            title: event.target.value
        });

    }

    redirectToSearch = (event)=> {

        event.preventDefault();

        if(this.validator.allValid()){

            // Variable que almacena El hook useNavigate para la redireccion
            var navigate = this.props.redirect;

            navigate("/buscar?title="+this.state.title);

        }else{

            this.validator.showMessages();

        }

    }

    render(){

        return(

            <aside id="sidebar">

                <div id="nav-blog" className="sidebar-item">
                    <h3>Puedes hacer esto</h3>
                    <Link to="/crear-pelicula" className="btn btn-success">Añadir pelicula</Link>
                    <hr></hr>
                    <Link to="/crear-serie" className="btn btn-success">Añadir serie</Link>
                </div>

                <div id="search" className="sidebar-item">
                    <h3>Buscador</h3>
                    <p>Encuentra lo que buscas</p>

                    <form onSubmit={this.redirectToSearch}>
                        <div className="form-group">
                            <label htmlFor="title">Título</label>
                            <input type="text" name="title"
                                   onChange={this.changeState}
                                   onBlur={()=>this.validator.showMessageFor('título')}
                                   onKeyDown={()=>this.validator.showMessageFor('título')}
                            />
        
                            {this.validator.message('título', this.state.title, 'required')}
                            
                        </div>

                        <input type="submit" name="submit" value="Buscar" className="btn btn-success"/>

                    </form>

                </div>

            </aside>

        );

    }

}

function SidebarNavigate(){

    let navigate = useNavigate();

    return <Sidebar redirect={navigate} />

}

export default SidebarNavigate;