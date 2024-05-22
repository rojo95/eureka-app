import React from "react";
import renderer from "react-test-renderer";

import Button from "../Button";
import { Fontisto } from "@expo/vector-icons";

describe("<Button />", () => {
    it("has 1 child", () => {
        const tree: any = renderer.create(<Button />).toJSON();
        expect(tree.children.length).toBe(1);
    });

    it("renders correctly with text", () => {
        const tree = renderer.create(<Button text="Test" />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders correctly with icon", () => {
        const tree = renderer
            .create(
                <Button icon={() => <Fontisto name="world-o" size={24} />} />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders correctly", () => {
        const tree = renderer.create(<Button />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
