import { Alert, Platform, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";

interface regionInterface {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

interface MarkerInterface {
    latitude: number;
    longitude: number;
}

export default function Map({ description }: { description?: string }) {
    const { t } = useTranslation();
    const [region, setRegion] = useState<regionInterface>({
        latitude: 38.20486801970583,
        latitudeDelta: 17.679489473469285,
        longitude: -2.9028533957898617,
        longitudeDelta: 12.98109669238329,
    });
    const [marker, setMarker] = useState<MarkerInterface | null>(null);

    function onRegionChange(region: regionInterface) {
        setRegion(region);
    }

    function addMarker(marker: MarkerInterface) {
        setMarker(marker);
    }

    /**
     * function to get the current user location
     * @returns
     */
    async function getLocation() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(t("location-denied"));
            return;
        }

        const location = (await Location.getCurrentPositionAsync({})).coords;

        const newState = {
            ...region,
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0,
        };
        onRegionChange(newState);
    }

    useEffect(() => {
        getLocation;
    }, []);

    return (
        <View>
            <MapView
                style={styles.map}
                initialRegion={region}
                onRegionChange={onRegionChange}
                onPress={(e) => addMarker(e.nativeEvent.coordinate)}
                mapType={"standard"}
            >
                {marker && (
                    <Marker
                        coordinate={marker}
                        title={t("label-ubication")}
                        description={
                            description
                        }
                        draggable={true}
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: 300,
    },
});
