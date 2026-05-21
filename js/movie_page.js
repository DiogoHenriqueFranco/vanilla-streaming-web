const movieHeader = document.getElementById("movie-header");
const movieFrame = document.getElementById("movie-frame");

const movieId = window.URLSearchParams
  ? new URLSearchParams(window.location.search).get("id")
  : (window.location.href = "./404.html");

console.log(movieId);

fetch(
  `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
  requestOptions,
)
  .then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  })
  .then((res) => {
    populateMoviePage(res);
  })
  .catch((err) => {
    console.error(err);
    window.location.href = "./404.html";
  });

const populateMoviePage = (data) => {
  const headContent = `
    <div class="page-container">
        <div class="movie-header flex">
            <img src="${pagePosterUrl}${data.poster_path}" alt="movie poster">
            <h1 class="movie-title">${data.title}</h1>
            <h3 class="movie-tagline">${data.tagline}</h3>
        </div>
        <div class="movie-body">
            <p>${data.overview}</p>
        </div>
    </div>
    `;

  movieHeader.innerHTML = headContent;

  //makeFrame();
};

const makeFrame = (service = "vidup") => {
  const frameContent = `        
    <button onclick="makeFrame('vidup')">vidup</button>
    <button onclick="makeFrame('7xstream')">7xstream</button>
    <iframe
        src="${getEmbedUrl(service)}"
        frameborder="0"
        width="100%"
        height="100%"
         allowfullscreen
    ></iframe>`;

  movieFrame.innerHTML = frameContent;
};

const getEmbedUrl = (service) => {
  if (service === "7xstream")
    return `https://embed.7xstream.tv/embed/movie/${movieId}`;
  if (service === "vidup") return `https://vidup.to/movie/${movieId}`;
};
