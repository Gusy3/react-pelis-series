import React, { Component } from 'react';
import environments from '../environments';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';

class FilmNew extends Component{

    // Url api
    apiUrl = environments.apiUrl;

    // Variables con valores para los campos select
    versions = environments.versions;
    genders = environments.genders;
    resolutions = environments.resolutions;
    codecs = environments.codecs;
    viewed = environments.viewed;

    state = {
        film: {image: ''},
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
                    year: {
                        message: 'El :attribute debe ser un año válido.',
                        rule: (val, params, validator) => {
                            return validator.helpers.testRegex(val,/^[1-9][0-9]{3}$/) && params.indexOf(val) === -1
                        },
                        required: true
                    },
                    size: {
                        message: 'El :attribute debe ser un tamaño válido.',
                        rule: (val, params, validator) => {
                            return validator.helpers.testRegex(val,/^[0-9]+.?[0-9]*$/) && val>0 && params.indexOf(val) === -1
                        },
                        required: true
                    },
                    imageUrl: {
                        message: 'La url de la :attribute debe ser una url válida.',
                        rule: (val, params, validator) => {
                            return validator.helpers.testRegex(val,/^https?:\/\/.*\.(?:jpg|jpeg|gif|png)$/) && params.indexOf(val) === -1
                        }
                    }
                }
            }

        );

    }

    changeState = (event)=>{

        let field = event.target.name
        let value = event.target.name!=="gender" ? event.target.value : this.selectedGenders(event.target.selectedOptions);

        this.setState({
            film: {
                ...this.state.film, [field]: value
            }
        });

    }

    selectedGenders = (options)=>{

        let genders = [];

        for(let i = 0; i<options.length; i++){

            genders[i] = options[i].value;

        }

        return genders;

    }

    saveFilm = (event)=>{

        event.preventDefault();

        if(this.validator.allValid()){

            axios.post(this.apiUrl+'film/save', this.state.film)

                .then(response => {

                    if(response.data.film){

                        this.setState({

                            film: response.data.film,
                            status: 'success'

                        });

                        // ALERTA

                        swal(
                            '¡¡¡Película creada!!!',
                            'La película se ha creado correctamente',
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

            return <Navigate to="/peliculas" />;

        }

        return(

            <section id="content">

            <h1 className="subheader">CREAR PELICULA</h1>
        
            <form className="mid-form" onSubmit={this.saveFilm}>
        
                <div className="form-group">
                    <label htmlFor="title">Título</label>
                    <input type="text" name="title"
                           onChange={this.changeState}
                           onBlur={()=>this.validator.showMessageFor('título')}
                           onKeyDown={()=>this.validator.showMessageFor('título')}
                           className={this.validator.message('título', this.state.film.title, 'required')!==undefined ? 'input-error' : ''}
                    />
        
                    {this.validator.message('título', this.state.film.title, 'required')}

                </div>

                <div className="form-group">
                    <label htmlFor="version" >Versión</label>
                    <select name="version"
                            onChange={(event)=>{ this.changeState(event); this.validator.showMessageFor('versión') }}
                            onBlur={()=>this.validator.showMessageFor('versión')}
                            className={this.validator.message('versión', this.state.film.version, 'required')!==undefined ? 'input-error' : ''}
                    >
                        <option value="">----- Selecciona la Versión -----</option>
                        {
                            this.versions.map((version, index)=>
                                <option key={index}>{version}</option>
                            )
                        }
                    </select>
        
                    {this.validator.message('versión', this.state.film.version, 'required')}

                </div>
        
                <div className="form-group">
                    <label htmlFor="gender" >Género</label>
                    <select name="gender"
                            onChange={(event)=>{ this.changeState(event); this.validator.showMessageFor('género') }}
                            onBlur={()=>this.validator.showMessageFor('género')}
                            multiple className="multiple"
                    >
                        {
                            this.genders.map((gender, index)=>
                                <option key={index} value={gender}>{gender}</option>
                            )
                        }

                    </select>
        
                    {this.validator.message('género', this.state.film.gender, 'required')}

                </div>
        
                <div className="form-group">
                    <label htmlFor="year">Año</label>
                    <input type="text" name="year"
                           onChange={this.changeState}
                           onBlur={()=>this.validator.showMessageFor('año')}
                           onKeyDown={()=>this.validator.showMessageFor('año')}
                    />

                    {this.validator.message('año', this.state.film.year, 'required|year')}

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
        
                    {this.validator.message('resolución', this.state.film.resolution, 'required')}

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
        
                    {this.validator.message('códec', this.state.film.codec, 'required')}

                </div>
        
                <div className="form-group">
                    <label htmlFor="size">Tamaño</label>
                    <input type="text" name="size"
                           onChange={this.changeState}
                           onBlur={()=>this.validator.showMessageFor('tamaño')}
                           onKeyDown={()=>this.validator.showMessageFor('tamaño')}/>
        
                    {this.validator.message('tamaño', this.state.film.size, 'required|size')}

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

                    {this.validator.message('visto', this.state.film.viewed, 'required')}

                </div>
        
                <div className="form-group">
                    <label htmlFor="synopsis">Sinopsis</label>
                    <textarea name="synopsis"
                              onChange={this.changeState}
                              onBlur={()=>this.validator.showMessageFor('sinopsis')}
                              onKeyDown={()=>this.validator.showMessageFor('sinopsis')}
                    >
                    </textarea>

                    {this.validator.message('sinopsis', this.state.film.synopsis, 'required')}

                </div>
        
                <div className="form-group">
                    <label htmlFor="image">Imagén</label>
                    <input type="url" name="image"
                        placeholder="https://example.jpg | jpeg | gif | png"
                        onChange={this.changeState}
                        onBlur={()=>this.validator.showMessageFor('imágen')}
                        onKeyDown={()=>this.validator.showMessageFor('imágen')}
                    />
        
                    {this.validator.message('imágen', this.state.film.image, 'imageUrl')}
                    
                </div>
        
                {/*LIMPIAR FLOTADOS*/}
                <div className="clearfix"></div>
        
                <input type="submit" value="CREAR" className="btn btn-success" />
        
            </form>
        
          </section>

        );

    }

}

export default FilmNew;