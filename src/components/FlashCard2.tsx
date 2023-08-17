import { useState, useEffect } from "react";
import { dataProps } from "myTypes";

//uncomment when ready to do supermemo
// import dayjs from "dayjs";
// import { supermemo, SuperMemoItem, SuperMemoGrade } from "supermemo";
// interface Flashcard extends SuperMemoItem {
//   front: string; //"prompt" in current vars
//   back: string; //"answer" in current vars
//   dueDate: string;
//   frontMP3Male: string; //sentenceMP3file
//   backMP3Male: string; //wordOnlyMP3file in current vars
//   frontMP3Female: string;
//   backMP3Female: string;
//   translatedFront: string; //translatedSentence
//   translatedBack: string; //translatedAnswer
// }

export function FlashCard(data: dataProps) {
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
        "ID;Answer;Male Answer MP3; Female Answer MP3;Prompt;Full Sentence;Male Sentence MP3;Female Sentence MP3;Word in English;Sentence in English" +
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
  let [shrink, setShrink] = useState(false);
  let [pitch, setPitch] = useState("female");
  if (newWordsArray.length <= 1) {
    return <>loading2...</>;
  }

  var currentFlashCardDataStr = newWordsArray[1]?.toLowerCase();
  var currentFlashCardDataArr = currentFlashCardDataStr.split(";");
  // var id = currentFlashCardDataArr[0];
  var answer = currentFlashCardDataArr[1];
  var maleAnswerMP3File = currentFlashCardDataArr[2];
  var femaleAnswerMP3File = currentFlashCardDataArr[3];
  var prompt = currentFlashCardDataArr[4];
  var maleSentenceMP3File = currentFlashCardDataArr[6];
  var femaleSentenceMP3File = currentFlashCardDataArr[7];
  var translatedAnswer = currentFlashCardDataArr[8];
  var translatedSentence = currentFlashCardDataArr[9];
  var wordHistoryStr = currentFlashCardDataArr[10] || "";
  var wordHistoryTemp = wordHistoryStr.split(" ");

  var wordHistoryArr: boolean[] = wordHistoryTemp.map((str) => {
    if (str == "true") return true;
    else return false;
  });

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
        ";false false false false false false false false false " +
        firstTryBool
    );
    localStorage.setItem("newPile", newWordsArray.join("\n"));
    localStorage.setItem("numWordsSeen", (numWordsSeen + 1).toString());
    setNewPile(newWordsArray.join("\n"));
    setSeenPile(
      seenPile +
        currentFlashCardDataStr +
        ";false false false false false false false false false " +
        firstTryBool
    );
    setCategory(decideCategory());
    setNumWordsSeen(numWordsSeen + 1);
  };
  var updateSeenPile = () => {
    newWordsArray.splice(1, 1);
    wordHistoryArr.shift();
    wordHistoryArr.push(firstTryBool);
    currentFlashCardDataArr[7] = wordHistoryArr.join(" ");
    currentFlashCardDataStr = currentFlashCardDataArr.join(";");
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
    let answerMP3File;
    let sentenceMP3File;
    if (pitch == "female") {
      answerMP3File = femaleAnswerMP3File;
      sentenceMP3File = femaleSentenceMP3File;
    } else {
      answerMP3File = maleAnswerMP3File;
      sentenceMP3File = maleSentenceMP3File;
    }
    let sentenceMP3Path = "../../mp3s/" + sentenceMP3File;
    let answerMP3Path = "../../mp3s/" + answerMP3File;
    if (attemptWord.toLowerCase() == answer) {
      new Audio(sentenceMP3Path).play();
      if (firstTryBool == true) {
        localStorage.setItem("numCorrect", (numCorrect + 1).toString());
        setNumCorrect(numCorrect + 1);
      }

      setPassOrFail("Pass");
      diffFunction();
      setAttemptWord("");
      setTimeout(nextCard, 3000);
    } else if (attemptWord.toLowerCase() != answer) {
      new Audio(answerMP3Path).play();
      diffFunction();
      setFirstTryBool(false);
      setPassOrFail("Fail");
      setAttemptWord("");
    }
  };

  var toggleShrink = () => {
    setShrink(!shrink);
  };
  var togglePitch = () => {
    if (pitch == "female") {
      setPitch("male");
    } else {
      setPitch("female");
    }
  };

  return (
    <main>
      <div className="flashcard">
        <h2>
          <div className="toggle-top">
            <span>
              {category == "newPile" ? "New Word" : "Previously Seen"}
            </span>
            <span className="toggle" onClick={togglePitch}>
              {pitch == "female" ? "♀" : "♂"}
            </span>
          </div>
        </h2>

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
                  </div>
                  <p className="section">&emsp;{chunk2}</p>
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
                    <input
                      style={{ width: answer.length + "ch" }}
                      type="text"
                      value={attemptWord}
                      onChange={(e) => handleChange(e)}
                    ></input>
                  </div>

                  <p className="section">&emsp;{chunk3}</p>
                </form>
              </>
            )}
          </>
        </div>
      </div>
      <div className="shrink-card">
        <div className="toggle-top">
          <p className="translated-answer">{translatedAnswer}</p>
          <span className="toggle" onClick={toggleShrink}>
            {shrink ? "˅" : "˄"}
          </span>
        </div>

        <p
          className="translated-sentence"
          style={{ display: shrink ? "none" : "block" }}
        >
          {translatedSentence}
        </p>
      </div>
    </main>
  );
}
