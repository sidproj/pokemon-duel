import React from "react";
import { PieChart, Pie, Cell, Tooltip, PieLabelRenderProps } from "recharts";

// Define the Move type
export interface Move {
  attack_name: string;
  attack_wheel_size: number;
  attack_type: "RED" | "WHITE" | "PURPLE" | "BLUE";
  attack_value: number;
}

// Props for the chart component
interface MovesPieChartProps {
  moves: Move[];
}

// Map attack type to colors
const ATTACK_COLORS: Record<string, string> = {
  RED: "#FF4C4C",
  WHITE: "#FFFFFF",
  PURPLE: "#8C4CFF",
  BLUE: "#4C9FFF",
};

const MovesPieChart: React.FC<MovesPieChartProps> = ({ moves }) => {
  if (!moves) return <></>;

  const pieData = moves.map((move) => ({
    name: move.attack_name,
    value: move.attack_wheel_size,
    type: move.attack_type,
    attack_value: move.attack_value,
  }));

  console.log(pieData);

  return (
    <PieChart width={400} height={400}>
      <Pie
        animationDuration={100}
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        stroke="#000"
        strokeWidth={2}
        label={({
          cx,
          cy,
          midAngle,
          innerRadius,
          outerRadius,
          index,
        }: PieLabelRenderProps) => {
          const RADIAN = Math.PI / 180;
          const radius =
            (innerRadius as number) +
            ((outerRadius as number) - (innerRadius as number)) * 0.5;
          const x =
            (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN);
          const y =
            (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN);

          return (
            <text
              x={x}
              y={y}
              fill={"#000"}
              textAnchor="middle"
              dominantBaseline="central"
              fontWeight="bold"
            >
              <tspan x={x} dy={-6} fontSize={14}>
                {pieData[index].attack_value}
              </tspan>
              <tspan x={x} dy={16} fontSize={12}>
                {pieData[index].name}
              </tspan>
            </text>
          );
        }}
      >
        {pieData.map((entry, index) => (
          <Cell
            key={index}
            fill={ATTACK_COLORS[entry.type.toUpperCase()]}
            stroke="#000"
            strokeWidth={1}
          />
        ))}
      </Pie>
      <Tooltip
        formatter={(value: number, name: string, props: any) => [
          `${value}`,
          `${props.payload.name}`,
          `${props.payload.attack_ability}`
        ]}
      />
    </PieChart>
  );
};

export default MovesPieChart;
