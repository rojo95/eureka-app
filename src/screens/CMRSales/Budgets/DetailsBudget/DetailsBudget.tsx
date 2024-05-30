import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import AppHeader from "../../../../components/AppHeader/AppHeader";
import { useTranslation } from "react-i18next";

const NUM_ITEMS = 10;
function getColor(i: number) {
    const multiplier = 255 / (NUM_ITEMS - 1);
    const colorVal = i * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

type Item = {
    key: string;
    code: string;
    label: string;
    height: number;
    width: number;
    backgroundColor: string;
    image?: string;
};

const initialData: Item[] = [...Array(NUM_ITEMS)].map((d, index) => {
    const backgroundColor = getColor(index);
    return {
        key: `${index + 1}`,
        code: `${index + 1}`,
        label: " FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
        height: 100,
        width: 60 + Math.random() * 40,
        backgroundColor,
    };
});

export default function DetailsBudget({ navigation }: { navigation: any }) {
    const { t } = useTranslation();
    const [data, setData] = useState(initialData);

    function handleListUpdate(listItems: Item[]) {
        const settedList: Item[] = listItems.map((v, k) => {
            return { ...v, code: `${k + 1}` };
        });
        setData(settedList);
    }

    const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
        return (
            <ScaleDecorator>
                <Pressable
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.rowItem,
                        {
                            backgroundColor: isActive
                                ? "red"
                                : item.backgroundColor,
                        },
                    ]}
                >
                    <Text style={[styles.text, styles.code]}>{item.key}</Text>
                    <Text style={[styles.text, styles.description]}>
                        {item.label}
                    </Text>
                </Pressable>
            </ScaleDecorator>
        );
    };

    return (
        <View>
            <AppHeader
                title={t("menu-title-budgets")}
                actions={[{ icon: "dots-vertical" }]}
            />
            <DraggableFlatList
                data={data}
                onDragEnd={({ data }) => {
                    handleListUpdate(data);
                }}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    rowItem: {
        flex: 1,
        height: 100,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingHorizontal: 15,
    },
    text: {
        color: "white",
    },
    description: {
        fontSize: 14,
        fontWeight: "bold",
    },
    code: {
        fontSize: 13,
    },
});
