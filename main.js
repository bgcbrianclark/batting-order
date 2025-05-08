const newPlayerForm = document.querySelector("#addNewPlayer");
const editPlayerForm = document.querySelector("#editPlayer");
const playerList = document.querySelector("#playerList ol");
const clearListBtn = document.querySelector("#clearList");
const advanceBtn = document.querySelector("#advanceList");
const toggleFormBtn = document.querySelector("#formToggle");
const closeEditFormBtn = document.querySelector("#closeEdit");

const ls = window.localStorage;

let players;
let playersLi = [];
let round = 0;
let deck;

if (ls.getItem("players")) {
  players = JSON.parse(ls.getItem("players"));
  deck = 1;
} else {
  players = [];
}

class Player {
  constructor(name, number, order, id) {
    this.name = name;
    this.number = number;
    this.order = order;
    this.id = id;
  }
}

function updateLocalStorage(data) {
  ls.setItem("players", data);
}

function newPlayer(name, number, order) {
  const newPlayer = new Player(name, number, order, players.length + 1);
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
  li.setAttribute("data-id", player.id);

  strong.innerText = player.number;
  span.innerText = player.name;
  li.appendChild(span);
  li.appendChild(textNode);
  li.appendChild(strong);

  return li;
}

function compare(a, b) {
  if (a.order < b.order) {
    return -1;
  }
  if (a.order > b.order) {
    return 1;
  }
  return 0;
}

function updatePlayerList() {
  if (players.length) {
    playerList.innerHTML = "";
    const sortedPlayers = players.sort(compare);
    for (let i = 0; i < sortedPlayers.length; i++) {
      const player = sortedPlayers[i];
      const playerNode = generatePlayerHtml(player, i);
      playerList.appendChild(playerNode);
      playersLi.push(playerNode);
    }

    document.querySelector("#orderInput").value = players.length + 1;
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
  const order = document.querySelector("#orderInput").value;

  if (name && number && order) {
    newPlayer(name, number, order);
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

playersLi.forEach((player) => {
  player.addEventListener("click", function (e) {
    editPlayerForm.classList.add("active");

    const id = e.target.getAttribute("data-id");
    const player = players[id - 1];

    document.querySelector("#editNameInput").value = player.name;
    document.querySelector("#editNumberInput").value = player.number;
    document.querySelector("#editOrderInput").value = player.order;
  });
});

closeEditFormBtn.addEventListener("click", function () {
  editPlayerForm.classList.remove("active");
});
