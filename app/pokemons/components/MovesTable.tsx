"use client";

import React from "react";
import { Table, TableProps } from "antd";

export interface Move {
  id:string;
  attack_wheel_size: number;
  attack_name: string;
  attack_type: "RED" | "WHITE" | "PURPLE" | "BLUE" | "GOLD";
  attack_value?: number;
  attack_ability?: string;
  attack_start_angle_deg: number;
  attack_end_angle_deg: number;
}

interface MovesTableProps {
  moves: Move[];
}

const MovesTable: React.FC<MovesTableProps> = ({ moves }) => {
  const columns: TableProps<Move>["columns"] = [
    {
      title: "Name",
      dataIndex: "attack_name",
      key: "attack_name",
    },
    {
      title: "Type",
      dataIndex: "attack_type",
      key: "attack_type",
    },
    {
      title: "Wheel Size",
      dataIndex: "attack_wheel_size",
      key: "attack_wheel_size",
    },
    {
      title: "Value",
      dataIndex: "attack_value",
      key: "attack_value",
      render: (value) => value ?? "-",
    },
    {
      title: "Ability",
      dataIndex: "attack_ability",
      key: "attack_ability",
      render: (value) => value ?? "-",
    },
    {
      title: "Start Angle (°)",
      dataIndex: "attack_start_angle_deg",
      key: "attack_start_angle_deg",
    },
    {
      title: "End Angle (°)",
      dataIndex: "attack_end_angle_deg",
      key: "attack_end_angle_deg",
    },
  ];

  return (
    <Table
      rowKey={(record) => {
        console.log(record.id)
        return record.id
      }}
      columns={columns}
      dataSource={moves}
      bordered
      pagination={{ pageSize: 10 }}
    />
  );
};

export default MovesTable;
