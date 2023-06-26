import { Background } from "./components/Background";

import { useEffect, useState } from "react";

import "./App.css";
import textfile from "./assets/anki_sample_word_upfront.txt";

function App() {
  let getIntFromStorage = (item: string) => {
    if (item != undefined) {
      return parseInt(item);
    } else return 0;
  };
  let [newPile, setNewPile] = useState("");
  let [seenPile, setSeenPile] = useState("");
  let [numAttempts, setNumAttempts] = useState(0);
  let [numWordsSeen, setNumWordsSeen] = useState(0);
  let [numCorrect, setNumCorrect] = useState(0);
  useEffect(() => {
    fetch(textfile)
      .then((response) => response.text())
      .then((textContent) => {
        setNewPile(localStorage.getItem("newPile") || textContent);
        setSeenPile(
          localStorage.getItem("category1") ||
            "Answer;MP3 for answer only;Prompt;Full Sentence;MP3 for full Sentence;Word in English;Sentence in English" +
              "\n"
        );
        setNumAttempts(
          getIntFromStorage(localStorage.getItem("numAttempts") || "0")
        );
        setNumWordsSeen(
          getIntFromStorage(localStorage.getItem("numWordsSeen") || "0")
        );
        setNumCorrect(
          getIntFromStorage(localStorage.getItem("numCorrect") || "0")
        );
        localStorage.setItem(
          "newPile",
          localStorage.getItem("newPile") || textContent
        ); //check if local storage has anything, if not then put text content
        localStorage.setItem(
          "seenPile",
          localStorage.getItem("category1") ||
            "Answer;MP3 for answer only;Prompt;Full Sentence;MP3 for full Sentence;Word in English;Sentence in English" +
              "\n"
        );
        localStorage.setItem(
          "numAttempts",
          localStorage.getItem("numAttempts") || "0"
        ); //same
        localStorage.setItem(
          "numWordsSeen",
          localStorage.getItem("numWordsSeen") || "0"
        ); //same
        localStorage.setItem(
          "numCorrect",
          localStorage.getItem("numCorrect") || "0"
        ); //same
      });
  }, []);
  let props = {
    newPile: newPile,
    seenPile: seenPile,
    numAttempts: numAttempts,
    numWordsSeen: numWordsSeen,
    numCorrect: numCorrect,
  };
  return (
    <>
      <Background {...props} />
    </>
  );
}

export default App;
