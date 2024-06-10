import { StyleSheet, View } from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleProps } from "react-native-reanimated";

export default function PhoneMap({
    description,
    address,
    markerPreset,
    readOnly,
    mapStyle,
}: {
    description?: string;
    address?: Region;
    markerPreset?: LatLng;
    readOnly: boolean;
    mapStyle?: StyleProps;
}) {
    const { t } = useTranslation();
    const [region, setRegion] = useState<Region>(
        address || {
            latitude: 38.20486801970583,
            latitudeDelta: 17.679489473469285,
            longitude: -2.9028533957898617,
            longitudeDelta: 12.98109669238329,
        }
    );
    const [marker, setMarker] = useState<LatLng | null | undefined>(
        markerPreset
    );

    function getRegion(region: Region) {
        return region;
    }

    function addMarker(marker: LatLng) {
        !readOnly && setMarker(marker);
    }

    useEffect(() => {
        setMarker(markerPreset);
        setRegion(address!);
    }, [markerPreset, address]);

    return (
        <View>
            <MapView
                style={[styles.map, mapStyle]}
                initialRegion={region}
                region={region}
                onRegionChange={getRegion}
                onPress={(e) => addMarker(e.nativeEvent.coordinate)}
                mapType={"standard"}
            >
                {marker && (
                    <Marker
                        coordinate={marker}
                        title={t("label-ubication")}
                        description={description}
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
