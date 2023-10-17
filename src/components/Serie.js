import React, {Component} from 'react';
import axios from 'axios';
import environments from '../environments';
import {Link, Navigate, useParams} from 'react-router-dom';
import moment from 'moment';
import swal from 'sweetalert';
const images = require.context("../assets/images");

class Serie extends Component{

    // Url de la api
    apiUrl = environments.apiUrl;

    state = {
        serie: {
            seasons: []
        },
        genders: '',
        status: 'error',
        accordionActive: null
    }

    componentDidMount(){

        this.getSerie();

    }

    getSerie = ()=>{

        var serieId = this.props.serieId;

        axios.get(this.apiUrl+'serie/'+serieId)

        .then(response=>{

            this.setState({

                serie: {...this.state.serie, ...response.data.serie},
                genders: response.data.serie.gender.join(', ')

            });

            this.getSeasons(serieId);

        });

    }

    getSeasons = (serieId)=>{

        axios.get(this.apiUrl+'serie/'+serieId+'/seasons')

        .then(response=>{

            this.setState({

                serie: {
                    ...this.state.serie,
                    ...{
                        size: 0,
                        seasons: response.data.seasons,
                        totalSeasons: response.data.seasons.length
                    }
                }

            });

            for(let index = 0; index<this.state.serie.seasons.length; index++){

                this.getChapters(this.state.serie.seasons[index]._id, index);
  
              }

        });

    }

    getChapters = (seasonId, index)=>{

        axios.get(this.apiUrl+'season/'+seasonId+'/chapters')

        .then(response=>{

            let seasons = this.state.serie.seasons;
            seasons[index].chapters = response.data.chapters;
            seasons[index].totalChapters = response.data.chapters.length;
            seasons[index].size = parseFloat(this.addSize(response.data.chapters).toFixed(2));

            let serie = this.state.serie;
            serie.size = parseFloat((serie.size + seasons[index].size).toFixed(2));

            this.setState({

                serie: {
                    ...this.state.serie,
                    ...{
                        serie: serie,
                        seasons: seasons
                    }
                }

            });

        });

    }

    addSize = (array)=>{

        let size = 0;
    
        for (let i = 0; i<array.length; i++){
    
            size += array[i].size;
    
        }
    
        return size;
    
    }

    deleteSerie = (serieId)=>{

        swal({
            title: "¿Estás seguro?",
            text: "¡Una vez borrado no podrás recuperarlo!",
            icon: "warning",
            buttons: [true, true],
            dangerMode: true
        })
        .then((willDelete)=>{

            if (willDelete){

                axios.delete(this.apiUrl+'serie/'+serieId)

                .then(response=>{

                    this.setState({

                        serie: response.data.serie,
                        status: 'delete'

                    })

                })

                swal("¡La serie ha sido borrada correctamente!", {
                    icon: "success",
                });

            }else{

                swal("¡Tranquilo nada se ha borrado!");
        
            }

        });


    }

    deleteSeason = (seasonId)=>{

        swal({
            title: "¿Estás seguro?",
            text: "¡Una vez borrado no podrás recuperarlo!",
            icon: "warning",
            buttons: [true, true],
            dangerMode: true
        })
        .then((willDelete)=>{

            if (willDelete){

                axios.delete(this.apiUrl+'season/'+seasonId)

                .then(()=>{

                    this.getSeasons(this.state.serie._id);

                })

                swal("¡La temporada ha sido borrada correctamente!", {
                    icon: "success",
                });

            }else{

                swal("¡Tranquilo nada se ha borrado!");
        
            }

        });


    }

    deleteChapter = (chapterId)=>{

        swal({
            title: "¿Estás seguro?",
            text: "¡Una vez borrado no podrás recuperarlo!",
            icon: "warning",
            buttons: [true, true],
            dangerMode: true
        })
        .then((willDelete)=>{

            if (willDelete){

                axios.delete(this.apiUrl+'chapter/'+chapterId)

                .then(()=>{

                    this.getSeasons(this.state.serie._id);

                })

                swal("¡El capítulo ha sido borrado correctamente!", {
                    icon: "success",
                });

            }else{

                swal("¡Tranquilo nada se ha borrado!");
        
            }

        });


    }

    toggle = (index) => {

        if(this.state.accordionActive === index){

            return this.setState({
                accordionActive: null,
            });

        }

        this.setState({
            accordionActive: index,
        });

    }

