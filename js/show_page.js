const showBody = document.getElementById("select-seasons");
const showHeader = document.getElementById("show-header");
const epList = document.getElementById("ep-list");
const showFrame = document.getElementById("show-frame");

let showSeasonsList = [];
let showSeason = [];
let showBackdrop;

const showId = window.URLSearchParams
  ? new URLSearchParams(window.location.search).get("id")
  : (window.location.href = "./404.html");

fetch(
  `https://api.themoviedb.org/3/tv/${showId}?language=en-US`,
  requestOptions,
)
  .then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  })
  .then((res) => {
    populateShowPage(res);
  })
  .catch((err) => {
    console.error(err);
    window.location.href = "./404.html";
  });

const populateShowPage = (data) => {
  showSeasonsList = data.seasons;
  showBackdrop = data.backdrop_path;

  const headContent = `
      <div class="page-container">
          <div class="show-header flex">
              <img src="${pageBackdropUrl}${showBackdrop}" alt="show poster">
              <h1 class="show-title">${data.name}</h1>
              <h3 class="show-tagline">${data.tagline}</h3>
          </div>
          <div class="show-body">
              <p>${data.overview}</p>
          </div>
      </div>
      `;

  showHeader.innerHTML = headContent;

  populateShowSeasons(showSeasonsList);
};

const populateShowSeasons = (seasons) => {
  const seasonsContent = seasons
    .map((season) => {
      if (season.season_number != 0) {
        return `<option value="${season.season_number}">${season.name}</option>`;
      }
    })
    .join("");

  showBody.innerHTML = seasonsContent;

  populateShowEpisodes(1);
};

const populateShowEpisodes = (season) => {
  fetch(
    `https://api.themoviedb.org/3/tv/${showId}/season/${season}?language=en-US`,
    requestOptions,
  )
    .then((res) => {
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return res.json();
    })
    .then((res) => {
      const epContent = res.episodes
        .map((episode) => {
          return `
                <li class="ep-card">
                    <a class="flex" onclick="makeFrame('7xstream', ${season}, ${episode.episode_number})">
                        <img src="${stillUrl}${episode.still_path}" alt="still path">
                        <div class="ep-info flex">
                          <h3>${episode.name}</h3>
                          <p>${episode.overview}</p>
                        </div>
                    </a>
                </li>`;
        })
        .join("");

      epList.innerHTML = epContent;
    })
    .catch((err) => console.error(err));
};

const makeFrame = (service = "7xstream", season = 1, episode = 1) => {
  console.log(service, season, episode);
  const frameContent = `        
      <button onclick="makeFrame('7xstream', ${season}, ${episode})">7xstream</button>
      <button onclick="makeFrame('vidup', ${season}, ${episode})">vidup</button>
      <iframe
          src="${getEmbedUrl(service, season, episode)}"
          frameborder="0"
          width="100%"
          allowfullscreen
      ></iframe>`;

  showFrame.innerHTML = frameContent;
};

const getEmbedUrl = (service, season, episode) => {
  console.log(service, season, episode);
  if (service === "7xstream")
    return `https://embed.7xstream.tv/embed/tv/${showId}/${season}/${episode}`;
  if (service === "vidup")
    return `https://vidup.to/tv/${showId}/${season}/${episode}`;
};
