import React from "react";
import renderer from "react-test-renderer";
import FAB from "../FAB";

describe("Test to evaluate <FAB /> component", () => {
    it("should render correctly", () => {
        const tree: any = renderer.create(<FAB />).toJSON();
        expect(tree.children.length).toBe(2);
    });

    // it("should render 5 elements", () => {
    //     const elements /* : Item[] */ = [...Array(5)].map((d, index) => {
    //         return {
    //             icon: "plus",
    //             label: `test ${index + 1}`,
    //             onPress: () => "test 1",
    //             color: "#fff",
    //             style: {
    //                 backgroundColor: "yellow",
    //                 borderRadius: 20,
    //             },
    //         };
    //     });
    //     const tree: any = renderer.create(<FAB />).toJSON();
    // });

});
