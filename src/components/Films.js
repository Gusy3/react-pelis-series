import React, { Component } from 'react';
import axios from 'axios';
import environments from '../environments';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import 'moment/locale/es';
const images = require.context("../assets/images");

class Films extends Component{

    // Url de la api
    apiUrl = environments.apiUrl;

    // Variables de Paginación
    filmsPerPage = 20;
    page = {selected: 0};

    state = {
        films: [],
        filteredFilms: [],
        status: 'error'
    }

    componentDidMount(){

        if(this.props.search && this.props.search!==null && this.props.search!==undefined){

            this.getFilmsBySearch(this.page);

        }else{

            this.getFilms(this.page);

        }

    }

    componentDidUpdate(prevProps) {

        if (this.props.search !== prevProps.search) {

            this.page = {selected: 0};

            this.getFilmsBySearch(this.page);

        }

    }

    getFilms = (currentPage)=>{

        this.page = currentPage;

        axios.get(this.apiUrl+'films')

            .then(response=>{

                this.setState({

                    films: response.data.films,
                    filteredFilms: response.data.films.slice(currentPage.selected * this.filmsPerPage, (currentPage.selected+1) * this.filmsPerPage),
                    status: 'success'

                });

        });

    }

    getFilmsBySearch = (currentPage)=>{

        this.page = currentPage;

        axios.get(this.apiUrl+'search', {params: this.props.search})
        .then(response=>{

            this.setState({

                films: response.data.films,
                filteredFilms: response.data.films.slice(currentPage.selected * this.filmsPerPage, (currentPage.selected+1) * this.filmsPerPage),
                status: 'success'

            });

        })
        .catch(error=>{

            this.setState({

                films: [],
                status: 'success'

            });

            console.log(error);

        });

    }

    render(){

        if(this.state.films.length>0 && this.state.status==='success'){

            return(

                <section id="content">

                    <h1 className="subheader">PELÍCULAS</h1>
    
                    <div id="items">

                    {
                        this.state.filteredFilms.map((film, index)=>{

                            return(
            
                                <Link to={"/pelicula/"+film._id} key={index} className="item" >

                                    {
                                        film.image==='' ? (

                                            <img src={ images('./no-image.png') } alt={film.title}/>

                                        ):(

                                             <img src={ film.image } alt={film.title} />

                                        )

                                    }

                                    <div className="img-footer">PELÍCULA</div>

                                    <h2>{ film.title }</h2>

                                    <p>Añadido { moment(film.created_at).fromNow() }</p>

                                </Link>
                    
                            );
    
                        })
                    }

                    </div>

                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        previousLabel="<"
                        forcePage={this.page.selected}
                        onPageChange={this.props.search?this.getFilmsBySearch:this.getFilms}
                        pageRangeDisplayed={3}
                        pageCount={Math.ceil(this.state.films.length / this.filmsPerPage)}
                        className="pagination"
                        renderOnZeroPageCount={null}
                    />

                </section>

            );


        }else if(this.state.films.length===0 && this.state.status==='success'){

            return(
                    
                <section id="content">

                    <h1 className="subheader">PELÍCULAS</h1>

                    <div id="items">

                        <p>No hay películas para mostrar</p>

                    </div>
        
                </section>

            );

        }else{

            return(
                
                <section id="content">

                    <h1 className="subheader">PELÍCULAS</h1>

                    <div id="items">

                        <p>Cargando...</p>

                    </div>
        
                </section>

            );

        }

    }

}

export default Films;