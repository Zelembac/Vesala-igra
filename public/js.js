let LSArray = [];
let poinstBr = 0;
let playerName = "";
let brW = 0;
let brH = 0;
let wordArray = [];
let brS = 0;

let LSO = localStorage.getItem("LSO");
if (LSO != null) {
  LSArray = JSON.parse(LSO);
  window.addEventListener("load", higest());
}
document.getElementById("getWord").addEventListener("click", gameStart);
window.addEventListener("load", nameChange);
document.getElementById("nameCh").addEventListener("click", nameChange);
function nameChange() {
  document.getElementById("nameAsk").style.display = "flex";
}

function gameStart() {
  let data = {};
  reset();
  let lettersBtn = document.getElementsByClassName("btn");

  document.getElementById("result").style.display = "none";

  for (let i = 0; i < lettersBtn.length; i++) {
    // console.log(lettersBtn[i].classList);
    lettersBtn[i].classList.remove("disabledState");
  }
  document.getElementById("hint").classList.remove("disabledState");
  document.getElementById("guess").classList.remove("disabledState");

  fetch("words.json")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      // console.log(response);
      data = response;
      write(response);
    });
}

document.getElementById("tryAgain").addEventListener("click", gameStart);
function reset() {
  document.getElementById("hangman").innerHTML = `<img src="img/0.png">`;
  let lettersBtn = document.getElementsByClassName("btn");
  for (let i = 0; i < lettersBtn.length; i++) {
    lettersBtn[i].classList.remove("activeBtn");
    lettersBtn[i].classList.remove("unactiveBtn");
    lettersBtn[i].classList.add("disabledState");
  }
  document.getElementById("word").innerHTML = "";
  document.getElementById("hint").classList.add("disabledState");
  document.getElementById("guess").classList.add("disabledState");
  brS = 0;
  brW = 0;
  brH = 0;

  poinstBr = 0;

  document.getElementById("hintWord").textContent = "";
  document.getElementById("wholeWord").value = "";
  document.getElementById("inputName").value = "";

  LSArray = [];
}

function write(data) {
  let lenght = 0;
  data.forEach((element) => {
    lenght++;
  });
  let html = "";

  let random = Math.floor(Math.random() * lenght);
  // console.log(random);
  data.forEach((element) => {
    if (random == element.id) {
      wordArray = element.word.split("");
      hint(element);

      for (let i = 0; i < element.word.length; i++) {
        if (wordArray[i] == " ") {
          html += `<input type="text" id="letter-${i}" name="letter-${i}" maxlength="1" disabled="disabled" class="wordInputSpace" value=" ">`;
        } else {
          html += `<input type="text" id="letter-${i}" name="letter-${i}" maxlength="1" disabled="disabled" class="wordInput">`;
        }
      }
    }
  });
  document.getElementById("word").innerHTML = html;
}

function hint(data) {
  document.getElementById("hint").addEventListener("click", function () {
    document.getElementById("hintWord").textContent = data.hint;
    let unactive = document.getElementsByClassName("unactiveBtn");

    brS = unactive.length;
    brH = brS + 2;
    // console.log(brH + "sadasdasasd");
    draw(brH);
    document.getElementById("hint").classList.add("disabledState");
  });
}

let lettersBtnValue = "";
let lettersBtn = document.querySelectorAll(".btn");
for (let i = 0; i < lettersBtn.length; i++) {
  lettersBtn[i].addEventListener("click", function () {
    let br = 0;

    lettersBtnValue = lettersBtn[i].textContent;
    // console.log(lettersBtnValue);
    for (let i = 0; i < wordArray.length; i++) {
      if (wordArray[i] == lettersBtnValue) {
        document.getElementById(`letter-${i}`).value = wordArray[i];
        br++;
      }
    }
    if (br != 0) {
      lettersBtn[i].classList.add("activeBtn");
    } else {
      lettersBtn[i].classList.add("unactiveBtn");
    }
    provera();
    protection();
  });
}
function draw(br) {
  document.getElementById("hangman").innerHTML = `<img src="img/${br}.png">`;
}

