import background0 from "../../public/assets/images/board_background_0.jpg";
import background1 from "../../public/assets/images/board_background_1.jpg";
import background2 from "../../public/assets/images/board_background_3.jpg";
import background3 from "../../public/assets/images/board_background_4.jpg";
import background4 from "../../public/assets/images/board_background_5.jpg";
import background5 from "../../public/assets/images/board_background_6.jpg";

export const backgrounds = [
  background0,
  background1,
  background2,
  background3,
  background4,
  background5,
];


export const fetcher = (url: string) => fetch(url).then((res) => res.json());
