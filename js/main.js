const apiToken =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNzY3ZDlhNzRhNDQ1ODRjOTRkMGIzNTIwOGEzNDliZSIsIm5iZiI6MTQ5MDgyODMyMS4wNDMsInN1YiI6IjU4ZGMzYzFkOTI1MTQxMjcxMzAwNDdjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.4JfQoJhTibU0gvUHLAZFfyK2MKSPvKxAgUfgDUNX4HA";
const apiKey = "f767d9a74a44584c94d0b35208a349be";

const requestOptions = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${apiToken}`,
  },
};

fetch("https://api.themoviedb.org/3/authentication", requestOptions)
  .then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  })
  .catch((err) => console.error(err));

const pageBackdropUrl = "https://image.tmdb.org/t/p/w500";
const pagePosterUrl = "https://image.tmdb.org/t/p/w300";
const posterUrl = "https://image.tmdb.org/t/p/w100";
const stillUrl = "https://image.tmdb.org/t/p/w200";

const doSearch = () => {
  const query = document.querySelector('input[name="search"]').value;
  if (query.length > 2) {
    localStorage.setItem("searchQuery", query);
    window.location.href = "results.html";
  }
};
