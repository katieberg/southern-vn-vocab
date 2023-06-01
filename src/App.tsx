import { Background } from "./components/Background";

import { FlashCardContext } from "./FlashCardContext";
import { useEffect, useState } from "react";

import "./App.css";
import textfile from "./assets/anki_sample_word_upfront.txt";

function App() {
  let [textArray, setTextArray] = useState<string[]>([]);
  useEffect(() => {
    fetch(textfile)
      .then((response) => response.text())
      .then((textContent) => {
        setTextArray(textContent.split("\n"));
      });
  }, []);
  return (
    <>
      <FlashCardContext.Provider value={textArray}>
        <Background />
      </FlashCardContext.Provider>
    </>
  );
}

export default App;
