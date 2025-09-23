"use client";
import { Queue } from "@/app/lib/ds";
import {
  animateHighlights,
  boardStructure,
  bsf,
  checkKnockoutBySurround,
  drawLine,
  drawPoint,
  findPossiblePlace,
} from "@/app/lib/gameBoardAndDrawing";
import { Pieces, Player } from "@/app/lib/types";
import { backgrounds, fetcher } from "@/app/lib/utility";
import Image from "next/image";
import React, {
  useRef,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import useSWR from "swr";

interface Props {
  setSelectedPokemon: Dispatch<SetStateAction<Pieces | null>>;
}

const Board = (props: Props) => {
  const { setSelectedPokemon } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const { data: pokemonPieces, isLoading: loading } = useSWR(
    "/api/pokemons",
    fetcher
  );

  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moveAbleSlots, setMoveableSlots] = useState<number[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    {
      player_name: "sid",
      pokemons: [],
    },
    {
      player_name: "test",
      pokemons: [],
    },
  ]);

  const [playerTurn, setPlayerTurn] = useState(0);

  const [bg, setBg] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        draw(ctx);
      }
    }
    const index = Math.floor(Math.random() * backgrounds.length);
    setBg(backgrounds[index].src);
  }, []);

  useEffect(() => {
    if (!pokemonPieces?.length) return;
    // bench ids on board;
    const benchIds = [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];

    const formatedPokemons: Pieces[] = pokemonPieces.map(
      (p: any, index: number) => {
        return {
          onBoard: true,
          boardKey: benchIds[index],
          image: p.image,
          id: p._id,
          steps: p.steps,
          moves: p.moves,
        };
      }
    );

    setPlayers((oldPlayers) => {
      const newPlayers = [...oldPlayers];

      newPlayers[0] = {
        ...newPlayers[0],
        pokemons: [...formatedPokemons.slice(0, 6)],
      };

      newPlayers[1] = {
        ...newPlayers[1],
        pokemons: [...formatedPokemons.slice(6)],
      };

      return newPlayers;
    });

    console.log("updates");
  }, [pokemonPieces]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawLoop = (time: number) => {
      // Clear previous frame highlights
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      draw(ctx); // redraw your board
      if (selectedPiece != null) {
        animateHighlights(ctx, moveAbleSlots, time);
        animationRef.current = requestAnimationFrame(drawLoop);
      }
    };

    if (selectedPiece != null) {
      animationRef.current = requestAnimationFrame(drawLoop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      draw(ctx); // redraw board clean without highlights
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [selectedPiece]);

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
  };

  const handlePieceSelection = (playerIndex: number, pokemonIndex: number) => {
    // setSelectedPokemon(players[playerIndex].pokemons[pokemonIndex]);
    if (playerIndex != playerTurn) return;

    const filledSlots = [
      ...players[0].pokemons.map((p) => p.boardKey),
      ...players[1].pokemons.map((p) => p.boardKey),
    ];
    const slots = findPossiblePlace(
      players[playerTurn].pokemons[pokemonIndex].boardKey,
      filledSlots,
      players[playerTurn].pokemons[pokemonIndex].steps
    );
    const keys = Object.keys(slots).map((k) => parseInt(k));
    setMoveableSlots(keys);
    setSelectedPiece(pokemonIndex);
  };

  const animatePieceMove = async (pokemonIndex: number, path: number[]) => {
    const animationDelay = 300;
    setMoveableSlots([]);

    for (let i = 0; i < path.length; i++) {
      // wait before updating state
      await new Promise((resolve) => setTimeout(resolve, animationDelay));

      setPlayers((old) => {
        const newPlayers = [...old];
        newPlayers[playerTurn].pokemons[pokemonIndex].boardKey = path[i];
        newPlayers[playerTurn] = {
          ...newPlayers[playerTurn],
          pokemons: [...newPlayers[playerTurn].pokemons],
        };

        return newPlayers;
      });
      if (i + 1 == path.length) {
        setPlayerTurn((old) => (old === 0 ? 1 : 0));
      }
    }
  };

  const movePiece = async (boardKey: number) => {
    const filledSlots = [
      ...players[0].pokemons.map((p) => p.boardKey),
      ...players[1].pokemons.map((p) => p.boardKey),
    ];

    if (selectedPiece == null || !moveAbleSlots.includes(boardKey)) {
      setSelectedPiece(null);
      setSelectedPokemon(null);
      setMoveableSlots([]);
      return;
    }
    const shortestPath = bsf(
      players[playerTurn].pokemons[selectedPiece].boardKey,
      boardKey,
      filledSlots
    );

    await animatePieceMove(selectedPiece, shortestPath);

    const tempPlayers: Player[] = JSON.parse(JSON.stringify(players));
    tempPlayers[playerTurn].pokemons[selectedPiece].boardKey = boardKey;
    const knockedOut = checkKnockoutBySurround(boardKey, tempPlayers);

    console.log(knockedOut);
    for (let i = 0; i < knockedOut.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      players[0].pokemons = players[0].pokemons.filter(p=>!knockedOut.includes(p.boardKey))
      players[1].pokemons = players[1].pokemons.filter(p=>!knockedOut.includes(p.boardKey))
      setPlayers(players);
    }

    setSelectedPiece(null);
    setSelectedPokemon(null);
  };

  return (
    <div className="flex flex-col gap-2 relative w-[800px] h-[825px] scale-[0.9]">
      <canvas
        ref={canvasRef}
        width="800"
        height="825"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="bg-[gray]"
        onClick={() => {
          setSelectedPiece(null);
          setSelectedPokemon(null);
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
      {players.map((player, playerIndex) =>
        player.pokemons.map((p, pIdx) => {
          return (
            <div
              className="w-[100px] h-[100px] absolute duration-400 ease-in-out"
              key={p.id + "0"}
              style={{
                top: boardStructure[p.boardKey].position.y - 75,
                left: boardStructure[p.boardKey].position.x - 50,
              }}
              onClick={() => {
                handlePieceSelection(playerIndex, pIdx);
              }}
            >
              <Image
                src={p.image}
                width={100}
                height={100}
                alt={"pokemon image"}
              />
              <div
                className={`rounded-full ${
                  playerIndex === 1 ? "bg-[#1d67c2]" : "bg-[#c2431d]"
                } absolute bottom-[10px] right-[10px] text-center w-[20px] h-[20px] text-white text-[12px]`}
              >
                {p.steps}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Board;
