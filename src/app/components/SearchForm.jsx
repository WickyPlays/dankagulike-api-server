"use client";

import { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../page.scss";

export default function SearchForm({ initialSearchBy, initialSearch, onSearch }) {
  const [currentSearchBy, setCurrentSearchBy] = useState(initialSearchBy);
  const [currentSearch, setCurrentSearch] = useState(initialSearch);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(currentSearchBy, currentSearch);
  };

  return (
    <form onSubmit={handleSearchSubmit} className="search-form">
      <Select
        value={currentSearchBy}
        onChange={(e) => setCurrentSearchBy(e.target.value)}
      >
        <MenuItem value="title">By title</MenuItem>
        <MenuItem value="publisher">By publisher</MenuItem>
      </Select>
      <TextField
        id="search"
        value={currentSearch}
        onChange={(e) => setCurrentSearch(e.target.value)}
      />
      <Button type="submit" className="btn-search">
        Search
      </Button>
    </form>
  );
}
