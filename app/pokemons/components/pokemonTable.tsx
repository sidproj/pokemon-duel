"use client";
import { PokemonTableInterface } from "@/app/lib/types";
import { Table, TableProps } from "antd";
import Image from "next/image";
import Link from "next/link";

interface Props {
  pokemons: PokemonTableInterface[];
}

const columns: TableProps<PokemonTableInterface>["columns"] = [
  {
    title: <div className="w-fit">Image</div>,
    dataIndex: "image",
    key: "image",
    width: 180,
    render: (image: string,record:PokemonTableInterface) => (
      <Link href={`/pokemons/${record._id}`}>
        <Image
          src={image}
          width={150}
          height={150}
          className="w-[150px] h-[150px]"
          alt={"pokemon image"}
        />
      </Link>
    ),
  },
  {
    title: <div>Name</div>,
    dataIndex: "name",
    key: "name",
    width: 200,
    render: (name) => <div>{name}</div>,
  },

  {
    title: <div>Rarity</div>,
    dataIndex: "rarity",
    key: "rarity",
    render: (rarity) => <div className="w-full">{rarity}</div>,
  },
];

const PokemonTable = (props: Props) => {
  const { pokemons } = props;

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={pokemons}
      bordered
      pagination={{
        position: ["topRight", "bottomRight"],
        pageSize: 10,
      }}
    />
  );
};

export default PokemonTable;
