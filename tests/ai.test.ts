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

  it("hits an exposed opposing horse when the hit is legal", () => {
    let points = emptyPoints();
    points = put(points, 10, "black", 2);
    points = put(points, 13, "white", 1);
    points = put(points, 4, "black", 1);
    const state = stateWithPoints(points, "black", [3]);

    expect(chooseAIMove(state, "black", "expert")).toEqual({
      player: "black",
      type: "normal",
      from: 10,
      to: 13,
      step: 3,
      hitsOpponent: true,
    });
  });

  it("prefers making a protected point over moving a loose singleton", () => {
    let points = emptyPoints();
    points = put(points, 10, "black", 1);
    points = put(points, 12, "black", 1);
    points = put(points, 5, "black", 1);
    const state = stateWithPoints(points, "black", [2]);

    expect(chooseAIMove(state, "black", "expert")).toEqual({
      player: "black",
      type: "normal",
      from: 10,
      to: 12,
      step: 2,
      hitsOpponent: false,
    });
  });

  it("avoids breaking a made point when a comparable loose move is available", () => {
    let points = emptyPoints();
    points = put(points, 10, "black", 2);
    points = put(points, 5, "black", 1);
    const state = stateWithPoints(points, "black", [1]);

    expect(chooseAIMove(state, "black", "defensive")).toEqual({
      player: "black",
      type: "normal",
      from: 5,
      to: 6,
      step: 1,
      hitsOpponent: false,
    });
  });

  it("expert accepts a risky hit to keep pressure when behind in the race", () => {
    let points = emptyPoints();
    points = put(points, 10, "black", 2);
    points = put(points, 13, "white", 1);
    points = put(points, 16, "white", 1);
    points = put(points, 4, "black", 1);
    const state = stateWithPoints(points, "black", [3]);

    expect(chooseAIMove(state, "black", "expert")).toEqual({
      player: "black",
      type: "normal",
      from: 10,
      to: 13,
      step: 3,
      hitsOpponent: true,
    });
  });

  it("expert closes a re-entry point when the opponent has horses on the bar", () => {
    let points = emptyPoints();
    points = put(points, 12, "black", 1);
    points = put(points, 18, "black", 1);
    points = put(points, 0, "black", 1);
    const state = stateWithPoints(points, "black", [6]);
    state.bar.white = 1;

    expect(chooseAIMove(state, "black", "expert")).toEqual({
      player: "black",
      type: "normal",
      from: 12,
      to: 18,
      step: 6,
      hitsOpponent: false,
    });
  });

  it("uses deterministic tie-breaking instead of random scoring", () => {
    let points = emptyPoints();
    points = put(points, 3, "white", 1);
    points = put(points, 5, "white", 1);
    const state = stateWithPoints(points, "white", [1]);

    const first = chooseAIMove(state, "white", "balanced");
    for (let index = 0; index < 10; index += 1) {
      expect(chooseAIMove(state, "white", "balanced")).toEqual(first);
    }
  });
});
