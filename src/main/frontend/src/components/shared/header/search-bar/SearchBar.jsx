import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import logo from "../../../assets/logo.png";
import search from '../../../assets/search.png';
import {Link, useNavigate} from 'react-router-dom';
import './SearchBar.css';
import axios from "axios";

const Dropdown = ({ value, onChange, options }) => (
    <Select
        className={'search-dropdown'}
        value={value}
        onChange={onChange}
        options={options}
        isSearchable={false}
    />
);

const SearchTextBox = ({value, onChange, placeholder, addon1, addon2 }) => (
    <div className="search-bar">
        {addon1}
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="search-input"
        />
        {addon2}
    </div>
);



const SearchBar = () => {
    const options = [
        { value: "movie", label: 'Movie' },
        { value: "tv show", label: 'TV Show' },
        { value: "celebrity", label: 'Celebrity' },
        { value: "user", label: 'User' }
    ];
    const [searchType, setSearchType] = useState(options[0]);
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();


    const handleSelect = selectedOption => {
        setSearchType(selectedOption);
    };

    const performSearch = async (endpoint, searchInput, successCriteria, navigatePath) => {
        try {
            const response = await axios.get(`http://localhost:3333/api/${endpoint}/get/${searchInput}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            if (response.data[successCriteria]) {
                console.log(response.data);
                navigate(`/${navigatePath}/${searchInput}`);
            } else {
                console.log(response.data);
            }
        } catch (error) {
            console.error(`ERROR: ${navigatePath} not found:`, error);
        }
    };

    const search = async () => {
        console.log(searchType);
        if (searchType.value === 'celebrity') {
            await performSearch('celebrity', searchInput, 'name', 'celebrity');
        }
        else if (searchType.value === 'user') {
            await performSearch('user', searchInput, 'username', 'user');
        }
        else if (searchType.value === 'movie') {
            await performSearch('show', searchInput, 'title', 'show');
        }
        else if (searchType.value === 'tv show') {
            await performSearch('show', searchInput, 'title', 'show');
        }
    };


    return (
        <SearchTextBox
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search"
            addon1={<Dropdown value={searchType} onChange={handleSelect} options={options}/>}
            addon2={<button className={"btn-search"} onClick={search}>Search</button>}
        />
    );
};

export default SearchBar;
