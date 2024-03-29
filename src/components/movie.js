import { deleteMovie, getMovies } from "../services/movieService";
import React, { Component } from "react";
import Pagination from "./commons/pagination";
import { paginate } from "../services/util";
import { getGenres } from "../services/genreService";
import MoviesTable from "./moviesTable";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBox from "./searchBox";
import { toast } from "react-toastify";

class Movie extends Component {
  state = {
    movies: [],
    pageSize: 4,
    currentPage: 1,
    genres: [],
    currentGenre: 0,
    sortColumn: { column: "title", orderBy: "asc" },
    searchQuery: "",
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleDelete = async (movieId) => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter((m) => m._id !== movieId);

    this.setState({ movies });

    try {
      await deleteMovie(movieId);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted.");

      this.setState({ movies: originalMovies });
    }
  };

  handleLiked = (id) => {
    this.setState(
      this.state.movies.map((m) => {
        if (m._id === id) m.liked = !m.liked;

        return m;
      })
    );
  };

  handlePage = (page) => {
    this.setState({ currentPage: page });
  };

  handleGenre = (id) => {
    this.setState({ currentGenre: id, currentPage: 1, searchQuery: "" });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      currentGenre,
      sortColumn,
      searchQuery,
    } = this.state;

    let filtered = allMovies;

    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
      );
    else if (currentGenre !== 0)
      filtered = allMovies.filter((m) => m.genre._id === currentGenre);

    const sorted = _.orderBy(
      filtered,
      [sortColumn.column],
      [sortColumn.orderBy]
    );

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentGenre: 0, currentPage: 1 });
  };

  render() {
    const {
      pageSize,
      currentPage,
      genres,
      currentGenre,
      sortColumn,
      searchQuery,
    } = this.state;

    const { totalCount, data: movies } = this.getPagedData();

    // if (totalCount <= 0) return <h1>There are no movies in database</h1>;

    const { user } = this.props;

    return (
      <React.Fragment>
        <div className="container">
          <div className="row justify-content-center align-items-center g-2">
            <div className="col-3">
              <ul className="list-group">
                <li
                  onClick={() => this.handleGenre(0)}
                  className={
                    currentGenre === 0
                      ? "list-group-item active"
                      : "list-group-item"
                  }
                >
                  All Genres
                </li>
                {genres.map((genre) => (
                  <li
                    onClick={() => this.handleGenre(genre._id)}
                    key={genre._id}
                    className={
                      currentGenre === genre._id
                        ? "list-group-item active"
                        : "list-group-item"
                    }
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-9">
              {!user && (
                <Link to={"/movies/new"} className="btn btn-primary mt-5 mb-3">
                  Add Movie
                </Link>
              )}

              <h3 className="mb-4">Showing {totalCount} movies in database</h3>

              <SearchBox value={searchQuery} onChange={this.handleSearch} />

              <MoviesTable
                movies={movies}
                sortColumn={sortColumn}
                onLiked={this.handleLiked}
                onDelete={this.handleDelete}
                onSort={this.handleSort}
              />

              <Pagination
                itemsCount={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.handlePage}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Movie;
