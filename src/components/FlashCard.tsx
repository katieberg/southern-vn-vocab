import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import { FlashCardContext } from "../FlashCardContext";

export function FlashCard() {
  const wordList = useContext(FlashCardContext);

  let [wordNum, setWordNum] = useState(0);
  var firstLine = wordList.split("\n")[wordNum];
  var answer = firstLine.split(";")[0];
  var prompt = firstLine.split(";")[1];
  var translated = firstLine.split(";")[3];
  var fullSentence = firstLine.split(";")[2];
  var nextCard = () => {
    setWordNum(wordNum + 1);
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
        <Form.Control type="text" placeholder={answer} />
        <h1 onClick={nextCard}>{fullSentence}</h1>
        <Card.Text>adj</Card.Text>
      </Card.Body>
    </Card>
  );
}
