import React, { useState, useEffect } from 'react'

export default function SearchBar({items}){

//const SearchBar = ({items}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
     const handleChange = event => {
        setSearchTerm(event.target.value);
    };
    useEffect(() => {
        const results = items.filter(deivce =>
            deivce.nombre.toLowerCase().includes(searchTerm)
        );
        setSearchResults(results);
    }, [searchTerm]);

    return (
        <div>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleChange}
            />
            <ul>
                {searchResults.map(item => (
                    <li key={item.id}>{items}</li>
                ))}
            </ul>
        </div>
    );
}