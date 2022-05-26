document.getElementById("getWord").addEventListener("click", function () {
  let data = {};
  let lettersBtn = document.getElementsByClassName("btn");
  //   console.log(lettersBtn);
  for (let i = 0; i < lettersBtn.length; i++) {
    lettersBtn[i].classList.remove("activeBtn");
    lettersBtn[i].classList.remove("unactiveBtn");
  }

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
let wordArray = [];
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
      for (let i = 0; i < element.word.length; i++) {
        html += `<input type="text" id="letter-${i}" name="letter-${i}" maxlength="1" disabled="disabled" class="wordInput">`;
      }
    }
  });
  document.getElementById("word").innerHTML = html;
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
  });
}
