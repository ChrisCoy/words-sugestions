// import data from "./data.txt"
import data from "../output/model.json"


const model = data;


const input = document.getElementById("input");

const sug1 = document.getElementById("sug1");
const sug2 = document.getElementById("sug2");
const sug3 = document.getElementById("sug3");

const setInputObj = () => {
  let attrVal;
  return {
    set attr(v) {
      attrVal = v;
    },
    get attr() {
      return attrVal;
    }
  };
};

const setOnChange = (elem, callback) => {
  const inputState = setInputObj(elem);
  elem.addEventListener("keyup", (e) => {
    let currVal = e.target.value;
    if (inputState.attr !== currVal) elem.onChange(currVal);
    inputState.attr = currVal;
  })
  elem.onChange = callback;
}

// setOnChange(document.getElementById("input2"), (val) => {
//   console.log("mudou no onchange", val)
//   // changeInput(val)
// });



let element = document.getElementById("dev");
// var input = (function(elem){
// let attrVal;
//  return {
//    set attr(v){
//     attrVal = v;
//    },
//    get attr(){
//      return attrVal;
//    }
//  };
// })(element);



function main() {

}
main();

function getRecursiveWords(word) {
  const words = model[word];

  if (!words) {
    return [];
  }

  return [word, ...getRecursiveWords(words[0])];
}

function changeInput(value) {
  if (value.length < 1) {
    return;
  }

  const lastWord = value?.trim()?.split(" ")?.pop();

  console.log("lastWord: ", lastWord);
  console.log("length: ", lastWord.length);

  const words = model[lastWord];

  if (!words) {
    return;
  }

  console.log("words from predictor: ", words);

  sug2.innerText = words?.[0] || getRecursiveWords(lastWord)?.[0] || "";
  sug3.innerText = words?.[1] || getRecursiveWords(lastWord)?.[0] || "";
  sug1.innerText = words?.[2] || getRecursiveWords(lastWord)?.[0] || "";

  // if (value[value.length - 1] !== " ") {
  //   // const words = getCorrectWordsFromModel(value.trim());

  //   sug2.innerText = words?.[0] || "";
  //   sug3.innerText = words?.[1] || "";
  //   sug1.innerText = words?.[2] || "";
  // } else {
  //   const lastWord = value?.trim()?.split(" ")?.pop();


  //   const words = getNextThreeWords(lastWord);

  //   console.log("words from predictor: ", words);

  //   sug2.innerText = words?.[0] || "";
  //   sug3.innerText = words?.[1] || "";
  //   sug1.innerText = words?.[2] || "";
  // }
}

setOnChange(input, changeInput);

// input.addEventListener("keyup", (e) => changeInput(e.target.value));
// input.addEventListener("change", (e) => {
//   console.log("mudou")
//   changeInput(e.target.value)
// });

const space = (value) => value[value.length - 1] !== " " ? " " : "";

sug1.addEventListener("click", (e) => {
  input.value += `${space(input.value)}${e.target.innerText} `;
  const w = e.target.innerText;
  sug1.innerText = "";
  changeInput(w)
})
sug2.addEventListener("click", (e) => {
  input.value += `${space(input.value)}${e.target.innerText} `;
  const w = e.target.innerText
  sug2.innerText = "";
  changeInput(w)
})
sug3.addEventListener("click", (e) => {
  input.value += `${space(input.value)}${e.target.innerText} `;
  const w = e.target.innerText
  sug3.innerText = "";
  changeInput(w)
})

// main()