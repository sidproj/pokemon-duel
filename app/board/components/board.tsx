"use client";
import { Queue } from "@/app/lib/ds";
import {
  boardStructure,
  drawLine,
  drawPoint,
  findPossiblePlace,
} from "@/app/lib/gameBoardAndDrawing";
import { Pieces } from "@/app/lib/types";
import { fetcher } from "@/app/lib/utility";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import useSWR from "swr";

const Board = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { data: pokemonPieces, isLoading: loading } = useSWR(
    "/api/pokemons",
    fetcher
  );

  const [pieces, setPieces] = useState<Pieces>({});
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);
  const [moveAbleSlots, setMoveableSlots] = useState<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        draw(ctx);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        draw(ctx);
      }
    }
  }, [selectedPiece]);

  useEffect(() => {
    if (Array.isArray(pokemonPieces)) {
      const pieces: Pieces = {};
      pokemonPieces?.forEach((p: any, index: number) => {
        pieces[p._id] = {
          onBoard: true,
          boardKey: index + 29,
          image: p.image,
        };
      });
      setPieces(pieces);
    }
  }, [pokemonPieces]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const visitedDots: { [key: number]: boolean } = {};
    const keys = Object.keys(boardStructure);
    const queue = new Queue();

    for (let i = 0; i < keys.length; i++) {
      if (visitedDots[parseInt(keys[i])] !== true) {
        queue.enqueue(keys[i]);
      }

      while (!queue.isEmpty()) {
        const curr: number = queue.peek();
        if (visitedDots[curr] !== true) {
          visitedDots[curr] = true;
          // draw the dots
          const x = boardStructure[curr].position.x;
          const y = boardStructure[curr].position.y;
          const type = boardStructure[curr].type;

          drawPoint(ctx, type, x, y, curr);

          if (type === "BENCH") {
            continue;
          }

          // push connections into queue;
          const connected = boardStructure[curr].connected;
          connected.forEach((c) => {
            queue.enqueue(c);
            const x2 = boardStructure[c].position.x;
            const y2 = boardStructure[c].position.y;

            drawLine(ctx, x, y, x2, y2);
          });
        }
        queue.dequeue();
      }
    }
    if (selectedPiece) {
      moveAbleSlots.forEach((key) => {
        const dot = boardStructure[key];
        ctx.beginPath();
        ctx.arc(dot.position.x, dot.position.y, 18, 0, 2 * Math.PI);
        ctx.strokeStyle = "limegreen";
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();
        ctx.strokeStyle = "white";
      });
    }
  };

  const handlePieceSelection = (pieceKey: string) => {
    const filledSlots = Object.keys(pieces).map((k) => pieces[k].boardKey);
    const slots = findPossiblePlace(pieces[pieceKey].boardKey, filledSlots);
    const keys = Object.keys(slots).map((k) => parseInt(k));
    console.log(slots);
    setMoveableSlots(keys);
    setSelectedPiece(pieceKey);
  };

  const animatePieceMove = (pieceId: string, path: number[]) => {
    const animationDelay = 100;

    path.forEach((slotKey: number, index: number) => {
      setTimeout(() => {
        setPieces((prev) => ({
          ...prev,
          [pieceId]: {
            ...prev[pieceId],
            boardKey: slotKey,
          },
        }));
      }, animationDelay * (index + 1));
    });
  };

  const movePiece = (boardKey: number) => {
    if (!selectedPiece || !moveAbleSlots.includes(boardKey)) {
      setSelectedPiece(null);
      setMoveableSlots([]);
      return;
    }
    const path = [boardKey];
    animatePieceMove(selectedPiece,path)
    setMoveableSlots([]);
    setSelectedPiece(null);
  };

  return (
    <div className="flex flex-col gap-2 relative w-[800px] h-[825px] scale-[0.9]">
      <canvas
        ref={canvasRef}
        width="800"
        height="825"
        className="bg-[gray]"
        onClick={() => {
          setSelectedPiece(null);
          setMoveableSlots([]);
        }}
      />
      {Object.keys(boardStructure).map((k: string) => {
        return (
          <div
            key={k}
            style={{
              top: boardStructure[parseInt(k)].position.y - 20,
              left: boardStructure[parseInt(k)].position.x - 20,
            }}
            className="w-[40px] h-[40px] absolute rounded-full"
            onClick={() => movePiece(parseInt(k))}
          ></div>
        );
      })}
      {Object.keys(pieces).map((k) => {
        return (
          <Image
            key={k}
            src={pieces[k].image}
            width={100}
            height={100}
            onClick={() => {
              handlePieceSelection(k);
            }}
            alt={"pokemon image"}
            style={{
              top: boardStructure[pieces[k].boardKey].position.y - 75,
              left: boardStructure[pieces[k].boardKey].position.x - 50,
            }}
            className="absolute duration-400"
          />
        );
      })}
    </div>
  );
};

export default Board;
