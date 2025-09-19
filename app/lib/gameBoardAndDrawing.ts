import { BoardStructureInterface } from "./types";

export const boardStructure: BoardStructureInterface = {
  // vertical left outside
  0: {
    type: "SPAWN",
    position: { x: 100, y: 100 },
    connected: [1, 5, 21],
  },
  1: {
    type: "DOT",
    position: { x: 100, y: 225 },
    connected: [0, 2],
  },
  2: {
    type: "DOT",
    position: { x: 100, y: 350 },
    connected: [1, 3],
  },
  3: {
    type: "DOT",
    position: { x: 100, y: 475 },
    connected: [2, 4],
  },
  4: {
    type: "SPAWN",
    position: { x: 100, y: 600 },
    connected: [3, 15, 23],
  },

  //horizontal top outside
  5: {
    type: "DOT",
    position: { x: 200, y: 100 },
    connected: [6, 0],
  },
  6: {
    type: "DOT",
    position: { x: 300, y: 100 },
    connected: [5, 7, 24],
  },
  7: {
    type: "FLAG",
    position: { x: 400, y: 100 },
    connected: [6, 8],
  },
  8: {
    type: "DOT",
    position: { x: 500, y: 100 },
    connected: [7, 9],
  },
  9: {
    type: "DOT",
    position: { x: 600, y: 100 },
    connected: [8, 10],
  },
  10: {
    type: "SPAWN",
    position: { x: 700, y: 100 },
    connected: [9, 11, 25],
  },

  // vertical right outside
  11: {
    type: "DOT",
    position: { x: 700, y: 225 },
    connected: [10, 12],
  },
  12: {
    type: "DOT",
    position: { x: 700, y: 350 },
    connected: [11, 13],
  },
  13: {
    type: "DOT",
    position: { x: 700, y: 475 },
    connected: [12, 14],
  },
  14: {
    type: "SPAWN",
    position: { x: 700, y: 600 },
    connected: [13, 19, 27],
  },

  // horizontal bottom outside
  15: {
    type: "DOT",
    position: { x: 200, y: 600 },
    connected: [4, 16],
  },
  16: {
    type: "DOT",
    position: { x: 300, y: 600 },
    connected: [15, 17],
  },
  17: {
    type: "FLAG",
    position: { x: 400, y: 600 },
    connected: [16, 18],
  },
  18: {
    type: "DOT",
    position: { x: 500, y: 600 },
    connected: [17, 19, 28],
  },
  19: {
    type: "DOT",
    position: { x: 600, y: 600 },
    connected: [18, 14],
  },

  // vertical left inside
  21: {
    type: "DOT",
    position: { x: 225, y: 225 },
    connected: [22, 0, 24],
  },
  22: {
    type: "DOT",
    position: { x: 225, y: 350 },
    connected: [21, 23],
  },
  23: {
    type: "DOT",
    position: { x: 225, y: 475 },
    connected: [22, 28, 4],
  },

  // horizontal top inside
  24: {
    type: "DOT",
    position: { x: 400, y: 225 },
    connected: [6, 21, 25],
  },

  // vertical right inside
  25: {
    type: "DOT",
    position: { x: 600, y: 225 },
    connected: [24, 26, 10],
  },
  26: {
    type: "DOT",
    position: { x: 600, y: 350 },
    connected: [25, 27],
  },
  27: {
    type: "DOT",
    position: { x: 600, y: 475 },
    connected: [26, 28, 14],
  },

  // horizontal bottom inside
  28: {
    type: "DOT",
    position: { x: 400, y: 475 },
    connected: [27, 18, 23],
  },
};

export const drawPoint = (
  ctx: CanvasRenderingContext2D,
  type: "DOT" | "FLAG" | "SPAWN",
  x: number,
  y: number,
  key: number
) => {
  // draw triangle for flag
  if (type === "FLAG") {
    const points = [];
    const radius = 10;
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
      const tx = x + radius * Math.cos(angle);
      const ty = y + radius * Math.sin(angle);
      points.push([tx, ty]);
    }
    ctx.fillStyle = "white";
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    ctx.lineTo(points[1][0], points[1][1]);
    ctx.lineTo(points[2][0], points[2][1]);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // draw circle with dot if spawn
    if (type === "SPAWN") {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.stroke();
    }
    // draw only dot
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "lime"; // text color
  ctx.font = "12px Arial";
  ctx.textAlign = "left"; // align text to start from x
  ctx.textBaseline = "middle"; // vertical alignment with the dot

  // Draw the board key slightly to the right of the circle
  ctx.fillText(key.toString(), x + 15, y);
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};

const recFindPossiblePlace = (boardKey: number, level: number,filledSlots:number[]) => {
  if (level === 0) {
    return [];
  }
  const connected: any = {};

  boardStructure[boardKey].connected.map((k) => {
    if(filledSlots.includes(k)){
        return;
    }
    connected[k] = true;
    const newConnected = recFindPossiblePlace(k, level - 1,filledSlots);
    Object.keys(newConnected)
      .filter((l) => newConnected[l])
      .map((l) => {
        connected[l] = true;
      });
  });

  return connected;
};

export const findPossiblePlace = (boardKey: number,filledSlots:number[]) => {
  return recFindPossiblePlace(boardKey, 3,filledSlots);
};