function provera() {
  let unactive = document.getElementsByClassName("unactiveBtn");
  if (brH != 0) {
    brS = unactive.length + 2;
  } else {
    brS = unactive.length;
  }

  draw(brS);

  // console.log(brS);

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
  // console.log(brT);
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
  let activeB = document.getElementsByClassName("activeBtn").length;

  let unactiveB = document.getElementsByClassName("unactiveBtn").length;
  // console.log("ub" + unactiveB + "ab" + activeB);
  if (activeB > 0 || unactiveB > 0) {
    document.getElementById("guess").classList.add("disabledState");
  }
}

document.getElementById("guess").addEventListener("click", function () {
  let value = document.getElementById("wholeWord").value;
  let valueArray = value.toUpperCase().split("");
  // console.log(value);
  let required = /[A-z]+/;
  if (required.test(value)) {
    for (let i = 0; i < valueArray.length; i++) {
      // console.log("vA" + valueArray[i] + "wA" + wordArray[i]);
      if (valueArray[i] == wordArray[i]) {
        // console.log("vA" + valueArray[i] + "wA" + wordArray[i]);
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
  let value = document.getElementById("inputName").value;
  let required = /[A-z0-9]+/;
  if (required.test(value)) {
    playerName = value;
    document.getElementById("nameAsk").style.display = "none";
  }
});
function poinsts() {
  let srcImg = document.querySelector("img").src;
  // console.log(srcImg);
  for (let i = 0; i < 7; i++) {
    // console.log(srcImg.indexOf(i));
    if (srcImg.indexOf(`${i}.png`) != -1) {
      // console.log(i + "iovo");
      poinstBr = 600 - i * 100;
      // console.log(poinstBr + "ovo");
    }
  }
  let activeB = document.getElementsByClassName("activeBtn");
  for (let i = 0; i < activeB.length; i++) {
    poinstBr += 10;
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
  document.getElementById("highScore").innerHTML = ``;

  let arrayMax = LSArray;
  // LSArray.forEach((element) => {
  //   console.log(element);
  //   arrayMax.push(element);
  // });

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
        "highScore"
      ).innerHTML += `<h3 id="highScoreElem">${
        i + 1
      }.  ${maxN}  :  ${max}</h3>`;
    }
  }
}
function won() {
  document.getElementById("result").style.display = "flex";
  document.getElementById("endMessage").textContent =
    "You won with " + poinstBr + " points";
}

function lost() {
  document.getElementById("result").style.display = "flex";
  document.getElementById("endMessage").textContent =
    "You Lost with " + poinstBr + " points";
}

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

function init() {
  let socket = io.connect("http://localhost:5000");

  document.getElementById("send").addEventListener("click", function () {
    socket.emit("chat", {
      message: document.getElementById("input-message").value,
    });
  });
  socket.on("chat-ovo", (data) => {
    console.log(data);
    document.getElementById("input-message").value = "";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById(
      "chat-messages"
    ).innerHTML += `<p class="message"><span class="nik">${data.username}</span>${data.message}</p>`;
  });
  document.getElementById("chuse").addEventListener("click", function () {
    socket.emit("newuser", {
      username: document.getElementById("inputName").value,
    });
  });
  document
    .getElementById("input-message")
    .addEventListener("keypress", function () {
      socket.emit("kuca");
    });
  socket.on("kuca", (data) => {
    document.getElementById(
      "feedback"
    ).innerHTML = `<p><i>${data.username}kuca...</i></p>`;
  });
  socket.on("user-connected", (data) => {
    document.getElementById(
      "chat-messages"
    ).innerHTML += `<p class="message">${data.username} joined</p>`;
  });
  socket.on("user-dissconnected", (data) => {
    document.getElementById(
      "chat-messages"
    ).innerHTML += `<p class="message">${data.username} left</p>`;
  });
}
// `
// <div>
//      <div class="message-name">You</div>
//      <div class="message-text">${message.text}</div>
// </div>
// `
