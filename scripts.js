const API_BASE_URL =
  "https://private-anon-5e7186017e-lyricsovh.apiary-proxy.com/v1/";
const API_SUGGESTION_URL = "https://api.lyrics.ovh/suggest/";

const getElByID = (id) => document.getElementById(id);
const getValueById = (id) => getElByID(id).value;

let activeLineID = "";

const createCard = (item) => {
  return `<li id='line_${item.id}'>
            <div class="card" id=${item.id}>
              <div>
                <b>${item.artist.name}</b> - 
                <span>${item.title}</span>
              </div>
              <button id='show_btn_${item.id}' class="show-button button" onclick="handleAccordian('${item.id}', '${item.artist.name}', '${item.title}')" type="button">
                Show Lyrics
              </button>
              <button id='hide_btn_${item.id}' class="show-button button d-none" onclick="hideLyrics('${item.id}')" type="button">
              Hide Lyrics
            </button>
            </div>
            <div class='panel' id='panel_${item.id}' /> 
          </li>`;
};

const hideLyrics = (lineID) => {
  const showButton = getElByID(`show_btn_${lineID}`);
  const hideButton = getElByID(`hide_btn_${lineID}`);
  const panelItem = getElByID(`panel_${lineID}`);

  showButton && showButton.classList.remove("d-none");
  hideButton && hideButton.classList.add("d-none");
  if (panelItem) {
    panelItem.style.display = "none";
    panelItem.innerHTML = "";
  }
};

const onSearchButtonClick = () => {
  const searchInputValue = getValueById("search-input");
  if (searchInputValue) {
    fetch(API_SUGGESTION_URL + "/" + searchInputValue)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        getElByID("list-items").innerHTML = null;
        data.data.forEach((item) => {
          getElByID("list-items").innerHTML += createCard(item);
        });
      });
  }
};

const getLyrics = (lineID, artistName, trackName) =>
  new Promise((resolve, reject) => {
    fetch(API_BASE_URL + "/" + artistName + "/" + trackName)
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      })
      .catch((e) => {
        console.log({ e });
        reject(e);
      });
  });

const handleAccordian = async (lineID, artistName, trackName) => {
  const songLyrics = await getLyrics(lineID, artistName, trackName);
  const lineItem = getElByID(lineID);
  const panelItem = getElByID(`panel_${lineID}`);
  const currentActiveAccordian = getElByID("panel_" + activeLineID);
  const showButton = getElByID(`show_btn_${lineID}`);
  const hideButton = getElByID(`hide_btn_${lineID}`);

  hideButton.classList.remove("d-none");
  showButton.classList.add("d-none");

  if (currentActiveAccordian) {
    currentActiveAccordian.style.display = "none";
    currentActiveAccordian.innerHTML = "";
  }

  if (activeLineID) {
    hideLyrics(activeLineID);
  }

  if (songLyrics.lyrics) {
    panelItem.style.display = "block";
    panelItem.innerHTML = songLyrics.lyrics;
  } else {
    panelItem.style.display = "block";
    panelItem.innerHTML = "No Lyrics Available";
  }
  activeLineID = `${lineID}`;
};
