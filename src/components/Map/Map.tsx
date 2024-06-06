import { Platform, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { StyleProps } from "react-native-reanimated";

interface regionInterface {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

function Map({
    markerPreset,
    address,
    readOnly = false,
    mapStyle,
}: {
    markerPreset?: { latitude: number; longitude: number } | null;
    address?: regionInterface | null;
    readOnly?: boolean;
    mapStyle?: StyleProps;
}) {
    const [Component, setComponent] = useState<any>(null);

    useEffect(() => {
        async function loadComponent() {
            if (Platform.OS === "web") {
                // Load web component
                const WebMapComponent = {
                    default: () => <Text>Website Map</Text>,
                };
                setComponent(() => WebMapComponent.default);
            } else {
                // Load phone component
                const PhoneMapComponent = await import("./PhoneMap");
                setComponent(() => PhoneMapComponent.default);
            }
        }

        loadComponent();
    }, [markerPreset, address]);

    if (!Component) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <Component
            markerPreset={markerPreset}
            readOnly={readOnly}
            address={address}
            mapStyle={mapStyle}
        />
    );
}

export default Map;
