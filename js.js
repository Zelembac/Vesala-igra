document.getElementById("getWord").addEventListener("click", function () {
  let data = {};
  reset();
  let lettersBtn = document.getElementsByClassName("btn");

  for (let i = 0; i < lettersBtn.length; i++) {
    console.log(lettersBtn[i].classList);
    lettersBtn[i].classList.remove("staringState");
  }
  document.getElementById("hint").classList.remove("staringState");
  document.getElementById("guess").classList.remove("staringState");

  fetch("words.json")
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      console.log(response);
      data = response;
      write(response);
      //   data.forEach((element) => {
      //     lenght++;
      //   });

      //   let random = Math.floor(Math.random() * lenght);
      //   console.log(random);
    });
});
function reset() {
  document.getElementById("hangman").innerHTML = `<img src="img/0.png">`;
  let lettersBtn = document.getElementsByClassName("btn");
  for (let i = 0; i < lettersBtn.length; i++) {
    lettersBtn[i].classList.remove("activeBtn");
    lettersBtn[i].classList.remove("unactiveBtn");
    lettersBtn[i].classList.add("staringState");
  }
  document.getElementById("word").innerHTML = "";
  document.getElementById("hint").classList.add("staringState");
  document.getElementById("guess").classList.add("staringState");
  brS = 0;
  brW = 0;
  brH = 0;
  document.getElementById("hintWord").textContent = "";
}
let brW = 0;
let brH = 0;
let wordArray = [];
let brS = 0;
function write(data) {
  let lenght = 0;
  data.forEach((element) => {
    lenght++;
  });
  let html = "";

  let random = Math.floor(Math.random() * lenght);
  console.log(random);
  data.forEach((element) => {
    if (random == element.id) {
      wordArray = element.word.split("");
      hint(element);

      for (let i = 0; i < element.word.length; i++) {
        html += `<input type="text" id="letter-${i}" name="letter-${i}" maxlength="1" disabled="disabled" class="wordInput">`;
      }
    }
  });
  document.getElementById("word").innerHTML = html;
}

function hint(data) {
  document.getElementById("hint").addEventListener("click", function () {
    document.getElementById("hintWord").textContent = data.hint;
    brH = 2;
    console.log(brH + "sadasdasasd");
    draw(brH);
    document.getElementById("hint").classList.add("staringState");
  });
}

let lettersBtnValue = "";
let lettersBtn = document.querySelectorAll(".btn");
for (let i = 0; i < lettersBtn.length; i++) {
  lettersBtn[i].addEventListener("click", function () {
    let br = 0;

    lettersBtnValue = lettersBtn[i].textContent;
    console.log(lettersBtnValue);
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

  brS = unactive.length + brH;
  draw(brS);

  console.log(brS);

  if (brS >= 6) {
    setTimeout(function () {
      alert("izgubio si");
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
  console.log(brT);
  if (brT == wordArray.length) {
    setTimeout(function () {
      alert("Pobeda");
      reset();
    }, 100);
  }
}
function protection() {
  let activeB = document.getElementsByClassName("activeBtn").length;

  let unactiveB = document.getElementsByClassName("unactiveBtn").length;
  console.log("ub" + unactiveB + "ab" + activeB);
  if (activeB > 0 || unactiveB > 0) {
    document.getElementById("guess").classList.add("staringState");
  }
}

document.getElementById("guess").addEventListener("click", function () {
  let value = document.getElementById("wholeWord").value;
  let valueArray = value.toUpperCase().split("");
  for (let i = 0; i < valueArray.length; i++) {
    console.log("vA" + valueArray[i] + "wA" + wordArray[i]);
    if (valueArray[i] == wordArray[i]) {
      console.log("vA" + valueArray[i] + "wA" + wordArray[i]);
      brW++;
    }
  }
  if (brW == wordArray.length) {
    setTimeout(function () {
      alert("Pobeda");
      reset();
    }, 100);
  } else if (value != "") {
    setTimeout(function () {
      alert("izgubio si");
      reset();
    }, 100);
  }
});
