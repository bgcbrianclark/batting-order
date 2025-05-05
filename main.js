const newPlayerForm = document.querySelector("#addNewPlayer");
const playerList = document.querySelector("#playerList");
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
}

function updatePlayerList() {
  if (players.length) {
    playerList.innerHTML = "";
    for (let i = 0; i < players.length; i++) {
      const player = players[i];

      const div = document.createElement("div");
      div.classList.add("player");
      if (i == round) {
        div.classList.add("active");
      } else if (i == deck) {
        div.classList.add("on-deck");
      }

      const label = document.createElement("label");
      const name = document.createElement("span");
      name.innerText = player.name;
      const number = document.createElement("strong");
      number.innerText = player.number;
      const input = document.createElement("input");
      const spaceNode = document.createTextNode(" ");
      const dashNode = document.createTextNode(" - ");
      input.type = "checkbox";
      label.appendChild(input);
      label.appendChild(spaceNode);
      label.appendChild(name);
      label.appendChild(dashNode);
      label.appendChild(number);

      div.appendChild(label);
      playerList.appendChild(div);
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
});

updatePlayerList();
