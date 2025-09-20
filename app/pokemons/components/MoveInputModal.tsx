"use client";

import { Move } from "@/app/lib/types";
import { Modal, Input, InputNumber, Select, Button } from "antd";
import { useState, useEffect } from "react";

interface Props {
  visible: boolean;
  initialMove?: Move;
  onClose: () => void;
  handleAdd: (move: Move) => void
}

const MoveInputModal = ({
  visible,
  initialMove,
  onClose,
  handleAdd,
}: Props) => {
  const [name, setName] = useState("");
  const [baseWheelSize, setBaseWheelSize] = useState(0);
  const [moveType, setMoveType] = useState("RED");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [damage, setDamage] = useState(0);

  // Populate local state when editing an existing move
  useEffect(() => {
    if (initialMove) {
      setName(initialMove.name);
      setBaseWheelSize(initialMove.base_wheel_size);
      setMoveType(initialMove.move_type);
      setAdditionalNotes(initialMove.additional_notes);
      setDamage(initialMove.damage);
    } else {
      // Reset when adding a new move
      setName("");
      setBaseWheelSize(0);
      setMoveType("RED");
      setAdditionalNotes("");
      setDamage(0);
    }
  }, [initialMove, visible]);

  const handleSubmit = () => {
    const newMove: Move = {
      name,
      base_wheel_size: baseWheelSize,
      move_type: moveType as "RED" | "WHITE" | "WHITE Z-MOVE" | "PURPLE Z-MOVE",
      additional_notes: additionalNotes,
      damage,
    };

    handleAdd(newMove);
    onClose();
  };

  return (
    <Modal
      title={initialMove ? "Edit Move" : "Add Move"}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
      width={500}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <label className="w-[120px]">Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Move name"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-[120px]">Base wheel size</label>
          <InputNumber
            min={0}
            value={baseWheelSize}
            onChange={(value) => setBaseWheelSize(value || 0)}
            style={{ width: 300 }}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-[120px]">Move type</label>
          <Select
            value={moveType}
            onChange={(value) => setMoveType(value)}
            style={{ width: 300 }}
          >
            <Select.Option value="RED">Red</Select.Option>
            <Select.Option value="WHITE">White</Select.Option>
            <Select.Option value="WHITE Z-MOVE">White Z-move</Select.Option>
            <Select.Option value="PURPLE Z-MOVE">Purple Z-move</Select.Option>
          </Select>
        </div>

        <div className="flex items-start gap-2">
          <label className="w-[120px]">Additional notes</label>
          <Input.TextArea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={4}
            style={{ width: 300 }}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-[120px]">Damage</label>
          <InputNumber
            min={0}
            value={damage}
            onChange={(value) => setDamage(value || 0)}
            style={{ width: 300 }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MoveInputModal;
