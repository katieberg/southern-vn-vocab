import { Card } from "./Card";
import { dataProps } from "myTypes";
import { Header } from "./Header";

export function Background(data: dataProps) {
  return (
    <div>
      <Header></Header>
      <Card {...data} />
    </div>
  );
}
