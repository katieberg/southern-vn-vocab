import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useContext, useState } from "react";
import { FlashCardContext } from "../FlashCardContext";

export function FlashCard() {
  const wordList = useContext(FlashCardContext);

  let [wordNum, setWordNum] = useState(0);
  let [attemptWord, setAttemptWord] = useState("");
  var wordArray = wordList.split("\n");
  var firstLine = wordArray[wordNum].toLowerCase();
  var answer = firstLine.split(";")[0];
  var prompt = firstLine.split(";")[1];
  var translated = firstLine.split(";")[3];
  var fullSentence = firstLine.split(";")[2];
  var nextCard = () => {
    setWordNum(wordNum + 1);
  };

  var handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (attemptWord.toLowerCase() == answer) {
      alert("NICE");
    } else {
      alert("WRONG");
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
          <input
            type="text"
            placeholder={answer}
            onChange={(e) => setAttemptWord(e.target.value)}
          />
        </Form>
        <Button onClick={nextCard} />
        <Card.Text>adj</Card.Text>
      </Card.Body>
    </Card>
  );
}
