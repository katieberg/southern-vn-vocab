import { useState, useEffect } from "react";
import { dataProps } from "myTypes";
import dayjs from "dayjs";
import { supermemo, SuperMemoItem, SuperMemoGrade } from "supermemo";
//ID;Answer;Male Answer MP3; Female Answer MP3;Prompt;Full Sentence;Male Sentence MP3;Female Sentence MP3;Word in English;Sentence in English;SuperMemo Interval;SuperMemo Repetition;SuperMemo EFactor
interface Flashcard extends SuperMemoItem {
  id: string;
  answerInVietnamese: string;
  maleAnswerMP3: string;
  femaleAnswerMP3: string;
  prompt: string;
  sentenceInVietnamese: string;
  maleSentenceMP3: string;
  femaleSentenceMP3: string;
  wordInEnglish: string;
  sentenceInEnglish: string;
  dueDate: string;
}

function practice(flashcard: Flashcard, grade: SuperMemoGrade): Flashcard {
  const { interval, repetition, efactor } = supermemo(flashcard, grade);
  const dueDate = dayjs(Date.now()).add(interval, "day").toISOString();
  return { ...flashcard, interval, repetition, efactor, dueDate };
}

export function Card(data: dataProps) {
  let myData = data;
  // let [numAttempts, setNumAttempts] = useState(myData.numAttempts);
  let [dueTodayPile, setDueTodayPile] = useState(myData.dueTodayPile);
  let [dueYesterdayPile, setDueYesterdayPile] = useState(
    myData.dueYesterdayPile
  );
  let [dueLaterPile, setDueLaterPile] = useState(myData.dueLaterPile);
  let [dueDateRow] = useState(myData.dueDateRow);
  let [category, setCategory] = useState("");
  let [newWordsArray, setNewWordsArray] = useState([""]);
  let [attemptWord, setAttemptWord] = useState("");
  let [passOrFail, setPassOrFail] = useState("");
  let [diff, setDiff] = useState([0]);
  let [firstTryBool, setFirstTryBool] = useState(true); //don't need w supermemo
  let [shrink, setShrink] = useState(false);
  let [pitch, setPitch] = useState("female");

  var decideCategory = () => {
    let headerStr: string =
      "ID;Answer;Male Answer MP3; Female Answer MP3;Prompt;Full Sentence;Male Sentence MP3;Female Sentence MP3;Word in English;Sentence in English;SuperMemo Interval;SuperMemo Repetition;SuperMemo EFactor;SuperMemo Due Date";
    if (
      dueYesterdayPile == headerStr ||
      dueYesterdayPile == "" ||
      dueYesterdayPile == undefined
    ) {
      if (
        dueTodayPile == headerStr ||
        dueTodayPile == "" ||
        dueTodayPile == undefined
      ) {
        setCategory("noWordsLeft");
      } else setCategory("dueTodayPile");
    } else {
      setCategory("dueYesterdayPile");
    }
  };
  useEffect(() => {
    // setNumAttempts(myData.numAttempts);
    setDueTodayPile(
      localStorage.getItem("dueTodayPile") || myData.dueTodayPile
    );
    setDueYesterdayPile(myData.dueYesterdayPile);
    setDueLaterPile(myData.dueLaterPile);

    decideCategory();
    let saved: string = "";
    if (category == "dueYesterdayPile") {
      saved = dueYesterdayPile;
    } else if (category == "dueTodayPile") {
      saved = dueTodayPile;
    } else {
      saved = "";
    }
    const arr = saved?.split("\n");
    if (newWordsArray.length == arr.length) {
    } else {
      setNewWordsArray(arr || [""]);
    }
  }, [
    myData.dueTodayPile,
    myData.dueYesterdayPile,
    myData.dueLaterPile,
    dueYesterdayPile,
    category,
    newWordsArray,
    dueTodayPile,
    dueLaterPile,
  ]);

  if (newWordsArray.length <= 1) {
    return <>loading2...</>;
  }
  var currentFlashCardDataStr = newWordsArray[1]?.toLowerCase(); //how to make use of supermemo?do i have to sort all of them????
  var currentFlashCardDataArr = currentFlashCardDataStr.split(";");
  let flashCard: Flashcard = {
    id: currentFlashCardDataArr[0],
    answerInVietnamese: currentFlashCardDataArr[1],
    maleAnswerMP3: currentFlashCardDataArr[2],
    femaleAnswerMP3: currentFlashCardDataArr[3],
    prompt: currentFlashCardDataArr[4],
    sentenceInVietnamese: currentFlashCardDataArr[5],
    maleSentenceMP3: currentFlashCardDataArr[6],
    femaleSentenceMP3: currentFlashCardDataArr[7],
    wordInEnglish: currentFlashCardDataArr[8],
    sentenceInEnglish: currentFlashCardDataArr[9],
    interval: parseInt(currentFlashCardDataArr[10]),
    repetition: parseInt(currentFlashCardDataArr[11]),
    efactor: parseInt(currentFlashCardDataArr[12]),
    dueDate: currentFlashCardDataArr[13],
  }; //want this as part of state? or to have function that converts flashcard back to array in the format of currentFlashCardDataArr
  function flashCardToDataArr(flashcard: Flashcard) {
    let tempArr: string[] = [];
    tempArr.push(flashcard.id);
    tempArr.push(flashcard.answerInVietnamese);
    tempArr.push(flashcard.maleAnswerMP3);
    tempArr.push(flashcard.femaleAnswerMP3);
    tempArr.push(flashcard.prompt);
    tempArr.push(flashcard.sentenceInVietnamese);
    tempArr.push(flashcard.maleSentenceMP3);
    tempArr.push(flashcard.femaleSentenceMP3);
    tempArr.push(flashcard.wordInEnglish);
    tempArr.push(flashcard.sentenceInEnglish);
    tempArr.push(flashcard.interval.toString());
    tempArr.push(flashcard.repetition.toString());
    tempArr.push(flashcard.efactor.toString());
    tempArr.push(flashcard.dueDate);
    return tempArr;
  }
  var answer = currentFlashCardDataArr[1];
  var maleAnswerMP3File = currentFlashCardDataArr[2];
  var femaleAnswerMP3File = currentFlashCardDataArr[3];
  var prompt = currentFlashCardDataArr[4];
  var maleSentenceMP3File = currentFlashCardDataArr[6];
  var femaleSentenceMP3File = currentFlashCardDataArr[7];
  var translatedAnswer = currentFlashCardDataArr[8];
  var translatedSentence = currentFlashCardDataArr[9];
  var dueTodayArr = dueTodayPile.split("\n");
  var dueLaterArr = dueLaterPile.split("\n");

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
  function decidePile(cardData: string[]) {
    //for some reason the card initially can go to dueToday then disappears after next card
    let entryDate: dayjs.Dayjs = dayjs(cardData[dueDateRow]);
    if (dayjs().isBefore(entryDate)) {
      dueLaterArr.push(cardData.join(";")); //need to use setstate and update storage
      localStorage.setItem("dueLaterPile", dueLaterArr.join("\n"));
      setDueLaterPile(dueLaterArr.join("\n"));
    } else {
      let temp = dueTodayPile.split("\n");
      temp.splice(1, 1);
      temp.push(cardData.join(";"));
      localStorage.setItem("dueTodayPile", temp.join("\n"));
      setDueTodayPile(dueTodayArr.join("\n"));
      setNewWordsArray(temp);
    }
  }
  var moveToNewPile = () => {
    //for this, we need to instead update by using supermemo practice function (should be handled in handleSubmit), AND move to the correct pile based on that (using decideCategory function).
    newWordsArray.splice(1, 1); //need this? below?
    // currentFlashCardDataStr = currentFlashCardDataArr.join(";");
    // newWordsArray.push(currentFlashCardDataStr);
    // localStorage.setItem(category, newWordsArray.join("\n"));

    // setSeenPile(newWordsArray.join("\n"));
    // decideCategory();
    localStorage.setItem(category, newWordsArray.join("\n"));
    if (category == "dueTodayPile") {
      setDueTodayPile(newWordsArray.join("\n"));
    } else {
      setDueYesterdayPile(newWordsArray.join("\n"));
    }

    decidePile(flashCardToDataArr(flashCard));

    decideCategory();
  };

  var nextCard = () => {
    moveToNewPile();
    setPassOrFail("");
    setAttemptWord("");
    setDiff([0]);
    decideCategory();
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
        flashCard = practice(flashCard, 5);
      }

      setPassOrFail("Pass");
      diffFunction();
      setAttemptWord("");
      setTimeout(nextCard, 3000);
    } else if (attemptWord.toLowerCase() != answer) {
      flashCard = practice(flashCard, 0);
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
              {/* need to fix this once the meat is working */}
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
