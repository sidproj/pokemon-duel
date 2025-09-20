import { Move } from "@/app/lib/types";
import { Select, Table } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import MoveInputModal from "./MoveInputModal";

interface Props {
  moves: Move[];
  setMoves: Dispatch<SetStateAction<Move[]>>;
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Base wheel size",
    dataIndex: "base_wheel_size",
    key: "base_wheel_size",
  },
  {
    title: "Move type",
    dataIndex: "move_type",
    key: "move_type",
  },
  {
    title: "Additional notes",
    dataIndex: "additional_notes",
    key: "additional_notes",
  },
  {
    title: "Damage",
    dataIndex: "damage",
    key: "damage",
  },
];

const MoveInput = (props: Props) => {
  const { moves, setMoves } = props;

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleAddMove = (move: Move) => {
    setMoves((old) => [...old, move]);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {
        <MoveInputModal
          handleAdd={handleAddMove}
          onClose={() => setShowModal(false)}
          visible={showModal}
        />
      }
      <div onClick={() => setShowModal(true)} className="bg-[#1a5486] text-white cursor-pointer rounded-lg w-fit px-2">Add move</div>
      <Table
        dataSource={moves.map((move, index) => ({ ...move, key: index }))}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default MoveInput;
