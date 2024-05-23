import { Platform, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { Text } from "../Text/Text";

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

export default function Map({ OS, location }: { OS: string; location: any }) {
    const [region, setRegion] = useState<regionInterface>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [marker, setMarker] = useState<MarkerInterface | null>(null);

    function onRegionChange(region: regionInterface) {
        console.log(region);
        setRegion(region);
    }

    function addMarker(marker: MarkerInterface) {
        console.log(marker);
        setMarker(marker);
    }

    useEffect(() => {
        if (location) {
            const newState = {
                ...region,
                latitude: location?.latitude || 0,
                longitude: location?.longitude || 0,
            };
            onRegionChange(newState);
        }
        return onRegionChange({
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
    }, [location]);

    // Condición para determinar si el componente debe mostrarse como mapa o texto

    return (
        <View>
            <MapView
                style={styles.map}
                initialRegion={region}
                onRegionChange={onRegionChange}
                onPress={(e) => addMarker(e.nativeEvent.coordinate)}
                onCalloutPress={() => console.log("objetivo")}
                mapType={"standard"}
            >
                {marker && (
                    <Marker
                        coordinate={marker}
                        title={"Ubicación"}
                        description={
                            "Ubicacion donde sera realizada la tarea del presupuesto"
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
        height: "100%",
    },
});
