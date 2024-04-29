import React, {useState} from 'react';
import Select from 'react-select';
import searchIcon from '../../../assets/search-icon.png';
import {useNavigate} from 'react-router-dom';
import './SearchBar.css';
import axios from "axios";

const DropdownStyles = {

    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#dedada',
        border: 'none',
        borderColor: state.isFocused ? 'blue' : 'gray',
        boxShadow: state.isFocused ? '0 0 0 1px blue' : 'none',
        ':hover': {
            borderColor: state.isFocused ? 'blue' : 'gray'
        },
        borderRadius: '50px'
    }),

    option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        backgroundColor: state.isSelected ? 'blue' : 'white',
        ':hover': {
            backgroundColor: 'lightgray',
        }
    }),

    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: 'gray',
        ':hover': {
            color: 'black',
        },
        borderLeft: 'none',
        padding: 5,
        alignItems: 'center'
    }),

    clearIndicator: (provided, state) => ({
        ...provided,
        color: 'red',
    })
};

const Dropdown = ({ value, onChange, options }) => (
    <Select
        className={'search-dropdown'}
        value={value}
        onChange={onChange}
        options={options}
        isSearchable={false}
        styles={DropdownStyles}
    />
);

const SearchTextBox = ({value, onChange, onKeyPress, placeholder, addon1, addon2}) => (
    <div className="search-bar">
        {addon1}
        <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
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

    const handleEnterPress = (e) => {
        if (e.key === 'Enter') {
            search();
        }
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
                window.location.reload();
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
            onKeyPress={handleEnterPress}
            placeholder="Search"
            addon1={<Dropdown value={searchType} onChange={handleSelect} options={options}/>}
            addon2={
                <img
                    src={searchIcon}
                    alt="Search"
                    className="btn-search"
                    onClick={search}
                />}
        />
    );
};

export default SearchBar;