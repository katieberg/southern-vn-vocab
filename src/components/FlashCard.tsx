import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import { FlashCardContext } from "../FlashCardContext";

export function FlashCard() {
  const wordList = useContext(FlashCardContext);

  let [wordNum, setWordNum] = useState(0);
  let [attemptWord, setAttemptWord] = useState("");
  let [passOrFail, setPassOrFail] = useState("");
  let [diff, setDiff] = useState([0]);
  var wordArray = wordList.split("\n");
  var firstLine = wordArray[wordNum].toLowerCase();
  var answer = firstLine.split(";")[0];
  var prompt = firstLine.split(";")[1];
  var translated = firstLine.split(";")[3];
  var fullSentence = firstLine.split(";")[2];
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
    if (attemptWord.toLowerCase() == answer) {
      setPassOrFail("Pass");
      diffFunction();
      setAttemptWord("");
      setTimeout(nextCard, 1000);
    } else if (attemptWord.toLowerCase() != answer) {
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
        display: "flex",
        justifyContent: "center",
        margin: "0 auto",
      }}
      className="mb-2"
    >
      <Card.Header>New Word/Old Word</Card.Header>
      <Card.Body>
        <Card.Title> {prompt}</Card.Title>
        <Card.Text>{translated}</Card.Text>
        <Form onSubmit={(event) => handleSubmit(event)}>
          {passOrFail != "" && (
            <div>
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
            value={attemptWord}
            onChange={(e) => handleChange(e)}
          />
        </Form>
        <Card.Text>adj</Card.Text>
      </Card.Body>
    </Card>
  );
}
