const query = localStorage.getItem("searchQuery");

const resultsBox = document.getElementById("results-box");

fetch(
  `https://api.themoviedb.org/3/search/multi?query=${query}&language=en-US`,
  requestOptions,
)
  .then((res) => res.json())
  .then((res) => displayResults(res.results.filter((result) => result.media_type !== "person")))
  .catch((err) => console.error(err));

const displayResults = (results) => {
    console.log(results)
    const cards = results.map((result) => {
        return new Promise((resolve) => {
            resolve(`
        <div class="card" onclick="">
          <img src="${pagePosterUrl}${result.poster_path}" alt="show poster" class="flex">
          <h3 class="flex">${result.name || result.title}</h3>
        </div>
      `);
        })
    })
    Promise.all(cards).then((card) => {
        resultsBox.innerHTML = card.join("");
    })
};