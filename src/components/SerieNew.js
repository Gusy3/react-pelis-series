import React, { Component } from 'react';
import environments from '../environments';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';

class SerieNew extends Component{

    // Url api
    apiUrl = environments.apiUrl;

    // Variables con valores para los campos select
    genders = environments.genders;

    state = {
        serie: {image: ''},
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
            serie: {
                ...this.state.serie, [field]: value
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

    saveSerie = (event)=>{

        event.preventDefault();

        console.log(this.state.serie);

        if(this.validator.allValid()){

            axios.post(this.apiUrl+'serie/save', this.state.serie)

                .then(response => {

                    if(response.data.serie){

                        this.setState({

                            serie: response.data.serie,
                            status: 'success'

                        });

                        // ALERTA

                        swal(
                            '¡¡¡Serie creada!!!',
                            'La serie se ha creado correctamente',
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

            return <Navigate to="/series" />;

        }

        return(

            <section id="content">

            <h1 className="subheader">CREAR SERIE</h1>
        
            <form className="mid-form" onSubmit={this.saveSerie}>
        
                <div className="form-group">
                    <label htmlFor="title">Título</label>
                    <input type="text" name="title"
                           onChange={this.changeState}
                           onBlur={()=>this.validator.showMessageFor('título')}
                           onKeyDown={()=>this.validator.showMessageFor('título')}
                    />

                    {this.validator.message('título', this.state.serie.title, 'required')}

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
        
                    {this.validator.message('género', this.state.serie.gender, 'required')}

                </div>
        
                <div className="form-group">
                    <label htmlFor="year">Año</label>
                    <input type="text" name="year"
                           onChange={this.changeState}
                           onBlur={()=>this.validator.showMessageFor('año')}
                           onKeyDown={()=>this.validator.showMessageFor('año')}
                    />
        
                    {this.validator.message('año', this.state.serie.year, 'required|year')}

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

                    {this.validator.message('visto', this.state.serie.viewed, 'required')}

                </div>
        
                <div className="form-group">
                    <label htmlFor="synopsis">Sinopsis</label>
                    <textarea name="synopsis"
                              onChange={this.changeState}
                              onBlur={()=>this.validator.showMessageFor('sinopsis')}
                              onKeyDown={()=>this.validator.showMessageFor('sinopsis')}
                    >
                    </textarea>

                    {this.validator.message('sinopsis', this.state.serie.synopsis, 'required')}

                </div>
        
                <div className="form-group">
                    <label htmlFor="image">Imagén</label>
                    <input type="url" name="image"
                        placeholder="https://example.jpg | jpeg | gif | png"
                        onChange={this.changeState}
                        onBlur={()=>this.validator.showMessageFor('imágen')}
                        onKeyDown={()=>this.validator.showMessageFor('imágen')}
                    />
        
                    {this.validator.message('imágen', this.state.serie.image, 'imageUrl')}
                    
                </div>
        
                {/*LIMPIAR FLOTADOS*/}
                <div className="clearfix"></div>
        
                <input type="submit" value="CREAR" className="btn btn-success" />
        
            </form>
        
          </section>

        );

    }

}

export default SerieNew;