const resoursePopup = document.querySelector(".resoursePopup");
const helpPopup = document.querySelector(".helpPopup");
const resourseBtn = document.querySelector(".resourseBtn");
const helpBtn = document.querySelector(".helpBtn");
const reloadBtn = document.querySelector(".reloadBtn");
const closeBtn = document.querySelectorAll(".closeBtn");
const questions = document.querySelectorAll(".question");
const options = document.querySelectorAll(".option");
const resetAllBtn = $("#resetAll").first();
const viewAllBtn = $("#viewAll").first();
viewAllBtn.on("click", viewAll);
resetAllBtn.on("click", resetAll);
let currAns = null;
let isCorrect = false;
var pageWidth, pageHeight;
const correctAudio = $("<audio id=`correctAudio`>").attr("src", "./assets/audio/correct.mp3").get(0);
const inCorrectAudio = $("<audio>").attr("src", "./assets/audio/incorrect.mp3").get(0);

$(".myContent, .resourseContainer, .helpContainer").css("height",(960 * 74) / 100 + 15 + "px");
$(".backGround").css("height", (960 * 74) / 100 + "px");
$(".header, .footer").css("height", (960 * 13) / 100 + "px");


var basePage = {
  width: 1280,
  height: 960,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
};

const choices = [
  { title: "scissors", isCorrect: false, selected: false },
  { title: "eraser", isCorrect: true, selected: false },
  { title: "ruler", isCorrect: true, selected: true },
  { title: "bag", isCorrect: false, selected: false },
  { title: "pencil pen", isCorrect: false, selected: true },
  { title: "pencil", isCorrect: true, selected: false },
  { title: "book", isCorrect: true, selected: false },
  { title: "pen", isCorrect: true, selected: false },
];


$(function () {
  var $page = $(".myPage");

  getPageSize();
  scalePages($page, pageWidth, pageHeight);
  
  $(window).resize(
    _.debounce(function () {
      getPageSize();
      scalePages($page, pageWidth, pageHeight);
    }, 150)
  );

  function getPageSize() {
    pageHeight = $("#container").height();
    pageWidth = $("#container").width();
  }

  function scalePages(page, maxWidth, maxHeight) {
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
    page.attr(
      "style",
      "-webkit-transform:scale(" +
        basePage.scale +
        ");left:" +
        newLeftPos +
        "px;top:" +
        newTopPos +
        "px;"
    );
  }
});

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
      currentOption.innerHTML =
        currAns + "<img src='assets/images/tikMark-small.png'/>";
      correctAudio.play();

      currentOption.classList.add("done");
      currentOption.classList.add("correctAnsAudio");

      currSelectedQues.classList.add("hidden");
      currSelectedQues.classList.remove("selected");
      currAns = null;
      isCorrect = false;
    } else {
      currentOption.innerHTML =
        currAns +
        "<img class='animate' src='assets/images/crossMark-small.png'/>";
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
  const lineItem = document.querySelectorAll(".optionContainer .option");
  choices.forEach((item, index, array) => {
    if (item.isCorrect) {
      const markImg = document.createElement("img");
      markImg.id = index;
      markImg.src = "./assets/images/tikMark-small.png";

      let isSelectedOption = false;
      lineItem.forEach(function (currentOptions) {
        if (item.title == currentOptions.textContent) {
          isSelectedOption = true;
          return;
        }
      });
      if(!isSelectedOption){
        if(isEmptyOrSpaces(lineItem[count].textContent)){
          lineItem[count].classList.add("done");
          lineItem[count].textContent = item.title;
          lineItem[count].append(markImg);
          count++;
  
        }else{
          count++;  
          lineItem[count].classList.add("done");
          lineItem[count].textContent = item.title;
          lineItem[count].append(markImg);
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
  $(".optionContainer").off("click");
}

function resetAll() {
  const lineItem = $(".optionContainer");
  lineItem.each(function () {
    $(this).removeClass("selected");
    $(this).text("");
  });
  $("#components__container li").removeClass("active");
  renderPage(true);
}

function isEmptyOrSpaces(str){
  return str === null || str.trim() === '';
}
