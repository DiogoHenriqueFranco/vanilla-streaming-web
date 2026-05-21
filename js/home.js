const genreBox = document.getElementById("genre-box");
const movieBox = document.getElementById("movie-box");
const showBox = document.getElementById("show-box");

fetch(
  "https://api.themoviedb.org/3/genre/movie/list?language=en",
  requestOptions,
)
  .then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  })
  .then((res) => {
    populateGenreCards(res);
  })
  .catch((err) => console.error(err));

let genresList = [];

const populateGenreCards = (data) => {
  for (i = 0; i < data.genres.length; i++) {
    genresList.push(data.genres[i].name);
  }

  const boxContent = genresList
    .map((genre) => {
      return `
      <div class="card-container flex">
        <h2 class="genre-name">${genre}</h2>
      </div>
    `;
    })
    .join("");

  //genreBox.innerHTML = boxContent;
};

fetch(
  "https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=1&sort_by=popularity.desc",
  requestOptions,
)
  .then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  })
  .then((res) => {
    populateDiscoverMovies(res);
  })
  .catch((err) => console.error(err));

let movieList = [];

const populateDiscoverMovies = (data) => {
  let movieRes = data.results;
  let moviePage = data.page;
  let movieLastPage = data.total_pages;

  for (i = 0; i < movieRes.length; i++) {
    const movie = {
      id: movieRes[i].id,
      title: movieRes[i].title,
      backdrop: movieRes[i].backdrop_path,
      poster: movieRes[i].poster_path,
    };
    movieList.push(movie);
  }

  const boxContent = movieList
    .map((movie) => {
      return `
      <div class="card">
        <a href="./watch.html?type=movie&id=${movie.id}">
          <img src="${pagePosterUrl}${movie.poster}" alt="show poster" class="flex">
          <h3 class="movie-title flex">${movie.title}</h3>
        </a>
      </div>
      `;
    })
    .join("");

  movieBox.innerHTML += boxContent;
};

const setMovieId = (id) => {
  localStorage.setItem("movieId", id);
};

fetch(
  "https://api.themoviedb.org/3/discover/tv?include_adult=true&include_null_first_air_dates=false&language=en-US&page=1&sort_by=popularity.desc",
  requestOptions,
)
  .then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  })
  .then((res) => {
    populateDiscoverShows(res);
  })
  .catch((err) => console.error(err));

let showList = [];

const populateDiscoverShows = (data) => {
  const showRes = data.results;
  const showPage = data.page;
  const showLastPage = data.total_pages;

  for (i = 0; i < showRes.length; i++) {
    const show = {
      id: showRes[i].id,
      title: showRes[i].name,
      backdrop: showRes[i].backdrop_path,
      poster: showRes[i].poster_path,
    };
    showList.push(show);
  }

  const boxContent = showList
    .map((show) => {
      return `
      <div class="card">
        <a href="./watch.html?type=tv&id=${show.id}">
          <img src="${pagePosterUrl}${show.poster}" alt="show poster" class="flex">
          <h3 class="flex">${show.title}</h3>
        </a>
      </div>
      `;
    })
    .join("");

  showBox.innerHTML += boxContent;
};

const setShowId = (id) => {
  localStorage.setItem("showId", id);
};
