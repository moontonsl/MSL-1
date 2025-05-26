import React from "react";
import { Button } from "../../../components";

export default function WinNavigation() {
  return (
    <div className="voting-navigation flex flex-wrap justify-center gap-3 my-4">
      <Button className="vote-button bg-yellow text-black px-4 py-2 rounded-md font-bold hover:bg-opacity-80 transition">VOTE</Button>
      <Button className="winners-button border border-yellow text-yellow px-4 py-2 rounded-md font-bold hover:bg-yellow hover:bg-opacity-10 transition">VIEW WINNERS</Button>
    </div>
  );
} 