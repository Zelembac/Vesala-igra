let LSArray = [];
let poinstBr = 0;
let playerName = "";
let brW = 0;
let brH = 0;
let wordArray = [];
let brS = 0;
let lettersBtnValue = "";
let lettersBtn = document.querySelectorAll(".btn");

let LSO = localStorage.getItem("LSO");
if (LSO != null) {
  LSArray = JSON.parse(LSO);
  window.addEventListener("load", higest());
}
document.getElementById("get-word").addEventListener("click", gameStart);
window.addEventListener("load", nameChange);
document.getElementById("name-change").addEventListener("click", nameChange);
function nameChange() {
  document.getElementById("name-ask").style.display = "flex";
}

document.getElementById("try-again").addEventListener("click", gameStart);

for (let i = 0; i < lettersBtn.length; i++) {
  lettersBtn[i].addEventListener("click", function () {
    let br = 0;

    lettersBtnValue = lettersBtn[i].textContent;
    for (let i = 0; i < wordArray.length; i++) {
      if (wordArray[i] == lettersBtnValue) {
        document.getElementById(`letter-${i}`).value = wordArray[i];
        br++;
      }
    }
    if (br != 0) {
      lettersBtn[i].classList.add("active-btn");
    } else {
      lettersBtn[i].classList.add("unactive-btn");
    }
    provera();
    protection();
  });
}

document.getElementById("guess").addEventListener("click", function () {
  let value = document.getElementById("whole-word").value;
  let valueArray = value.toUpperCase().split("");
  let required = /[A-z]+/;
  if (required.test(value)) {
    for (let i = 0; i < valueArray.length; i++) {
      if (valueArray[i] == wordArray[i]) {
        brW++;
      }
    }
    if (brW == wordArray.length) {
      setTimeout(function () {
        poinsts();
        poinstBr = poinstBr * 1.5;
        won();
        LSOfilling();
        higest();
        reset();
      }, 100);
    } else if (value != "") {
      draw(6);
      setTimeout(function () {
        poinsts();
        lost();
        LSOfilling();
        higest();
        reset();
      }, 100);
    }
  }
});

document.getElementById("chuse").addEventListener("click", function () {
  let value = document.getElementById("input-name").value;
  let required = /[A-z0-9]+/;
  if (required.test(value)) {
    playerName = value;
    document.getElementById("name-ask").style.display = "none";
  }
});

const showChat = document.getElementsByClassName("show-chat");
for (let i = 0; i < showChat.length; i++) {
  showChat[i].addEventListener("click", function () {
    document.getElementById("chat").style.display = "flex";
  });
}
const hideChat = document.getElementsByClassName("hide-chat");
for (let i = 0; i < showChat.length; i++) {
  hideChat[i].addEventListener("click", function () {
    document.getElementById("chat").style.display = "none";
  });
}

window.addEventListener("load", init);

