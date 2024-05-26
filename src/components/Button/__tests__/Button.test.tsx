import React from "react";
import renderer from "react-test-renderer";

import Button from "../Button";
import { Fontisto } from "@expo/vector-icons";
import { Button as ButtonRNP } from "react-native-paper";

describe("Test to evaluate <Button /> component", () => {
    it("has 1 child", () => {
        const tree: any = renderer.create(<Button />).toJSON();
        expect(tree.children.length).toBe(1);
    });

    it("renders correctly with text", () => {
        const testText = "test";
        const tree: any = renderer.create(<Button text={testText} />).toJSON();
        const textElement =
            tree.children[0]?.children[0]?.children[0]?.children[1]
                ?.children[0];
        expect(textElement.children).toContain(testText);
    });

    it("renders correctly with icon", () => {
        const textInsideButtonIcon = "Press Me";
        const tree: any = renderer
            .create(
                <Button
                    icon={
                        <ButtonRNP icon="camera">
                            {textInsideButtonIcon}
                        </ButtonRNP>
                    }
                />
            )
            .toJSON();

        const icon =
            tree?.children[0]?.children[0]?.children[0]?.children[0]
                ?.children[0]?.children[0]?.children[0]?.children[0]?.children;

        expect(icon[0].props.testID).toBe("button-icon-container");
        expect(icon[1]?.children[0]).toBe(textInsideButtonIcon);
    });

    it("render button without change", () => {
        const tree = renderer.create(<Button />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
