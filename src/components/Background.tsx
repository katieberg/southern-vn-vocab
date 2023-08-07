import { Header } from "./Header";
import { FlashCard2 } from "./FlashCard2";
import { dataProps } from "myTypes";

export function Background(data: dataProps) {
  return (
    <div>
      <FlashCard2 {...data} />
    </div>
  );
}
