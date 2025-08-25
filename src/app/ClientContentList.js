"use client";

import "./styles.scss";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

const columns = [
  { id: "id", label: "ID", sortable: true },
  { id: "type", label: "Type", sortable: true },
  { id: "title", label: "Title", sortable: true },
  { id: "publisher", label: "Publisher", sortable: true },
  { id: "difficulty", label: "Difficulty", sortable: false },
  { id: "lua", label: "Lua", sortable: true },
  { id: "date", label: "Date", sortable: true },
  { id: "downloads", label: "Downloads", sortable: true },
  { id: "score", label: "Score", sortable: true },
  { id: "download", label: "Download", sortable: false },
];

export default function ClientContentList({
  initialContents,
  currentPage,
  totalPages,
  totalCount,
  searchBy,
  search,
  sortBy,
  sortOrder,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentSearchBy, setCurrentSearchBy] = useState(searchBy);
  const [currentSearch, setCurrentSearch] = useState(search);

  const handleSort = (column) => {
    const newSortOrder =
      sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", column);
    params.set("sortOrder", newSortOrder);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (event, newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("searchBy", currentSearchBy);
    params.set("search", currentSearch);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="container">
      <Box className="title-container">
        <Box>
          <Typography className="title" variant="h4">
            DankaguLike Chart List
          </Typography>
        </Box>
        <Box className="search-container">
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('https://docs.google.com/spreadsheets/d/1PeaP2J8wSOittu1ocdCC-AQNb6ph6QHnBl7g1Xfz_Ig/edit?gid=1184683173#gid=1184683173')}
          >
            Request new chart
          </Button>
        </Box>
      </Box>
      <span id="resultCount">{totalCount} results</span>
      <TableContainer component={Paper} className="table-wrapper">
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  className={
                    col.sortable
                      ? sortBy === col.id
                        ? `sortable sorted-${sortOrder}`
                        : "sortable"
                      : ""
                  }
                >
                  {col.sortable ? (
                    <TableSortLabel
                      IconComponent={() => null}
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder : "asc"}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                      <span className="sort-arrow" />
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {initialContents.map((content) => (
              <TableRow key={content.id}>
                <TableCell>{content.id}</TableCell>
                <TableCell>{content.contentType}</TableCell>
                <TableCell>{content.title}</TableCell>
                <TableCell>{content.publisher}</TableCell>
                <TableCell>
                  <div className="difficulty">
                    {content.songInfo.difficulties.map((level, idx) => (
                      <div
                        key={idx}
                        className="diff"
                        id={`diff-${
                          ["easy", "normal", "hard", "extra", "lunatic"][idx]
                        }`}
                      >
                        {level > 0 ? level : "-"}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{content.songInfo.hasLua ? "Yes" : "No"}</TableCell>
                <TableCell>{content.date}</TableCell>
                <TableCell>{content.downloadCount}</TableCell>
                <TableCell>{content.voteAverageScore.toFixed(1)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    className="btn-download"
                    href={content.downloadUrl}
                    target="_blank"
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {initialContents.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-unavailable"
                >
                  No contents available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="pagination">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </div>
  );
}
