import { useContext } from "react";
import { Button, View } from "react-native";
import { RightDrawerContext } from "../../components/drawers/RightDrawerScreen";

export default function HomeScreen({ navigation }: { navigation: any }) {
    const { openRightDrawer } = useContext(RightDrawerContext);

    return (
        <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <Button
                onPress={() => navigation.openDrawer()}
                title="Open left drawer"
            />
            <Button
                onPress={() => openRightDrawer()}
                title="Open right drawer"
            />
        </View>
    );
}
