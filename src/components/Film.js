import React, {Component} from 'react';
import axios from 'axios';
import environments from '../environments';
import {Link, Navigate, useParams} from 'react-router-dom';
import moment from 'moment';
import swal from 'sweetalert';
const images = require.context("../assets/images");


class Film extends Component{

    // Url de la api
    apiUrl = environments.apiUrl;

    state = {
        film: {},
        genders: '',
        status: 'error'
    }

    componentDidMount(){

        this.getFilm();

    }

    getFilm = ()=>{

        var id = this.props.filmId;

        axios.get(this.apiUrl+'film/'+id)

        .then(response=>{

            this.setState({

                film: response.data.film,
                genders: response.data.film.gender.join(', '),
                status: 'success'

            });

        });

    }

    deleteFilm = (filmId)=>{

        swal({
            title: "¿Estás seguro?",
            text: "¡Una vez borrado no podrás recuperarlo!",
            icon: "warning",
            buttons: [true, true],
            dangerMode: true
        })
        .then((willDelete)=>{

            if (willDelete){

                axios.delete(this.apiUrl+'film/'+filmId)

                .then(response=>{

                    this.setState({

                        film: response.data.film,
                        status: 'delete'

                    })

                })

                swal("¡La película ha sido borrada correctamente!", {
                    icon: "success",
                });

            }else{

                swal("¡Tranquilo nada se ha borrado!");
        
            }

        });


    }

    render(){

        var film = this.state.film;
        var genders = this.state.genders;

        if(this.state.status==='delete'){

            return <Navigate to={'/peliculas'} />;

        }

        return(

            <section id="content">

            <h1 className="subheader">{ film.title }</h1>

            <div className="center item-detail">

                <div className="data">

                    <div className="image">

                    {
                        film.image==='' ? (

                            <img src={images('./no-image.png')} alt={film.title}/>

                        ):(

                            <img src={film.image} alt={film.title} />

                        )

                    }

                    </div>
                    <div className="information">

                        <dl>

                            <dt>Año:</dt>
                            <dd>{film.year}</dd>

                            <dt>Versión:</dt>
                            <dd>{film.version}</dd>

                            <dt>Género:</dt>
                            <dd>{genders}</dd>
                            
                            <dt>Resolución:</dt>
                            <dd>{film.resolution}</dd>
                            
                            <dt>Codec:</dt>
                            <dd>{film.codec}</dd>
                            
                            <dt>Tamaño:</dt>
                            <dd>{film.size} GB</dd>

                            <dt>Creado:</dt>
                            <dd>{ moment(film.created_at).format('DD/MM/YYYY') }</dd>
                            
                            <dt>Visto:</dt>
                            <dd>{film.viewed}</dd>

                        </dl>

                    </div>

                </div>

                <div className="clearfix"></div>
                
                <div className="synopsis">

                    <h2>Sinopsis</h2>

                    <p>{ film.synopsis }</p>

                </div>

            </div>

            <div className="clearfix"></div>

            <div className="buttons">
                <Link to={"/pelicula/editar/"+film._id} className="btn btn-warning">Editar</Link>
                <Link className="btn btn-danger" onClick={()=>{this.deleteFilm(film._id)}}>Borrar</Link>
            </div>

            </section>

        );

    }

}

function GetFilmId(){

    let {id} = useParams();

    return <Film filmId={id} />

}

export default GetFilmId;