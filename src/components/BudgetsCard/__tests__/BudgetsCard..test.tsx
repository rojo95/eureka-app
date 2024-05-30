import React from "react";
import renderer from "react-test-renderer";
import BudgetsCard from "../BudgetsCard";

describe("Test to evaluate the <BudgetsCard/> component", () => {
    it("should render correctly", () => {
        const tree: any = renderer.create(<BudgetsCard />).toJSON();
        expect(tree.children.length).toBe(1);
    });

    it("should rendeer correctly the cost value", () => {
        const testCosto = 500;

        const tree: any = renderer
            .create(<BudgetsCard costo={testCosto} />)
            .toJSON();

        const componentBase =
            tree?.children[0]?.children[0]?.children[0]?.children[3]
                ?.children[0].children;
        expect(componentBase).toEqual([`${testCosto}`, "€"]);
    });

    it("should rendeer correctly the sell value", () => {
        const testVenta = 600;

        const tree: any = renderer
            .create(<BudgetsCard venta={testVenta} />)
            .toJSON();

        const componentBase =
            tree?.children[0]?.children[0]?.children[0]?.children[3]
                ?.children[3].children;
        expect(componentBase).toEqual([`${testVenta}`, "€"]);
    });

    it("should rendeer correctly the status text", () => {
        const testStatusText = "En progreso";

        const tree: any = renderer
            .create(
                <BudgetsCard
                    status={{ id: 1, name: testStatusText }}
                />
            )
            .toJSON();

        const componentBase =
            tree?.children[0]?.children[0]?.children[0]?.children[2]
                ?.children[0]?.children[0];
        expect(componentBase).toContain(testStatusText);
    });

    it("should rendeer correctly the index code", () => {
        const idTest = "1234";

        const tree: any = renderer
            .create(<BudgetsCard index={idTest} />)
            .toJSON();

        const componentBase =
            tree?.children[0]?.children[0]?.children[0]?.children[0]
                ?.children[0]?.children[0];
        expect(componentBase).toContain(idTest);
    });

    it("should rendeer correctly the description", () => {
        const testDesc = "Descripcion de prueba";

        const tree: any = renderer
            .create(<BudgetsCard description={testDesc} />)
            .toJSON();

        const componentBase =
            tree?.children[0]?.children[0]?.children[0]?.children[1]?.children;
        expect(componentBase).toContain(testDesc);
    });

    it("render card without change", () => {
        const tree = renderer.create(<BudgetsCard />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
