import React, { Component } from 'react';
import axios from 'axios';
import environments from '../environments';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import 'moment/locale/es';
const images = require.context("../assets/images");

class Series extends Component{

    // Url de la api
    apiUrl = environments.apiUrl;

    // Variables de Paginación
    seriesPerPage = 20;
    page = {selected: 0};

    state = {
        series: [],
        filteredSeries: [],
        status: 'error'
    }

    componentDidMount(){

        this.getSeries(this.page);

    }

    getSeries = (currentPage)=>{

        this.page = currentPage;

        axios.get(this.apiUrl+'series')

            .then(response=>{

                this.setState({

                    series: response.data.series,
                    filteredSeries: response.data.series.slice(currentPage.selected * this.seriesPerPage, (currentPage.selected+1) * this.seriesPerPage),
                    status: 'success'

                });

        });

    }

    render(){

        if(this.state.series.length>0 && this.state.status==='success'){

            return(

                <section id="content">

                    <h1 className="subheader">SERIES</h1>
    
                    <div id="items">

                    {
                        this.state.filteredSeries.map((serie, index)=>{

                            return(
            
                                <Link to={"/serie/"+serie._id} key={index} className="item" >

                                    {
                                        serie.image==='' ? (

                                            <img src={ images('./no-image.png') } alt={serie.title}/>

                                        ):(

                                        <img src={ serie.image } alt={serie.title} />

                                        )

                                    }
                                    
                                    <div className="img-footer">SERIE</div>

                                    <h2>{ serie.title }</h2>

                                    <p>Añadido { moment(serie.created_at).fromNow() }</p>

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
                        pageCount={Math.ceil(this.state.series.length / this.seriesPerPage)}
                        className="pagination"
                        renderOnZeroPageCount={null}
                    />

                </section>

            );


        }else if(this.state.series.length===0 && this.state.status==='success'){

            return(
                    
                <section id="content">

                    <h1 className="subheader">SERIES</h1>

                    <div id="items">

                        <p>No hay series para mostrar</p>

                    </div>
        
                </section>

            );

        }else{

            return(
                
                <section id="content">

                    <h1 className="subheader">SERIES</h1>

                    <div id="items">

                        <p>Cargando...</p>

                    </div>
        
                </section>

            );

        }

    }

}

export default Series;