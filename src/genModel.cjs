// import fs from "fs"
// import path from "path"

const fs = require("fs")
const path = require("path")

const folderPath = path.join(__dirname, '../modelData');

const model = new Map();

// Function to clean the text
function cleanText(text) {
  text = text.replace(/\r?\n/g, ' ').replace(/\t/g, ' ').replace(/\s\s+/g, ' ').toLowerCase();
  text = text.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '');
  return text;
}

// Function to read and process text files
async function getWords() {
  const words = await new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading folder:', err);
        return;
      }

      const wordsFromFile = [];

      files.forEach((file) => {
        const filePath = path.join(folderPath, file);

        // Read the text file
        const text = fs.readFileSync(filePath, 'utf8');
        const cleanedText = cleanText(text)?.split(" ")
          .map(word => wordsFromFile.push(word.trim()));
      });

      resolve(wordsFromFile);
    });
  })
  return words;
}


async function genModel() {
  const words = await getWords();

  // getting all next words and words tokens
  for (let i = 0; i < words.length - 1; i++) {
    const element = words[i];

    if (element.length < 1) continue;

    if (model.has(element)) {
      const modelElement = model.get(element);
      if (modelElement.nextWord.has(words[i + 1])) {
        modelElement.nextWord.set(words[i + 1], {
          count: modelElement.nextWord.get(words[i + 1]).count + 1
        });
      } else {
        modelElement.nextWord.set(words[i + 1], {
          count: 1
        });
      }
    } else {
      model.set(element, {
        nextWord: new Map()
      });
      model.get(element).nextWord.set(words[i + 1], {
        count: 1
      });
    }

  }
  console.log("## model created ##")

  // reducing amount of next words to 3 sorted by count
  for (let [key, value] of model) {
    const nextWords = Array.from(value.nextWord?.entries());

    const nextWordsSorted = nextWords.sort((a, b) => {
      return b[1].count - a[1].count;
    })

    const nextThreeWords = nextWordsSorted.slice(0, 3).map((el) => el[0]);
    model.get(key).nextWord = nextThreeWords;
  }
  console.log("## model reduced ##")

  // converting map to simple object and adding most the 3 most similiar words
  const modelObj = {};
  for (let [key, value] of model) {
    modelObj[key] = value.nextWord;
  }
  console.log("## model converted ##")


  fs.writeFileSync(path.join(__dirname, '../output/model.json'), JSON.stringify(modelObj));
  console.log("## model saved ##")
}

genModel();