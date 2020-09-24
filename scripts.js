const API_BASE_URL =
  "https://private-anon-5e7186017e-lyricsovh.apiary-proxy.com/v1/";
const API_SUGGESTION_URL = "https://api.lyrics.ovh/suggest/";

let activeAccordianID = "";

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
            </div>
            <div class='panel' id='panel_${item.id}' /> 
          </li>`;
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
          document.getElementById("list-items").innerHTML += createCard(item);
        });
      });
  }
};

const getLyrics = (lineID, artistName, trackName) =>
  new Promise((resolve, reject) => {
    fetch(API_BASE_URL + "/" + artistName + "/" + trackName)
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        resolve(data);
      })
      .catch((e) => {
        console.log({ e });
        reject(e);
      });
  });

const handleAccordian = async (lineID, artistName, trackName) => {
  const songLyrics = await getLyrics(lineID, artistName, trackName);
  const lineItem = document.getElementById(lineID);
  const panelItem = document.getElementById(`panel_${lineID}`);
  const currentActiveAccordian = document.getElementById(activeAccordianID);
  const showButton = document.getElementById(`show_button_${lineID}`);

  // showButton.innerHTML = "Hide Lyrics";
  // showButton.onclick = function () {
  //   showButton.innerHTML = "Show Lyrics";
  //   // panelItem.style.display = "none";
  //   showButton.onclick = handleAccordian(
  //     `${lineID}`,
  //     `${artist}`,
  //     `${trackName}`
  //   );
  // };

  if (currentActiveAccordian) {
    currentActiveAccordian.style.display = "none";
    currentActiveAccordian.innerHTML = "";
  }

  if (songLyrics.lyrics) {
    panelItem.style.display = "block";
    panelItem.innerHTML = songLyrics.lyrics;
  } else {
    panelItem.style.display = "block";
    panelItem.innerHTML = "No Lyrics Available";
  }
  activeAccordianID = `panel_${lineID}`;
};
