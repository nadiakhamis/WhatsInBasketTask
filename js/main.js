const resoursePopup = document.querySelector(".resoursePopup");
const helpPopup = document.querySelector(".helpPopup");
const resourseBtn = document.querySelector(".resourseBtn");
const helpBtn = document.querySelector(".helpBtn");
const reloadBtn = document.querySelector(".reloadBtn");
const closeBtn = document.querySelectorAll(".closeBtn");
const questions = document.querySelectorAll(".question");
const options = document.querySelectorAll(".option");
let currAns = null;
let isCorrect = false;
let timeoutId;
var pageWidth, pageHeight;
const correctAudio = document.querySelector("#correctAudio");
const inCorrectAudio = document.querySelector("#InCorrectAudio");
var pageElement = document.querySelector(".myPage");

var basePage = {
  width: 1280,
  height: 960,
  scale: 0,
  scaleX: 0,
  scaleY: 0,
};
window.addEventListener("load", function () {
  getPageSize();
  scalePages(pageElement, pageWidth, pageHeight);
});

window.addEventListener("resize", function () {
  let timeoutId;
  clearTimeout(timeoutId);
  timeoutId = setTimeout(function () {
    getPageSize();
    scalePages(pageElement, pageWidth, pageHeight);
  }, 150);
});

function getPageSize() {
  pageHeight = document.querySelector("#container").clientHeight;
  pageWidth = document.querySelector("#container").clientWidth;
}

function scalePages(pageElement, maxWidth, maxHeight) {
  var scaleX = 1,
    scaleY = 1;
  scaleX = maxWidth / basePage.width;
  scaleY = maxHeight / basePage.height;
  basePage.scaleX = scaleX;
  basePage.scaleY = scaleY;
  basePage.scale = scaleX > scaleY ? scaleY : scaleX;
  var newLeftPos = Math.abs(
    Math.floor((basePage.width * basePage.scale - maxWidth) / 2)
  );
  var newTopPos = 0;
  let transform = "-webkit-transform:scale(" + basePage.scale +");left:" + newLeftPos +"px;top:" + newTopPos + "px;";
  pageElement.setAttribute("style",transform);
}

resourseBtn.addEventListener("click", function () {
  resoursePopup.classList.add("show");
});

helpBtn.addEventListener("click", function () {
  helpPopup.classList.add("show");
});

closeBtn.forEach(function (currentValue) {
  currentValue.addEventListener("click", function () {
    helpPopup.classList.remove("show");
    resoursePopup.classList.remove("show");
  });
});

questions.forEach(function (currentQuestion) {
  currentQuestion.addEventListener("click", function () {
    questions.forEach(function (currentValue) {
      currentValue.classList.remove("selected");
    });
    currentQuestion.classList.add("selected");
    currAns = currentQuestion.innerHTML;
    let dataAns = currentQuestion.getAttribute("data-answer");
    if (dataAns == "correct") {
      isCorrect = true;
    } else {
      isCorrect = false;
    }
  });
});

options.forEach(function (currentOption) {
  currentOption.addEventListener("click", function () {
    if (currAns == null || currentOption.classList.contains("done")) {
      return;
    }
    if (isCorrect) {
      let currSelectedQues = document.querySelector(".question.selected");
      currentOption.innerHTML = currAns + "&nbsp;" + "<img src='assets/images/tikMark-small.png'/>";
      correctAudio.play();

      currentOption.classList.add("done");
      currSelectedQues.classList.add("hidden");
      currSelectedQues.classList.remove("selected");
      currAns = null;
      isCorrect = false;
    } else {
      currentOption.innerHTML = currAns + "&nbsp;" + "<img class='animate' src='assets/images/crossMark-small.png'/>";
      inCorrectAudio.play();

      setTimeout(function () {
        currentOption.innerHTML = "&nbsp;";
      }, 1100);
    }
  });
});

reloadBtn.addEventListener("click", function () {
  options.forEach(function (ele) {
    ele.innerHTML = "&nbsp;";
    ele.classList.remove("done");
  });
  questions.forEach(function (ele) {
    ele.classList.remove("hidden");
  });
});

function viewAll() {
  let count = 0;
  questions.forEach((item, index, array) => {
    let dataAns = item.getAttribute("data-answer");
    if (dataAns == "correct") {
      const markImg = document.createElement("img");
      markImg.id = index;
      markImg.src = "./assets/images/tikMark-small.png";

      let isSelectedOption = false;
      options.forEach(function (currentOptions) {
        if (item.innerHTML == currentOptions.textContent) {
          isSelectedOption = true;
          return;
        }
      });
      if (!isSelectedOption) {
        if (isEmptyOrSpaces(options[count].textContent)) {
          options[count].classList.add("done");
          options[count].textContent = item.innerHTML;
          options[count].append(markImg);
          count++;
        } else {
          count++;
          options[count].classList.add("done");
          options[count].textContent = item.innerHTML;
          options[count].append(markImg);
        }
      }
    }
  });
  questions.forEach(function (ele) {
    let dataAns = ele.getAttribute("data-answer");
    if (dataAns == "correct") {
      ele.classList.add("hidden");
    }
  });

  correctAudio.play();
  const optionContainers = document.querySelectorAll(".optionContainer");
  optionContainers.forEach((optionContainer) => {
    optionContainer.removeEventListener("click", function () {});
  });
}

function isEmptyOrSpaces(str) {
  return str === null || str.trim() === "";
}
