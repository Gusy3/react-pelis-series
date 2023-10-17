import React, { Component } from 'react';
import environments from '../environments';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';

class SeasonNew extends Component{

    // Url api
    apiUrl = environments.apiUrl;

    state = {
        season: {},
        status: null
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
            season: {
                ...this.state.season, [field]: value
            }
        });

    }

    saveSeason = (event)=>{

        event.preventDefault();

        if(this.validator.allValid()){

            var serieId = this.props.serieId;

            axios.post(this.apiUrl+'serie/'+serieId+'/save-season', this.state.season)

                .then(response => {

                    if(response.data.season){

                        this.setState({

                            season: response.data.season,
                            status: 'success'

                        });

                        // ALERTA

                        swal(
                            '¡¡¡Temporada creada!!!',
                            'La temporada se ha creado correctamente',
                            'success'
                        );

                    }else{
        
                        this.setState({

                            status: 'error'

                        });

                    }

                });


        }else{

            this.setState({
                status: 'error'
            });

            // Si la validación falla mostramos los mensajes
            this.validator.showMessages();

        }

    }

    render(){

        if(this.state.status==='success'){

            var serieId = this.props.serieId;

            return <Navigate to={"/serie/"+serieId} />;

        }

        return(

            <section id="content">

            <h1 className="subheader">CREAR TEMPORADA</h1>
        
            <form className="mid-form" onSubmit={this.saveSeason}>
        
                <div className="form-group">
                    <label htmlFor="title">Título</label>
                    <input type="text" name="title"
                           onChange={this.changeState}
                           onBlur={()=>this.validator.showMessageFor('título')}
                           onKeyDown={()=>this.validator.showMessageFor('título')}
                    />

                    {this.validator.message('título', this.state.season.title, 'required')}

                </div>

                <div className="form-group">

                    <label htmlFor="viewed">Visto:</label>
                    <div className="radio">

                        <input type="radio" name="viewed" value="Sí"
                               onChange={(event)=>{ this.changeState(event); this.validator.showMessageFor('visto') }}
                         />
                        <label htmlFor="si">Sí</label>
                
                        <input type="radio" name="viewed" value="No"
                               onChange={(event)=>{ this.changeState(event); this.validator.showMessageFor('visto') }}
                        />
                        <label htmlFor="no">No</label>

                    </div>

                    {this.validator.message('visto', this.state.season.viewed, 'required')}
                    
                </div>
        
                {/*LIMPIAR FLOTADOS*/}
                <div className="clearfix"></div>
        
                <input type="submit" value="CREAR" className="btn btn-success" />
        
            </form>
        
          </section>

        );

    }

}

function GetSerieId(){

    let {id} = useParams();

    return <SeasonNew serieId={id} />

}

export default GetSerieId;