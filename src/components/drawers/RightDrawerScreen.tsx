import { createContext, useMemo, useState } from "react";
import { Drawer } from "react-native-drawer-layout";
import LeftDrawerScreen from "./LeftDrawerScreen";

interface RightDrawerContextType {
    // Example properties
    isOpen: boolean;
    toggleOpenRight: () => void;
}

export const RightDrawerContext = createContext<
    RightDrawerContextType | undefined
>(undefined);
export default function RightDrawerScreen() {
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);

    const value = useMemo(
        () => ({
            isOpen: rightDrawerOpen,
            toggleOpenRight: () => setRightDrawerOpen(!rightDrawerOpen),
        }),
        [rightDrawerOpen]
    );

    return (
        <Drawer
            open={rightDrawerOpen}
            onOpen={() => setRightDrawerOpen(true)}
            onClose={() => setRightDrawerOpen(false)}
            drawerPosition="right"
            renderDrawerContent={() => <>{/* Right drawer content */}</>}
        >
            <RightDrawerContext.Provider value={value}>
                <LeftDrawerScreen />
            </RightDrawerContext.Provider>
        </Drawer>
    );
}
