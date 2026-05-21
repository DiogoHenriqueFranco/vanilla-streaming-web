const watchHeader = document.getElementById("watch-header");
const watchBody = document.getElementById("watch-body");

let watchFrame = "";

let showSeasonsList = [];
let currentSeason = 1;

const type = window.URLSearchParams
  ? new URLSearchParams(window.location.search).get("type")
  : (window.location.href = "./404.html");
const id = window.URLSearchParams
  ? new URLSearchParams(window.location.search).get("id")
  : (window.location.href = "./404.html");

fetch(
  `https://api.themoviedb.org/3/${type}/${id}?language=en-US`,
  requestOptions,
)
  .then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  })
  .then((res) => {
    populateWatchPage(res);
  })
  .catch((err) => {
    console.error(err);
    window.location.href = "./404.html";
  });

const populateWatchPage = (data) => {
  showSeasonsList = data.seasons ? data.seasons : [];
  const headContent = `
    <div class="page-container">
      <div class="watch-backdrop" style="background-image: url('${pageBackdropUrl}${data.backdrop_path}')"></div>
      <div class="watch-head flex">
        <img class="watch-poster" src="${pagePosterUrl}${data.poster_path}" alt="${data.name || data.title}">
        <div class="watch-headline">
            <h1 class="watch-title">${data.title || data.name}</h1>
            <h3 class="watch-tagline">${data.tagline}</h3>
        </div>
        <button onclick="makeFrame('vidup')">Watch now</button>
      </div>
    </div>
    `;

  const bodyContent = `
    <div class="overview flex">
      <h2>Synopsis</h2>
      <p>${data.overview}</p>
    </div>
    <section id="watch-frame" class="frame-section"></section> 
    `;

  watchHeader.innerHTML = headContent;
  watchBody.innerHTML = bodyContent;
};

const makeFrame = async (service = "vidup", season = 1, episode = 1) => {
  let frameContent;
  watchFrame = document.getElementById("watch-frame");
  watchFrame.classList.add("open");

  if (type === "tv") {
    const epListHTML = await populateShowEpisodes(service, currentSeason);

    const frameContent = `
    <div class="frame-content">
      <button onclick="makeFrame('vidup', '${currentSeason}', '${episode}')">vidup</button>
      <button onclick="makeFrame('7xstream', '${currentSeason}', '${episode}')">7xstream</button>
      <div class="flex">
        <div class="ep-list">
          <select name="select-seasons" id="select-seasons" onchange="onSeasonChange('${service}', this.value)">
            ${populateShowSeasons(showSeasonsList, currentSeason)}
          </select>
          <ul class="flex">${epListHTML}</ul>
        </div>
        <iframe
            class="frame"
            src="${getEmbedUrl(service, season, episode)}"
            frameborder="0"
            allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
        ></iframe>
      </div>
    </div>`;

    watchFrame.innerHTML = frameContent;

    requestAnimationFrame(syncEpListHeight);
    window.addEventListener("resize", syncEpListHeight);
  } else {
    watchFrame.innerHTML = `        
    <button onclick="makeFrame('vidup')">vidup</button>
    <button onclick="makeFrame('7xstream')">7xstream</button>      
    <iframe
        class="frame"
        src="${getEmbedUrl(service)}"
        frameborder="0"
        allowfullscreen
        allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
    ></iframe>`;
  }
};

const onSeasonChange = async (service, season = 1) => {
  currentSeason = season;
  const epListHTML = await populateShowEpisodes(service, season);
  document.querySelector(".ep-list ul").innerHTML = epListHTML;
  syncEpListHeight();
};

const syncEpListHeight = () => {
  const wrapper = watchFrame.querySelector("iframe.frame");
  const epList = watchFrame.querySelector(".ep-list");
  if (wrapper && epList) {
    epList.style.height = wrapper.getBoundingClientRect().height + "px";
  }
};

const getEmbedUrl = (service, season = null, episode = null) => {
  if (season && episode) {
    if (service === "7xstream")
      return `https://embed.7xstream.tv/embed/${type}/${id}/${season}/${episode}`;
    if (service === "vidup")
      return `https://vidup.to/${type}/${id}/${season}/${episode}`;
  } else {
    if (service === "7xstream")
      return `https://embed.7xstream.tv/embed/${type}/${id}`;
    if (service === "vidup") return `https://vidup.to/${type}/${id}`;
  }
};

const populateShowSeasons = (seasons, activeSeason) => {
  return seasons
    .filter((season) => season.season_number != 0)
    .map(
      (season) =>
        `<option value="${season.season_number}" ${season.season_number == activeSeason ? "selected" : ""}>${season.name}</option>`,
    )
    .join("");
};

const populateShowEpisodes = async (service, season) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/${type}/${id}/season/${season}?language=en-US`,
    requestOptions,
  );
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();

  return data.episodes
    .map(
      (episode) => `
      <li class="ep-card">
        <a class="flex" onclick="makeFrame('${service}', ${season}, ${episode.episode_number})">
          <img class="ep-image" src="${stillUrl}${episode.still_path}" alt="still path">
          <div class="ep-info">
            <div class="ep-numbers flex">
              <p>S${season}</p>
              <p>E${episode.episode_number}</p>
            </div>
            <h3>${episode.name}</h3>
          </div>
        </a>
      </li>
    `,
    )
    .join("");
};
