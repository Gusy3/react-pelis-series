import React, {Component} from 'react';
import axios from 'axios';
import environments from '../environments';
import {Link, useSearchParams} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import 'moment/locale/es';
const images = require.context("../assets/images");

class Search extends Component{

    // Url de la api
    apiUrl = environments.apiUrl;

    // Variables de Paginación
    itemsPerPage = 20;
    page = {selected: 0};

    state = {
        films_series: [],
        filteredFilmsSeries: [],
        status: 'error'
    }

    componentDidMount(){

        this.search(this.page);

    }

    componentDidUpdate(prevProps) {

        if (this.props.queryParams !== prevProps.queryParams){

            this.search({selected: 0});

        }

    }

    search = (currentPage)=>{

        var searchParams = this.props.queryParams;
        var title = searchParams.get("title");
        this.page = currentPage;

        axios.get(this.apiUrl+'search?title='+title)

            .then(response=>{

                this.setState({

                    films_series: response.data.films_series,
                    filteredFilmsSeries: response.data.films_series.slice(currentPage.selected * this.itemsPerPage, (currentPage.selected+1) * this.itemsPerPage),
                    status: 'success'

                });

        });

    }

    render(){

        if(this.state.films_series.length>0 && this.state.status==='success'){

            var searchParams = this.props.queryParams;
            var search = searchParams.get("title");

            return(
    
                <section id="content">

                    <h1 className="subheader">BUSQUEDA</h1>

                    <h4>Resultados encontrados que incluyen "{search}"</h4>
    
                    <div id="items">

                    {
                        this.state.filteredFilmsSeries.map((item, index)=>{

                            return(
            
                                <Link to={item.category==='pelicula' ? '/pelicula/'+item._id : '/serie/'+item._id} key={index} className="item" >

                                    {
                                        item.image==='' ? (

                                            <img src={ images('./no-image.png') } alt={item.title}/>

                                        ):(

                                        <img src={item.image} alt={item.title} />

                                        )

                                    }

                                    <div className="img-footer">{item.category==='pelicula' ? 'PELÍCULA' : 'SERIE'}</div>

                                    <h2>{ item.title }</h2>

                                    <p>Añadido { moment(item.created_at).fromNow() }</p>

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
                        onPageChange={this.search}
                        pageRangeDisplayed={3}
                        pageCount={Math.ceil(this.state.films_series.length / this.itemsPerPage)}
                        className="pagination"
                        renderOnZeroPageCount={null}
                    />

                </section>
    
            );
    
    
        }else if(this.state.films_series.length===0 && this.state.status==='success'){
    
            return(
                        
                    <section id="content">
    
                        <h1 className="subheader">BUSQUEDA</h1>
    
                        <div id="items">
    
                            <p>No hay peliculas ni series encontradas con esta busqueda</p>
    
                        </div>
            
                    </section>
    
                );
    
        }else{
    
            return(
                    
                <section id="content">

                    <h1 className="subheader">BUSQUEDA</h1>

                    <div id="items">

                        <p>Cargando...</p>

                    </div>
        
                </section>
    
            );
    
        }

    }

}

function SearchFilms(){

    let [searchParams] = useSearchParams();

    return <Search queryParams={searchParams} />

}

export default SearchFilms;