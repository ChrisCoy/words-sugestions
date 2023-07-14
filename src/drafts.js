function getCorrectWordsFromModel(word) {
  const keys = Array.from(model.keys());

  // if (model.get(word)) {
  //   return;
  // }

  const indexesFromTheMostSimilar = [];
  let distanceFromTheMostSimilar = 0;

  const originalWordVec = wordToVec(word);

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === word) continue;

    const distance = calcDistance(originalWordVec, wordToVec(keys[i]));
    if (distance > distanceFromTheMostSimilar) {
      distanceFromTheMostSimilar = distance;

      if (indexesFromTheMostSimilar.length > 3) {
        indexesFromTheMostSimilar.shift();
        indexesFromTheMostSimilar.push(i);
      } else {
        indexesFromTheMostSimilar.push(i);
      }
    }
  }

  const arrayToReturn = [];

  indexesFromTheMostSimilar.forEach(i => {
    if (!!keys[i]) {
      arrayToReturn.push(keys[i]);
    }
  })

  return arrayToReturn;
}

function getCorrectWordsFromModel(word) {
  const keys = Array.from(model.keys());

  // if (model.get(word)) {
  //   return;
  // }

  const indexesFromTheMostSimilar = [];
  let distanceFromTheMostSimilar = 0;

  const originalWordVec = wordToVec(word);

  let arrayToReturn = [];

  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === word) continue;

    const distance = calcDistance(originalWordVec, wordToVec(keys[i]));
    if (distance > 0.9 && distance < 1) {
      console.log("distance: ", distance);
      console.log("word: ", word)
      console.log("key: ", keys[i])
      arrayToReturn.push(keys[i]);
    }
  }



  // indexesFromTheMostSimilar.forEach(i => {
  //   if (!!keys[i]) {
  //     arrayToReturn.push(keys[i]);
  //   }
  // })

  return arrayToReturn;
}


function getNextThreeWords(word) {
  const wordFromMap = model.get(word);
  if (!wordFromMap) {
    const similiarWords = getCorrectWordsFromModel(word);
    if (similiarWords.length > 0) {
      return getNextThreeWords(similiarWords[0]);
    }
  }

  const nextWords = Array.from(model.get(word).nextWord?.keys());

  const nextWordsSorted = nextWords.sort((a, b) => {
    return b.count - a.count;
  })

  const nextThreeWords = nextWordsSorted.slice(0, 3);

  return nextThreeWords;
}


function wordToVec(word) {
  let counterChars = {};

  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    if (counterChars[char]) {
      counterChars[char] += 1;
    } else {
      counterChars[char] = 1;
    }
  }

  const setOfChars = new Set(word);
  let wordVecLength = 0;

  for (let key in counterChars) {
    wordVecLength += counterChars[key] * counterChars[key];
  }

  wordVecLength = Math.sqrt(wordVecLength);

  return {
    counterChars,
    setOfChars,
    wordVecLength
  }
}

function calcDistance(firstVec, secondVec) {
  let distance = 0;
  for (let key in firstVec.counterChars) {
    if (secondVec.counterChars[key]) {
      distance += firstVec.counterChars[key] * secondVec.counterChars[key];
    }
  }
  return distance / (firstVec.wordVecLength * secondVec.wordVecLength);
}
