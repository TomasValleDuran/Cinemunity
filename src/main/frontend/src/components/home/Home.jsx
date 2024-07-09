import React, {useEffect} from 'react';
import './Home.css';
import Header from '../shared/header/Header';
import axios from "axios";

import withAuth from '../hoc/withAuth';
import ShowPreviewCarrousel from "../shared/show-preview/ShowPreviewCarrousel";

const Home = () => {
    const [allShows, setAllShows] = React.useState([]);
    const [topRankedMovies, setTopRankedMovies] = React.useState([]);
    const [topRankedTVShows, setTopRankedTVShows] = React.useState([]);

    const fetchShows = async (endpoint) => {
        try {
            const response = await axios.get(`http://localhost:3333/api/show/${endpoint}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log(`${endpoint}:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            return [];
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const shows = await fetchShows('getAll');
            const rankedMovies = await fetchShows('getTopRankedMovies');
            const rankedTVShows = await fetchShows('getTopRankedTVShows');

            setAllShows(shows);
            setTopRankedMovies(rankedMovies);
            setTopRankedTVShows(rankedTVShows);
        };

        fetchData();
    }, []);

    return (
        <div className="home-container">
            <Header/>
            <div className={"header"}>
                <div className="title">
                    <div className="tittle-text-review">Top Movies</div>
                </div>
            </div>
            <ShowPreviewCarrousel posts={topRankedMovies} slide={true}/>
            <div className={"header"}>
                <div className="title">
                    <div className="tittle-text-review">Top Tv Shows</div>
                </div>
            </div>
            <ShowPreviewCarrousel posts={topRankedTVShows} slide={true}/>
            <div className={"header"}>
                <div className="title">
                    <div className="tittle-text-review">All Shows</div>
                </div>
            </div>
            <ShowPreviewCarrousel posts={allShows} slide={false}/>
        </div>
    );
};

const ProtectedHome = withAuth(Home);
export default ProtectedHome;