function gameStart() {
  let data = {};
  reset();
  let lettersBtn = document.getElementsByClassName("btn");

  document.getElementById("result").style.display = "none";

  for (let i = 0; i < lettersBtn.length; i++) {
    lettersBtn[i].classList.remove("disabled-state");
  }
  document.getElementById("hint").classList.remove("disabled-state");
  document.getElementById("guess").classList.remove("disabled-state");

  fetch("words.json")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      data = response;
      write(response);
    });
}
function reset() {
  document.getElementById("hangman").innerHTML = `<img src="img/0.png">`;
  let lettersBtn = document.getElementsByClassName("btn");
  for (let i = 0; i < lettersBtn.length; i++) {
    lettersBtn[i].classList.remove("active-btn");
    lettersBtn[i].classList.remove("unactive-btn");
    lettersBtn[i].classList.add("disabled-state");
  }
  document.getElementById("word").innerHTML = "";
  document.getElementById("hint").classList.add("disabled-state");
  document.getElementById("guess").classList.add("disabled-state");
  brS = 0;
  brW = 0;
  brH = 0;

  poinstBr = 0;

  document.getElementById("hint-word").textContent = "";
  document.getElementById("whole-word").value = "";
  document.getElementById("input-name").value = "";

  LSArray = [];
}
function write(data) {
  let lenght = 0;
  data.forEach((element) => {
    lenght++;
  });
  let html = "";

  let random = Math.floor(Math.random() * lenght);
  data.forEach((element) => {
    if (random == element.id) {
      wordArray = element.word.split("");
      hint(element);

      for (let i = 0; i < element.word.length; i++) {
        if (wordArray[i] == " ") {
          html += `<input type="text" id="letter-${i}" name="letter-${i}" maxlength="1" disabled="disabled" class="word-input-space" value=" ">`;
        } else {
          html += `<input type="text" id="letter-${i}" name="letter-${i}" maxlength="1" disabled="disabled" class="word-input">`;
        }
      }
    }
  });
  document.getElementById("word").innerHTML = html;
}
function hint(data) {
  document.getElementById("hint").addEventListener("click", function () {
    document.getElementById("hint-word").textContent = data.hint;
    let unactive = document.getElementsByClassName("unactive-btn");

    brS = unactive.length;
    brH = brS + 2;
    draw(brH);
    document.getElementById("hint").classList.add("disabled-state");
  });
}
function draw(br) {
  document.getElementById("hangman").innerHTML = `<img src="img/${br}.png">`;
}
function provera() {
  let unactive = document.getElementsByClassName("unactive-btn");
  if (brH != 0) {
    brS = unactive.length + 2;
  } else {
    brS = unactive.length;
  }

  draw(brS);

  if (brS >= 6) {
    setTimeout(function () {
      poinsts();
      lost();
      LSOfilling();
      higest();
      reset();
    }, 100);
  }
  let brT = 0;
  for (let i = 0; i < wordArray.length; i++) {
    let active = document.getElementById(`letter-${i}`);
    if (wordArray[i] == active.value) {
      brT++;
    }
  }

  if (brT == wordArray.length) {
    setTimeout(function () {
      poinsts();
      won();
      LSOfilling();
      higest();

      reset();
    }, 100);
  }
}
function protection() {
  let activeB = document.getElementsByClassName("active-btn").length;
  let unactiveB = document.getElementsByClassName("unactive-btn").length;
  if (activeB > 0 || unactiveB > 0) {
    document.getElementById("guess").classList.add("disabled-state");
  }
}
function LSOfilling() {
  let LSO = localStorage.getItem("LSO");
  if (LSO != null) {
    LSArray = JSON.parse(LSO);
  }
  LSArray.push({
    Pname: playerName,
    PPoints: poinstBr,
  });
  localStorage.setItem("LSO", JSON.stringify(LSArray));
}
function higest() {
  document.getElementById("high-score").innerHTML = ``;
  let arrayMax = LSArray;
  console.log(arrayMax);
  for (let i = 0; i < 5; i++) {
    let max = -1;
    let maxN = "";
    let j = 0;
    let maxJ = 0;
    arrayMax.forEach((element) => {
      if (element.PPoints > max) {
        max = element.PPoints;
        maxN = element.Pname;
        maxJ = j;
      }
      j++;
    });
    if (arrayMax.length != 0) {
      arrayMax.splice(maxJ, 1);
      document.getElementById(
        "high-score"
      ).innerHTML += `<h3 id="high-score-elem">${
        i + 1
      }.  ${maxN}  :  ${max}</h3>`;
    }
  }
}
function won() {
  document.getElementById("result").style.display = "flex";
  document.getElementById("end-message").textContent =
    "You won with " + poinstBr + " points";
}

function lost() {
  document.getElementById("result").style.display = "flex";
  document.getElementById("end-message").textContent =
    "You Lost with " + poinstBr + " points";
}
function poinsts() {
  let srcImg = document.querySelector("img").src;
  for (let i = 0; i < 7; i++) {
    if (srcImg.indexOf(`${i}.png`) != -1) {
      poinstBr = 600 - i * 100;
    }
  }
  let activeB = document.getElementsByClassName("active-btn");
  for (let i = 0; i < activeB.length; i++) {
    poinstBr += 10;
  }
}

function init() {
  let socket = io.connect("http://localhost:5000");

  function writeInChat(data) {
    document.getElementById("chat-messages").innerHTML += data;
  }

  document.getElementById("send").addEventListener("click", function () {
    let messageV = document.getElementById("input-message").value;
    if (messageV != "") {
      socket.emit("chat", messageV);
    }
  });
  socket.on("chat-message", (data) => {
    document.getElementById("input-message").value = "";
    document.getElementById("feedback").innerHTML = "";
    writeInChat(
      `<div class="chat-message"><div class="nik">${data.username} :</div>  ${data.message}</div>`
    );
  });

  document.getElementById("chuse").addEventListener("click", function () {
    let nameV = document.getElementById("input-name").value;
    socket.emit("newuser", nameV);
  });
  document
    .getElementById("input-message")
    .addEventListener("keypress", function () {
      socket.emit("typing");
    });
  socket.on("typing", (data) => {
    document.getElementById(
      "feedback"
    ).innerHTML = `<div><i>${data} typing...</i></div>`;
  });
  socket.on("user-connected", (data) => {
    writeInChat(`<div class="message">${data} joined</div>`);
  });
  document.getElementById("name-change").addEventListener("click", function () {
    socket.emit("disconnected");
  });
  socket.on("user-disconnected", (name) => {
    writeInChat(`<div class="message">${name} disconected</div>`);
  });
}
