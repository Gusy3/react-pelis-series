import React, {Component} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

// IMPORTAR COMPONENTES
import Home from "./components/Home";
import Login from "./components/Login";
import Films from "./components/Films";
import FilmNew from "./components/FilmNew";
import Film from "./components/Film";
import FilmEdit from "./components/FilmEdit";
import Series from "./components/Series";
import SerieNew from "./components/SerieNew";
import Serie from "./components/Serie";
import SerieEdit from "./components/SerieEdit";
import SeasonNew from "./components/SeasonNew";
import SeasonEdit from "./components/SeasonEdit";
import ChapterNew from "./components/ChapterNew";
import ChapterEdit from "./components/ChapterEdit";
import Search from "./components/Search";
import Error from "./components/Error";
import AuthGuard from "./guards/AuthGuard";

class Router extends Component{

    render(){

        return(

            /* CONFIGURAR RUTAS Y PÁGINAS */

            <BrowserRouter>

                <Routes>

                    <Route exact path="/login" element={<Login />} />

                    <Route element={<AuthGuard />}>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/home" element={<Home />} />
                        <Route exact path="/peliculas" element={<Films />} />
                        <Route exact path="/crear-pelicula" element={<FilmNew />} />
                        <Route exact path="/pelicula/:id" element={<Film />} />
                        <Route exact path="/pelicula/editar/:id" element={<FilmEdit />} />
                        <Route exact path="/series" element={<Series />} />
                        <Route exact path="/crear-serie" element={<SerieNew />} />
                        <Route exact path="/serie/:id" element={<Serie />} />
                        <Route exact path="/serie/editar/:id" element={<SerieEdit />} />
                        <Route exact path="/serie/:id/crear-temporada" element={<SeasonNew />} />
                        <Route exact path="/serie/:serieId/editar-temporada/:seasonId" element={<SeasonEdit />} />
                        <Route exact path="/serie/:serieId/season/:seasonId/crear-capitulo" element={<ChapterNew />} />
                        <Route exact path="/serie/:serieId/editar-capitulo/:chapterId" element={<ChapterEdit />} />
                        <Route path="/buscar" element={<Search />} />
                        <Route path="*" element={<Error />} />
                    </Route>

                </Routes>

            </BrowserRouter>
        );

    }

}

export default Router;