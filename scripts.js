const API_BASE_URL = "https://api.lyrics.ovh/v1";
const API_SUGGESTION_URL = "https://api.lyrics.ovh/suggest/";

const createCard = (item) => {
  return `<div class="card" id=${item.id}>
    <div><b>${item.artist.name}</b> - <span>${item.title}</span></div>
    <button class="show-button button" onclick="" type="button">
      Show Lyrics
    </button>
  </div>`;
};

const getValueById = (id) => document.getElementById(id).value;

const onSearchButtonClick = () => {
  const searchInputValue = getValueById("search-input");
  if (searchInputValue) {
    fetch(API_SUGGESTION_URL + "/" + searchInputValue)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        document.getElementById("list-items").innerHTML = null;
        data.data.forEach((item) => {
          document.getElementById("list-items").innerHTML +=
            "<li>" + createCard(item) + "</li>";
        });
      });
  }
};
