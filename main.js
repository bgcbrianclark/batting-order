const newPlayerForm = document.querySelector("#addNewPlayer");
const playerList = document.querySelector("#playerList ol");
const clearListBtn = document.querySelector("#clearList");
const advanceBtn = document.querySelector("#advanceList");
const toggleFormBtn = document.querySelector("#formToggle");

const ls = window.localStorage;

let players;
let round = 0;
let deck;

if (ls.getItem("players")) {
  players = JSON.parse(ls.getItem("players"));
  deck = 1;
} else {
  players = [];
}

class Player {
  constructor(name, number) {
    this.name = name;
    this.number = number;
  }
}

function updateLocalStorage(data) {
  ls.setItem("players", data);
}

function newPlayer(name, number) {
  const newPlayer = new Player(name, number);
  players.push(newPlayer);
  newPlayerForm.reset();
  updateLocalStorage(JSON.stringify(players));
  updatePlayerList();
  focusForm();
}

function generatePlayerHtml(player, index) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const strong = document.createElement("strong");
  const textNode = document.createTextNode(" - ");

  li.classList.add("player");
  if (index == round) {
    li.classList.add("active");
  } else if (index == deck) {
    li.classList.add("on-deck");
  }

  strong.innerText = player.number;
  span.innerText = player.name;
  li.appendChild(span);
  li.appendChild(textNode);
  li.appendChild(strong);

  return li;
}

function updatePlayerList() {
  if (players.length) {
    playerList.innerHTML = "";
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      playerList.appendChild(generatePlayerHtml(player, i));
    }
  } else {
    playerList.innerHTML = "No players found.";
  }
}

function clearList() {
  players = [];
  ls.clear();
  updatePlayerList();
}

function advancePosition() {
  round++;
  deck++;
  const positions = document.querySelectorAll(".player");

  positions.forEach((player) => {
    player.classList.remove("active");
  });

  if (positions[round]) {
    positions[round].classList.add("active");
  } else {
    round = 0;
  }
  if (positions[deck]) {
    positions[deck].classList.add("on-deck");
  } else {
    deck = 0;
  }
  updatePlayerList();
}

function focusForm() {
  document.querySelector("#nameInput").focus();
}

newPlayerForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.querySelector("#nameInput").value;
  const number = document.querySelector("#numberInput").value;

  if (name && number) {
    newPlayer(name, number);
  } else {
    alert("Fill out the name and number of the new player.");
  }
});

clearListBtn.addEventListener("click", clearList);

advanceBtn.addEventListener("click", function () {
  advancePosition();
});

toggleFormBtn.addEventListener("click", function () {
  toggleFormBtn.classList.toggle("active");
  newPlayerForm.classList.toggle("active");

  if (toggleFormBtn.classList.contains("active")) {
    focusForm();
  }
});

updatePlayerList();
