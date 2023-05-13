import { Background } from "./components/Background";
// import React from "react";
import { FlashCardContext } from "./FlashCardContext";

import "./App.css";
import textfile from "./assets/anki_sample_word_upfront.txt";
let textString = "";
function Notes() {
  fetch(textfile)
    .then((response) => response.text())
    .then((textContent) => {
      textString = textContent;
    });
}
Notes();

function App() {
  return (
    <>
      <FlashCardContext.Provider value={textString}>
        <Background />
      </FlashCardContext.Provider>
    </>
  );
}

export default App;
