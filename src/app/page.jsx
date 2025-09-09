"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { convertLinkToDownloadable } from "../lib/converter";
import ChartTable from "./components/ChartTable";
import SearchForm from "./components/SearchForm";
import "./page.scss";

function transformContent(content) {
  return {
    id: Number(content.id),
    contentType: Number(content.contentType),
    title: content.title || "",
    publisher: content.publisher || "",
    description: content.description || "",
    downloadUrl: convertLinkToDownloadable(content.downloadUrl || ""),
    imageUrl: content.imageUrl || "",
    date: new Date(content.date),
    downloadCount: Number(content.downloadCount || 0),
    voteAverageScore: Number(content.voteAverageScore || 0),
    songInfo: content.songInfo || {
      difficulties: [0, 0, 0, 0, 0],
      hasLua: false,
    },
  };
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchBy = searchParams.get("searchBy") || "title";
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const sortBy = searchParams.get("sortBy") || "id";
  const sortOrder =
    searchParams.get("sortOrder")?.toLowerCase() === "asc" ? "asc" : "desc";
  const itemsPerPage = 15;

  const [contents, setContents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContents() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          itemsPerPage: itemsPerPage.toString(),
          sortBy,
          sortOrder,
          ...(search.trim() && { searchBy, search }),
        });

        const response = await fetch(`/api/contents?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        const fetchedContents = data.contents || [];
        const count = data.totalCount || fetchedContents.length;
        const pages = Math.ceil(count / itemsPerPage);

        const formatted = fetchedContents.map((content) => {
          const transformed = transformContent(content);
          return {
            ...transformed,
            date: transformed.date
              .toISOString()
              .slice(0, 10)
              .replace(/-/g, "/"),
          };
        });

        setContents(formatted);
        setTotalCount(count);
        setTotalPages(pages);
      } catch (err) {
        console.error("API fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContents();
  }, [page, sortBy, sortOrder, searchBy, search]);

  if (loading) {
    return <div className="container">Loading charts...</div>;
  }

  if (error) {
    return <div className="container">An error occurred: {error}</div>;
  }

  return (
    <div className="container">
      <Box className="title-container">
        <Box>
          <Typography className="title" variant="h4">
            DankaguLike Chart List
          </Typography>
        </Box>
        <Box className="search-container">
          <SearchForm
            initialSearchBy={searchBy}
            initialSearch={search}
            onSearch={(searchBy, search) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("searchBy", searchBy);
              params.set("search", search);
              params.set("page", "1");
              router.push(`/?${params.toString()}`);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              window.open(
                "https://docs.google.com/spreadsheets/d/1PeaP2J8wSOittu1ocdCC-AQNb6ph6QHnBl7g1Xfz_Ig/edit?gid=1184683173#gid=1184683173",
                "_blank"
              )
            }
          >
            Request new chart
          </Button>
        </Box>
      </Box>
      <span id="resultCount">{totalCount} results</span>
      <ChartTable
        initialContents={contents}
        currentPage={page}
        totalPages={totalPages}
        totalCount={totalCount}
        searchBy={searchBy}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
    </div>
  );
}
