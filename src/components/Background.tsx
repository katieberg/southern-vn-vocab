import { FlashCard } from "./FlashCard2";
import { dataProps } from "myTypes";

export function Background(data: dataProps) {
  return (
    <div>
      <FlashCard {...data} />
    </div>
  );
}
