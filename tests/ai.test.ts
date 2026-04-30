import { describe, expect, it } from "vitest";
import { chooseAIMove } from "@/game";
import { emptyPoints, put, stateWithPoints } from "./helpers";

describe("AI move selection", () => {
  it("can choose a bear-off move without producing an invalid score", () => {
    const points = put(emptyPoints(), 0, "white", 15);
    const state = stateWithPoints(points, "white", [1]);

    expect(chooseAIMove(state, "white")).toEqual({
      player: "white",
      type: "bear_off",
      from: 0,
      to: "off",
      step: 1,
      hitsOpponent: false,
    });
  });
});
