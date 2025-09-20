"use client";
import { PokemonTableInterface } from "@/app/lib/types";
import { debounce } from "@/app/lib/utility";
import { Input, Table, TableProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

interface Props {
  pokemons: PokemonTableInterface[];
}

const columns: TableProps<PokemonTableInterface>["columns"] = [
  {
    title: <div className="w-fit">Image</div>,
    dataIndex: "image",
    key: "image",
    width: 180,
    render: (image: string, record: PokemonTableInterface) => (
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

  const [searchText, setSearchText] = useState("");

  // Debounced setter to reduce re-renders
  const handleSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value.toLowerCase());
      }, 700),
    []
  );

  const filteredData = useMemo(() => {
    if (!searchText) return pokemons;
    return pokemons.filter((p) => p.name.toLowerCase().includes(searchText));
  }, [pokemons, searchText]);

  return (
    <div className="flex flex-col gap-4">
      <Input.Search
        placeholder="Search Pokémon by name"
        allowClear
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 300 }}
      />

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredData}
        bordered
        pagination={{
          position: ["topRight", "bottomRight"],
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default PokemonTable;
