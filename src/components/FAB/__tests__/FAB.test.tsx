import React from "react";
import renderer from "react-test-renderer";
import FAB from "../FAB";

describe("Test to evaluate <FAB /> component", () => {
    it("detect to render 2 child", () => {
        const tree: any = renderer.create(<FAB />).toJSON();
        expect(tree.children.length).toBe(2);
    });
});
