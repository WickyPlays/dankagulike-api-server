"use client";

import { useRouter } from "next/navigation";
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
import Button from "@mui/material/Button";
import "./PageContent.scss";

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

export default function ChartTable({
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

  const handleSort = (column) => {
    const newSortOrder =
      sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams({
      searchBy,
      search,
      sortBy: column,
      sortOrder: newSortOrder,
      page: "1",
    });
    router.push(`/?${params.toString()}`);
  };

  const handlePageChange = (event, newPage) => {
    const params = new URLSearchParams({
      searchBy,
      search,
      sortBy,
      sortOrder,
      page: newPage.toString(),
    });
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
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
                    onClick={async () => {
                      try {
                        await fetch(
                          `/api/contents/${content.id}/downloaded`,
                          {
                            method: "PUT",
                          }
                        );
                      } catch (error) {
                        console.error(
                          "Failed to update download count:",
                          error
                        );
                      }
                    }}
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
    </>
  );
}
