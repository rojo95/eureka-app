import { useContext } from "react";
import { Button, View } from "react-native";
import { RightDrawerContext } from "../../components/drawers/RightDrawerScreen";

export default function HomeScreen({ navigation }: { navigation: any }) {
    const contextValue = useContext(RightDrawerContext);

    // Check if the context has been successfully retrieved
    if (!contextValue) {
        console.error("RightDrawerContext is not available");
        return null; // Or return a loading indicator, etc.
    }

    // Now TypeScript knows that contextValue is of type RightDrawerContextType
    const { toggleOpenRight } = contextValue;

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Button
                onPress={() => navigation.openDrawer()}
                title="Open left drawer"
            />
            <Button onPress={() => toggleOpenRight()} title="Open right drawer" />
        </View>
    );
}
