import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import { FlashCardContext } from "../FlashCardContext";

export function FlashCard() {
  const wordList = useContext(FlashCardContext);

  let [wordNum, setWordNum] = useState(1);
  let [attemptWord, setAttemptWord] = useState("");
  let [passOrFail, setPassOrFail] = useState("");
  let [diff, setDiff] = useState([0]);
  var wordArray = wordList.split("\n");
  var firstLine = wordArray[wordNum].toLowerCase();
  var answer = firstLine.split(";")[0];
  var sentenceMP3file = firstLine.split(";")[4];
  var wordOnlyMP3File = firstLine.split(";")[1];
  var prompt = firstLine.split(";")[2];
  var chunk1 = "";
  var chunk2 = "";
  var chunk3 = "";
  let underscoreBool = false;
  let currChunk = 0;
  let underscoreChunk = 0;
  for (let i = 0; i < prompt.length; i++) {
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
  console.log(
    "bool " +
      underscoreBool +
      " currChunk: " +
      currChunk.toString() +
      " chunk1: " +
      chunk1 +
      " chunk2: " +
      chunk2 +
      " chunk3: " +
      chunk3
  );

  var translated = firstLine.split(";")[5];
  var nextCard = () => {
    setWordNum(wordNum + 1);
    setPassOrFail("");
    setAttemptWord("");
    setDiff([0]);
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
    let sentenceMP3 = "../../public/mp3s/" + sentenceMP3file;
    let wordMP3 = "../../public/mp3s/" + wordOnlyMP3File;
    if (attemptWord.toLowerCase() == answer) {
      new Audio(sentenceMP3).play();
      setPassOrFail("Pass");
      diffFunction();
      setAttemptWord("");
      setTimeout(nextCard, 3000);
    } else if (attemptWord.toLowerCase() != answer) {
      new Audio(wordMP3).play();
      diffFunction();
      setPassOrFail("Fail");
      setAttemptWord("");
    }
  };

  return (
    <Card
      bg={"light"}
      key={"Light"}
      text={"dark"}
      style={{
        width: "18rem",
        margin: "0 auto",
      }}
      className="mb-2"
    >
      <Card.Header>New Word/Old Word</Card.Header>
      <Card.Body>
        <>
          {underscoreChunk == 1 && (
            <>
              <Form
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
                onSubmit={(event) => handleSubmit(event)}
              >
                <div>
                  {passOrFail != "" && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: "2",
                        margin: "0 0 0.5rem 0",
                        fontSize: "1.25rem",
                        fontWeight: "500",
                        lineHeight: "1.2",
                      }}
                    >
                      {diff.map((element, index) => {
                        if (element == 1) {
                          return (
                            <span key={index} style={{ color: "green" }}>
                              {answer.charAt(index - 1)}
                            </span>
                          );
                        } else if (element == -1) {
                          return (
                            <span key={index} style={{ color: "red" }}>
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
                      zIndex: "1",
                      margin: "0 0.5em 00.5rem 0",
                      fontWeight: "500",
                      lineHeight: "1.2",
                      fontSize: "1.25rem",
                      border: "none",
                      paddingTop: "0px",
                    }}
                    value={attemptWord}
                    onChange={(e) => handleChange(e)}
                    size={chunk1.length - 1}
                  ></input>
                  <Card.Title style={{ display: "inline" }}>
                    {" " + chunk2}
                  </Card.Title>
                </div>
              </Form>
            </>
          )}
          {underscoreChunk == 2 && (
            <>
              <Form
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
                onSubmit={(event) => handleSubmit(event)}
              >
                <Card.Title>{chunk1 + " "}</Card.Title>
                <div>
                  {passOrFail != "" && (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: "2",
                        margin: "0 0 00.5rem 0.5em",
                        fontSize: "1.25rem",
                        fontWeight: "500",
                        lineHeight: "1.2",
                      }}
                    >
                      {diff.map((element, index) => {
                        if (element == 1) {
                          return (
                            <span key={index} style={{ color: "green" }}>
                              {answer.charAt(index - 1)}
                            </span>
                          );
                        } else if (element == -1) {
                          return (
                            <span key={index} style={{ color: "red" }}>
                              {answer.charAt(index - 1)}
                            </span>
                          );
                        }
                      })}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  style={{
                    zIndex: "1",
                    margin: "0 0.5em 00.5rem 0.5em",
                    fontWeight: "500",
                    lineHeight: "1.2",
                    fontSize: "1.25rem",
                    border: "none",
                    paddingTop: "0px",
                  }}
                  value={attemptWord}
                  onChange={(e) => handleChange(e)}
                  size={chunk2.length - 1}
                ></input>
                <Card.Title>{" " + chunk3}</Card.Title>
              </Form>
            </>
          )}
        </>
        <Card.Text>{translated}</Card.Text>
      </Card.Body>
    </Card>
  );
}
