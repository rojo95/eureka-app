import { createContext, useMemo, useState } from "react";
import { Drawer } from "react-native-drawer-layout";
import LeftDrawerScreen from "./LeftDrawerScreen";

export const RightDrawerContext = createContext();
export default function RightDrawerScreen() {
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const value = useMemo(
        () => ({
            openRightDrawer: () => setRightDrawerOpen(true),
            closeRightDrawer: () => setRightDrawerOpen(false),
        }),
        []
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
