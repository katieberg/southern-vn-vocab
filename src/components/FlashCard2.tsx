import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { dataProps } from "myTypes";

export function FlashCard2(data: dataProps) {
  let myData = data;
  // let [numAttempts, setNumAttempts] = useState(myData.numAttempts);
  let [numWordsSeen, setNumWordsSeen] = useState(myData.numWordsSeen);
  let [numCorrect, setNumCorrect] = useState(myData.numCorrect);
  let [seenPile, setSeenPile] = useState(myData.seenPile);
  let [newPile, setNewPile] = useState(myData.newPile);

  useEffect(() => {
    // setNumAttempts(myData.numAttempts);
    setNumWordsSeen(myData.numWordsSeen);
    setNumCorrect(myData.numCorrect);
    setSeenPile(myData.seenPile);
    setNewPile(myData.newPile);
  }, [
    myData.numAttempts,
    myData.numWordsSeen,
    myData.numCorrect,
    myData.seenPile,
    myData.newPile,
  ]);
  var decideCategory = () => {
    if (
      seenPile ==
        "Answer;MP3 for answer only;Prompt;Full Sentence;MP3 for full Sentence;Word in English;Sentence in English" +
          "\n" ||
      seenPile == "" ||
      numCorrect > numWordsSeen
    ) {
      return "newPile";
    } else {
      return "seenPile";
    }
  };
  let [category, setCategory] = useState(() => {
    //issue: this is staying as seenPile, but it's still pulling from newPile, but marking them previously seen???
    return decideCategory();
  });

  const [newWordsArray, setNewWordsArray] = useState([""]);

  useEffect(() => {
    const saved = category == "seenPile" ? seenPile : newPile;
    const arr = saved?.split("\n");
    setNewWordsArray(arr || [""]);
  }, [category, seenPile, newPile, setNewWordsArray]);

  let [attemptWord, setAttemptWord] = useState("");
  let [passOrFail, setPassOrFail] = useState("");
  let [diff, setDiff] = useState([0]);
  let [firstTryBool, setFirstTryBool] = useState(true);
  if (newWordsArray.length <= 1) {
    return <>loading2...</>;
  }
  var currentFlashCardDataStr = newWordsArray[1]?.toLowerCase();
  var currentFlashCardDataArr = currentFlashCardDataStr.split(";");
  var answer = currentFlashCardDataArr[0];
  var wordOnlyMP3File = currentFlashCardDataArr[1];
  var prompt = currentFlashCardDataArr[2];
  var sentenceMP3file = currentFlashCardDataArr[4];
  var translated = currentFlashCardDataArr[5];
  var wordHistoryStr = currentFlashCardDataArr[7] || "";
  var wordHistoryArr = wordHistoryStr.split(" ");

  var chunk1 = "";
  var chunk2 = "";
  var chunk3 = "";
  let underscoreBool = false;
  let currChunk = 0;
  let underscoreChunk = 0;
  for (let i = 0; i < prompt?.length; i++) {
    if (currChunk == 0) {
      currChunk++;
      if (prompt.charAt(i) == "_") {
        underscoreBool = true;
      }
    } else if (
      (prompt.charAt(i) == "_" && underscoreBool == false) ||
      (prompt.charAt(i) == " " &&
        underscoreBool == false &&
        prompt.charAt(i + 1) &&
        prompt.charAt(i + 1) == "_") ||
      (underscoreBool == true &&
        prompt.charAt(i) != "_" &&
        prompt.charAt(i) != " ")
    ) {
      underscoreBool = !underscoreBool;
      currChunk++;
    }
    if (currChunk == 1) {
      chunk1 = chunk1 + prompt.charAt(i);
      if (underscoreBool == true) {
        underscoreChunk = 1;
      }
    }
    if (currChunk == 2) {
      chunk2 = chunk2 + prompt.charAt(i);
      if (underscoreBool == true) {
        underscoreChunk = 2;
      }
    }
    if (currChunk == 3) {
      chunk3 = chunk3 + prompt.charAt(i);
      if (underscoreBool == true) {
        underscoreChunk = 3;
      }
    }
  }
  var moveToSeenPile = () => {
    newWordsArray.splice(1, 1);
    localStorage.setItem(
      "seenPile",
      localStorage.getItem("seenPile") +
        currentFlashCardDataStr +
        ";-1 -1 -1 -1 -1 -1 -1 -1 -1 " +
        firstTryBool
    );
    localStorage.setItem("newPile", newWordsArray.join("\n"));
    localStorage.setItem("numWordsSeen", (numWordsSeen + 1).toString());
    setNewPile(newWordsArray.join("\n"));
    setSeenPile(
      seenPile +
        currentFlashCardDataStr +
        ";-1 -1 -1 -1 -1 -1 -1 -1 -1 " +
        firstTryBool
    );
    setCategory(decideCategory());
    setNumWordsSeen(numWordsSeen + 1);
  };
  var updateSeenPile = () => {
    newWordsArray.splice(1, 1);
    wordHistoryArr.shift();
    wordHistoryArr.push(" " + firstTryBool);
    currentFlashCardDataArr[7] = wordHistoryArr.join(" ");
    newWordsArray.push(currentFlashCardDataStr);
    localStorage.setItem(category, newWordsArray.join("\n"));
    localStorage.setItem(
      "numCorrect",
      firstTryBool ? (numCorrect + 1).toString() : numCorrect.toString()
    );
    setSeenPile(newWordsArray.join("\n"));
    setCategory(decideCategory());
  };

  var nextCard = () => {
    if (category == "newPile") {
      moveToSeenPile();
    } else {
      updateSeenPile();
    }
    setPassOrFail("");
    setAttemptWord("");
    setDiff([0]);
    setCategory(decideCategory());
    setFirstTryBool(true);
  };
  var handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttemptWord(event.target.value);
    setDiff([0]);
    setPassOrFail("");
  };
  var diffFunction = () => {
    for (let i = 0; i < answer.length; i++) {
      if (attemptWord[i] != answer[i] && attemptWord.length == answer.length) {
        setDiff((diff) => [...diff, -1]);
      } else {
        setDiff((diff) => [...diff, 1]);
      }
    }
  };
  var handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let sentenceMP3 = "../../mp3s/" + sentenceMP3file;
    let wordMP3 = "../../mp3s/" + wordOnlyMP3File;
    if (attemptWord.toLowerCase() == answer) {
      new Audio(sentenceMP3).play();
      if (firstTryBool == true) {
        localStorage.setItem("numCorrect", (numCorrect + 1).toString());
        setNumCorrect(numCorrect + 1);
      }

      setPassOrFail("Pass");
      diffFunction();
      setAttemptWord("");
      setTimeout(nextCard, 3000);
    } else if (attemptWord.toLowerCase() != answer) {
      new Audio(wordMP3).play();
      diffFunction();
      setFirstTryBool(false);
      setPassOrFail("Fail");
      setAttemptWord("");
    }
  };

  //want to fix colors and font family, also sometimes when input box is on a new line, the answer fills in above the line
  return (
    <main>
      <div className="flashcard">
        <h2>{category == "newPile" ? "New Word" : "Previously Seen"}</h2>
        <div className="flashcard-body">
          <>
            {underscoreChunk == 1 && (
              <>
                <form
                  className="prompt"
                  onSubmit={(event) => handleSubmit(event)}
                >
                  <div className="overlap-input">
                    {passOrFail != "" && (
                      <div className="solution-reveal">
                        {diff.map((element, index) => {
                          if (element == 1) {
                            return (
                              <span key={index} className="correct-letter">
                                {answer.charAt(index - 1)}
                              </span>
                            );
                          } else if (element == -1) {
                            return (
                              <span key={index} className="incorrect-letter">
                                {answer.charAt(index - 1)}
                              </span>
                            );
                          }
                        })}
                      </div>
                    )}
                    <input
                      type="text"
                      style={{
                        width: answer.length + "ch",
                      }}
                      value={attemptWord}
                      onChange={(e) => handleChange(e)}
                    ></input>
                    <p className="section">&emsp;{chunk2}</p>
                  </div>
                </form>
              </>
            )}
            {underscoreChunk == 2 && (
              <>
                <form
                  className="prompt"
                  onSubmit={(event) => handleSubmit(event)}
                >
                  <p className="section">{chunk1}&emsp;</p>
                  <div className="overlap-input">
                    {passOrFail != "" && (
                      <div className="solution-reveal">
                        {diff.map((element, index) => {
                          if (element == 1) {
                            return (
                              <span key={index} className="correct-letter">
                                {answer.charAt(index - 1)}
                              </span>
                            );
                          } else if (element == -1) {
                            return (
                              <span key={index} className="incorrect-letter">
                                {answer.charAt(index - 1)}
                              </span>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                  <input
                    style={{ width: answer.length + "ch" }}
                    type="text"
                    value={attemptWord}
                    onChange={(e) => handleChange(e)}
                  ></input>
                  <p className="section">&emsp;{chunk3}</p>
                </form>
              </>
            )}
          </>
          <div className="translated">{translated}</div>
        </div>
      </div>
    </main>
  );
}
