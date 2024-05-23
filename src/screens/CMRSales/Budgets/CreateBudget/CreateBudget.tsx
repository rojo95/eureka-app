import React, { Suspense, useEffect, useState } from "react";
import { Platform, PlatformOSType, StyleSheet, Text, View } from "react-native";
import { DefaultTheme, useTheme } from "react-native-paper";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";

// import Map from "../../../../components/Map/Map";

export default function CreateBudget({ navigation }: { navigation: any }) {
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();
    const OS: PlatformOSType = Platform.OS;

    const [location, setLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    /**
     * function to get the current user location
     * @returns
     */
    async function getLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
        }

        let location = (await Location.getCurrentPositionAsync({})).coords;
        setLocation(location);
    }

    useEffect(() => {
        getLocation();
    }, [navigation]);

    /**
     * Dynamic Component; if the environment is mobile load a React Native Map
     */
    const DynamicMap = React.lazy(() =>
        Platform.OS !== "web"
            ? import("../../../../components/Map/Map")
            : Promise.resolve({ default: () => <></> })
    );

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
    });

    return (
        <View style={styles.container}>
            <View>
                <Text>{JSON.stringify(location)}</Text>
                <Suspense fallback={<Text>{t("loading")}...</Text>}>
                    <DynamicMap OS={OS} location={location} />
                </Suspense>
            </View>
        </View>
    );
}
