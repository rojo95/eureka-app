// import { Button, TouchableOpacity, StyleSheet, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";

// export default function Budgets({ navigation }) {
//     const [budgets, setBudgets] = useState([]);

//     function getBudgets() {
//         setBudgets([
//             {
//                 index: "2024-001.4",
//                 description:
//                     "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//                 imageUrl:
//                     "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//                 status: "Completado",
//                 venta: 7100.0,
//             },
//             {
//                 index: "2024-001.4",
//                 description:
//                     "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//                 imageUrl:
//                     "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//                 status: "Completado",
//                 venta: 7100.0,
//             },
//             {
//                 index: "2024-001.4",
//                 description:
//                     "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//                 imageUrl:
//                     "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//                 status: "Completado",
//                 venta: 7100.0,
//             },
//             {
//                 index: "2024-001.4",
//                 description:
//                     "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//                 imageUrl:
//                     "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//                 status: "Completado",
//                 venta: 7100.0,
//             },
//             {
//                 index: "2024-001.4",
//                 description:
//                     "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//                 imageUrl:
//                     "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//                 status: "Completado",
//                 venta: 7100.0,
//             },
//         ]);
//     }

//     useEffect(() => {
//         getBudgets();
//     }, []);
//     return (
//         <View>
//             {budgets.map((v, k) => (
//                 <TouchableOpacity>
//                     <Text>Ejecutese</Text>
//                 </TouchableOpacity>
//             ))}
//             <Text>
//                 <Button
//                     onPress={() => navigation.navigate("createBudget")}
//                     title="Crear Presupuesto"
//                 ></Button>
//             </Text>
//         </View>
//     );
// }

// const styles = StyleSheet.create({});

import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";

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

export default function DrawerFlatList() {
    const [data, setData] = useState(initialData);

    function handleListUpdate(listItems: Item[]) {
        const settedList: Item[] = listItems.map((v, k) => {
            return { ...v, code: `${k + 1}` };
        });
        console.log(settedList);

        setData(settedList);
    }

    const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
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
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => {
                handleListUpdate(data);
            }}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
        />
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
