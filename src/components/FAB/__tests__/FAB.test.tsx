import React from "react";
import renderer from "react-test-renderer";
import FAB from "../FAB";

describe("Test to evaluate <FAB /> component", () => {
  it("render component correctly", () => {
    const tree: any = renderer.create(<FAB />).toJSON();
    console.log(tree);

    expect(tree.children.length).toBe(1);
  });
});
