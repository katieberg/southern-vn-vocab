import { Background } from "./components/Background";

import { useEffect, useState } from "react";
import "./App.css";
import textfile from "./assets/anki_sample_word_upfront_with_audio.txt";
import dayjs from "dayjs";

function App() {
  let getIntFromStorage = (item: string) => {
    if (item != undefined) {
      return parseInt(item);
    } else return 0;
  };
  let [notYetSeenPile, setNotYetSeenPile] = useState(""); //change this name later
  let [dueYesterdayPile, setDueYesterdayPile] = useState("");
  let [dueTodayPile, setDueTodayPile] = useState("");
  let [dueLaterPile, setDueLaterPile] = useState("");
  let [lastLogin, setLastLogin] = useState("");
  let [dueDateRow, setDueDateRow] = useState(13); //if you alter the csv file you need to update this... not setting til next render but need in first render.........
  useEffect(() => {
    fetch(textfile)
      .then((response) => response.text())
      .then((textContent) => {
        let headerStr: string =
          "ID;Answer;Male Answer MP3; Female Answer MP3;Prompt;Full Sentence;Male Sentence MP3;Female Sentence MP3;Word in English;Sentence in English;SuperMemo Interval;SuperMemo Repetition;SuperMemo EFactor;SuperMemo Due Date";
        setLastLogin(localStorage.getItem("lastLogin") || "");
        localStorage.setItem(
          "lastLogin",
          localStorage.getItem("lastLogin") || ""
        );
        let allFlashCardsArray: string[];
        let dueYesterdayArr: string[] =
          localStorage.getItem("dueYesterdayPile")?.split("\n") || [];
        let dueTodayArr: string[] =
          localStorage.getItem("dueTodayPile")?.split("\n") || [];
        let dueLaterArr: string[] =
          localStorage.getItem("dueLaterPile")?.split("\n") || [];
        let notYetSeenArr: string[] =
          localStorage.getItem("notYetSeenPile")?.split("\n") || [];
        let saved = false;
        if (
          dueYesterdayArr.length > 1 &&
          dueTodayArr.length > 1 &&
          dueLaterArr.length > 1 &&
          notYetSeenArr.length > 1
        ) {
          saved = true;
          allFlashCardsArray = [headerStr]; //need to remove from e.g. dueYesterdayArr after moving to allflashcardsarr
          for (let i = 1; i < dueYesterdayArr.length; i++) {
            allFlashCardsArray.push(dueYesterdayArr[i]);
            dueYesterdayArr.splice(i, 1);
          }
          for (let i = 1; i < dueTodayArr.length; i++) {
            allFlashCardsArray.push(dueTodayArr[i]);
            dueTodayArr.splice(i, 1);
          }
          for (let i = 1; i < dueLaterArr.length; i++) {
            allFlashCardsArray.push(dueLaterArr[i]);
            dueLaterArr.splice(i, 1);
          }
          for (let i = 1; i < notYetSeenArr.length; i++) {
            allFlashCardsArray.push(notYetSeenArr[i]);
            notYetSeenArr.splice(i, 1);
          }
        } else {
          allFlashCardsArray = textContent.split("\n");
          dueYesterdayArr[0] = headerStr;
          dueTodayArr[0] = headerStr;
          dueLaterArr[0] = headerStr;
          notYetSeenArr[0] = headerStr;
        }

        let headerArr: string[] = allFlashCardsArray[0].split(";");
        setDueDateRow(headerArr.lastIndexOf("SuperMemo Due Date"));

        function decidePile(cardData: string[]) {
          if (cardData[dueDateRow] == "" || cardData[dueDateRow] == undefined) {
            notYetSeenArr.push(cardData.join(";"));
          } else {
            let entryDate: dayjs.Dayjs = dayjs(cardData[dueDateRow]);
            if (dayjs().isBefore(entryDate)) {
              dueLaterArr.push(cardData.join(";"));
            } else if (dayjs().subtract(1, "day").isBefore(entryDate)) {
              dueTodayArr.push(cardData.join(";"));
            } else {
              dueYesterdayArr.push(cardData.join(";"));
            }
          }
        }
        for (let i: number = 1; i < allFlashCardsArray.length; i++) {
          let entryArr = allFlashCardsArray[i].split(";");
          decidePile(entryArr);
        }

        if (lastLogin == "" || lastLogin == undefined) {
          lastLogin = dayjs().toISOString();
          localStorage.setItem("lastLogin", lastLogin);
        }
        if (
          dayjs(lastLogin).isBefore(dayjs().subtract(1, "day")) ||
          dueTodayArr.length < 2
        ) {
          for (let i: number = 1; i < 11; i++) {
            if (notYetSeenArr[i]) {
              let tempArr: string[] = notYetSeenArr[i].split(";");
              tempArr[dueDateRow] = dayjs().toISOString();
              dueTodayArr.push(tempArr.join(";"));
              notYetSeenArr.splice(i, 1);
            } else {
              console.log("out of new words");
            }
          }
          lastLogin = dayjs().toISOString();
          localStorage.setItem("lastLogin", lastLogin);
        }
        setDueYesterdayPile(dueYesterdayArr.join("\n"));
        setDueTodayPile(dueTodayArr.join("\n"));
        setDueLaterPile(dueLaterArr.join("\n"));
        setNotYetSeenPile(notYetSeenArr.join("\n"));
        localStorage.setItem("dueYesterdayPile", dueYesterdayArr.join("\n"));
        localStorage.setItem("dueTodayPile", dueTodayArr.join("\n"));
        localStorage.setItem("dueLaterPile", dueLaterArr.join("\n"));
        localStorage.setItem("notYetSeenPile", notYetSeenArr.join("\n"));
      });
  }, []);
  let props = {
    dueYesterdayPile: dueYesterdayPile,
    dueTodayPile: dueTodayPile,
    dueLaterPile: dueLaterPile,
    notYetSeenPile: notYetSeenPile,
    dueDateRow: dueDateRow,
  };
  return (
    <>
      <Background {...props} />
    </>
  );
}

export default App;