    render(){

        var serie = this.state.serie;
        var genders = this.state.genders;

        if(this.state.status==='delete'){

            return <Navigate to={'/series'} />;

        }

        return(

            <section id="content">

                <h1 className="subheader">{ serie.title }</h1>

                <div className="center item-detail">

                    <div className="data">

                        <div className="image">

                        {
                            serie.image==='' ? (

                                <img src={ images('./no-image.png') } alt={serie.title}/>

                            ):(

                                <img src={ serie.image } alt={serie.title} />

                            )

                        }

                        </div>
                        <div className="information">

                            <dl>

                                <dt>Año:</dt>
                                <dd>{serie.year}</dd>

                                <dt>Género:</dt>
                                <dd>{genders}</dd>

                                <dt>Temporadas:</dt>
                                <dd>{serie.totalSeasons}</dd>
                                
                                <dt>Tamaño:</dt>
                                <dd>{serie.size} GB</dd>

                                <dt>Creado:</dt>
                                <dd>{ moment(serie.created_at).format('DD/MM/YYYY') }</dd>
                                
                                <dt>Visto:</dt>
                                <dd>{serie.viewed}</dd>

                            </dl>

                        </div>

                    </div>

                    <div className="clearfix"></div>
                    
                    <div className="synopsis">

                        <h2>Sinopsis</h2>

                        <p>{ serie.synopsis }</p>

                    </div>

                    <div className="clearfix"></div>

                    <div className="buttons">
                        <Link to={"/serie/"+serie._id+"/crear-temporada"} className="btn btn-season">Añadir Temporada</Link>
                        <Link to={"/serie/editar/"+serie._id} className="btn btn-warning">Editar</Link>
                        <Link className="btn btn-danger" onClick={()=>{this.deleteSerie(serie._id)}}>Borrar</Link>
                    </div>

                    <div className="clearfix"></div>

                    <div className="accordion">

                    {

                        serie.seasons.length>0 &&

                            serie.seasons.map((season, index)=>{

                                return(

                                    <div className="accordion-item" key={index}>

                                        <div className={this.state.accordionActive===index ? 'accordion-item-header-expanded' : 'accordion-item-header'}>

                                            <div className="accordion-item-description">
                                                <strong>{season.title}</strong> ({season.totalChapters} Capítulos) -
                                                <strong> Tamaño:</strong> {season.size} GB / 
                                                <strong> Visto:</strong> {season.viewed}
                                            </div>

                                            <div className="accordion-icons">

                                                <Link to={"season/"+season._id+"/crear-capitulo"}>
                                                    <img src={ images('./add_icon_white.png') } title="Añadir Capítulo" alt="Añadir Capítulo" className="accordion-icon" />
                                                </Link>
                                                <Link to={"editar-temporada/"+season._id}>
                                                    <img src={ images('./edit_icon_white.png') } title="Editar Temporada" alt="Editar Temporada" className="accordion-icon" />
                                                </Link>
                                                <img src={ images('./delete_icon_white.png') } title="Borrar Temporada" alt="Borrar Temporada" onClick={ ()=>this.deleteSeason(season._id) } className="accordion-icon" />

                                                {
                                                    this.state.accordionActive===index ? (
                                                
                                                        <img src={ images('./arrow_up_icon_white.png') } title="Ocultar Capítulos" alt="Ocultar Capítulos" onClick={ ()=>this.toggle(index) } className="accordion-icon accordion-arrow-up" />

                                                    ):(

                                                        <img src={ images('./arrow_down_icon_white.png') } title="Mostrar Capítulos" alt="Mostrar Capítulos" onClick={ ()=>this.toggle(index) } className="accordion-icon accordion-arrow-down" />

                                                    )
                                                
                                                }

                                            </div>

                                        </div>

                                        {
                                            season.chapters && season.chapters.length>0 ? (

                                                season.chapters.map((chapter, index2)=>{

                                                    return(
                                                
                                                        <div className={this.state.accordionActive === index ? 'accordion-item-body-open' : 'accordion-item-body'} key={index+'.'+index2}>
                                                            <div className="accordion-item-description">
                                                                <strong>* {chapter.title}</strong> ({chapter.resolution} {chapter.codec}) -
                                                                <strong> Tamaño:</strong> {chapter.size} GB / 
                                                                <strong> Visto:</strong> {chapter.viewed}
                                                            </div>
    
                                                            <div className="accordion-icons">

                                                                <Link to={"editar-capitulo/"+chapter._id}>
                                                                    <img src={ images('./edit_icon_white.png') } title="Editar Capítulo" alt="Editar Capítulo" className="accordion-icon" />
                                                                </Link>
                                                                <img src={ images('./delete_icon_white.png') } title="Borrar Capítulo" alt="Borrar Capítulo" onClick={ ()=>this.deleteChapter(chapter._id) } className="accordion-icon" />

                                                            </div>
    
                                                        </div>
                                                    );
                                                })
                
                                            ):(
                                                               
                                                <div className={this.state.accordionActive === index ? 'accordion-item-body-open' : 'accordion-item-body'} key={index+'.'+1}>
                                                    Esta temporada no tiene capítulos
                                                </div>
                
                                            )

                                        }

                                    </div>

                                );
                            })
                    }

                    </div>

                </div>

            </section>

        );

    }

}

function GetSerieId(){

    let {id} = useParams();

    return <Serie serieId={id} />

}

export default GetSerieId;