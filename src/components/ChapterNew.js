import React, { Component } from 'react';
import environments from '../environments';
import axios from 'axios';
import { Navigate, useParams } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';

class ChapterNew extends Component{

    // Url api
    apiUrl = environments.apiUrl;

    // Variables con valores para los campos select
    resolutions = environments.resolutions;
    codecs = environments.codecs;

    state = {
        chapter: {},
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
                },
                validators: {
                    size: {
                        message: 'El :attribute debe ser un tamaño válido.',
                        rule: (val, params, validator) => {
                            return validator.helpers.testRegex(val,/^[0-9]+.?[0-9]*$/) && val>0 && params.indexOf(val) === -1
                        },
                        required: true
                    }
                }
            }

        );

    }

    changeState = (event)=>{

        let field = event.target.name
        let value = event.target.value;

        this.setState({
            chapter: {
                ...this.state.chapter, [field]: value
            }
        });

    }

    saveChapter = (event)=>{

        event.preventDefault();
        
        if(this.validator.allValid()){

            var seasonId = this.props.seasonId;

            axios.post(this.apiUrl+'season/'+seasonId+'/save-chapter', this.state.chapter)

                .then(response => {

                    if(response.data.chapter){

                        this.setState({

                            chapter: response.data.chapter,
                            status: 'success'

                        });

                        // ALERTA

                        swal(
                            '¡¡¡Capítulo creado!!!',
                            'El capítulo se ha creado correctamente',
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

            <h1 className="subheader">CREAR CAPÍTULO</h1>
        
            <form className="mid-form" onSubmit={this.saveChapter}>
        
                <div className="form-group">
                    <label htmlFor="title">Título</label>
                    <input type="text" name="title"
                           onChange={this.changeState}
                           onBlur={()=>this.validator.showMessageFor('título')}
                           onKeyDown={()=>this.validator.showMessageFor('título')}
                    />
        
                    {this.validator.message('título', this.state.chapter.title, 'required')}

                </div>

                <div className="form-group">
                    <label htmlFor="resolution" >Resolución</label>
                    <select name="resolution"
                            onChange={(event)=>{ this.changeState(event); this.validator.showMessageFor('resolución') }}
                            onBlur={()=>this.validator.showMessageFor('resolución')}
                    >
                        <option value="">----- Selecciona la Resolución -----</option>
                        {
                            this.resolutions.map((resolution, index)=>
                                <option key={index}>{resolution}</option>
                            )
                        }
                    </select>
        
                    {this.validator.message('resolución', this.state.chapter.resolution, 'required')}

                </div>
        
                <div className="form-group">
                    <label htmlFor="codec" >Códec</label>
                    <select name="codec"
                        onChange={(event)=>{ this.changeState(event); this.validator.showMessageFor('códec') }}
                        onBlur={()=>this.validator.showMessageFor('códec')}
                    >
                        <option value="">----- Selecciona el Códec -----</option>
                        {
                            this.codecs.map((codec, index)=>
                                <option key={index}>{codec}</option>
                            )
                        }
                    </select>
        
                    {this.validator.message('códec', this.state.chapter.codec, 'required')}

                </div>

                <div className="form-group">
                    <label htmlFor="size">Tamaño</label>
                    <input type="text" name="size"
                           onChange={this.changeState}
                           onBlur={()=>this.validator.showMessageFor('tamaño')}
                           onKeyDown={()=>this.validator.showMessageFor('tamaño')}/>
        
                    {this.validator.message('tamaño', this.state.chapter.size, 'required|size')}

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

                    {this.validator.message('visto', this.state.chapter.viewed, 'required')}
                    
                </div>
        
                {/*LIMPIAR FLOTADOS*/}
                <div className="clearfix"></div>
        
                <input type="submit" value="CREAR" className="btn btn-success" />
        
            </form>
        
          </section>

        );

    }

}

function GetParams(){

    let {serieId} = useParams();
    let {seasonId} = useParams();

    return <ChapterNew serieId={serieId} seasonId={seasonId} />

}

export default GetParams;