import React, { useEffect, useRef, useState, useCallback } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import './MentionSearch.css';
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
        className={'mention-search-dropdown'}
        value={value}
        onChange={onChange}
        options={options}
        isSearchable={false}
        styles={DropdownStyles}
    />
);

const SearchTextBox = ({ value, onChange, onKeyPress, placeholder, addon1, addon2 }) => (
    <div className="mention-search-bar">
        {addon1}
        <input
            type="text"
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            placeholder={placeholder}
            className="mention-search-input"
        />
        {addon2}
    </div>
);

const SearchBar = (props) => {
    const options = [
        { value: "Movie", label: 'Movie' },
        { value: "TVShow", label: 'TV Show' },
        { value: "celebrity", label: 'Celebrity' },
        { value: "user", label: 'User' }
    ];
    const [searchType, setSearchType] = useState(options[0]);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const resultsRef = useRef(null);
    const debounceTimeout = useRef(null);

    const debounce = (func, delay) => {
        return (...args) => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            debounceTimeout.current = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

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
        else if (searchType.value === 'tvshow') {
            await performSearch('show', searchInput, 'title', 'show');
        }
    };

    const fetchSearchResults = async () => {
        try {
            const response = await axios.get(`http://localhost:3333/api/${searchType.value}/search/${searchInput}`, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error(`ERROR: Could not fetch search results:`, error);
        }
    };

    const debouncedFetchSearchResults = useCallback(debounce(fetchSearchResults, 500), [searchInput, searchType]);

    useEffect(() => {
        if (searchInput) {
            debouncedFetchSearchResults();
        } else {
            setSearchResults([]);
        }
    }, [searchInput, searchType, debouncedFetchSearchResults]);

    const handleResultClick = (result) => {
        console.log(result)
        let type = searchType.value;
        let name;
        let id;

        if (type === 'celebrity') {
            name = result.name;
            id = result.celebrityId;
        } else if (type === 'user') {
            name = result.username;
            id = result.userId;
        } else {
            name = result.title;
            id = result.showId;
            type = 'show'
        }
        const selectedResult = { type, name, id };
        props.onResultSelect(selectedResult);

        return selectedResult;
    };

    const handleClickOutside = (event) => {
        if (resultsRef.current && !resultsRef.current.contains(event.target)) {
            setSearchResults([]);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <SearchTextBox
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleEnterPress}
                placeholder="Search"
                addon1={<Dropdown value={searchType} onChange={handleSelect} options={options} />}
            />
            {searchResults.length > 0 && (
                <div className="mention-search-results" ref={resultsRef}>
                    {searchResults.map((result) => (
                        <div
                            key={searchType.value === 'celebrity' ? result.name : searchType.value === 'user' ? result.username : result.id}
                            onClick={() => handleResultClick(result)}
                            className="mention-search-result-item"
                        >
                            <img src={result.image} alt={result.title || result.name || result.username} className="mention-result-image" />
                            {searchType.value === 'celebrity' ? result.name : searchType.value === 'user' ? result.username : result.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
