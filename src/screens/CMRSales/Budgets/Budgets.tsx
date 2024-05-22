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
    ScaleDecorator,
} from "react-native-draggable-flatlist";

const NUM_ITEMS = 10;
function getColor(i) {
    const multiplier = 255 / (NUM_ITEMS - 1);
    const colorVal = i * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const initialData = [...Array(NUM_ITEMS)].map((d, index) => {
    const backgroundColor = getColor(index);
    return {
        key: `item-${index}`,
        label: "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
        height: 200,
        width: 60 + Math.random() * 40,
        backgroundColor,
    };
});

// const initialData = [
//     {
//         index: "2024-001.4",
//         description: "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//         imageUrl:
//             "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//         status: "Completado",
//         venta: 7100.0,
//     },
//     {
//         index: "2024-001.4",
//         description: "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//         imageUrl:
//             "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//         status: "Completado",
//         venta: 7100.0,
//     },
//     {
//         index: "2024-001.4",
//         description: "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//         imageUrl:
//             "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//         status: "Completado",
//         venta: 7100.0,
//     },
//     {
//         index: "2024-001.4",
//         description: "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//         imageUrl:
//             "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//         status: "Completado",
//         venta: 7100.0,
//     },
//     {
//         index: "2024-001.4",
//         description: "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]",
//         imageUrl:
//             "https://imgv3.fotor.com/images/share/fotor-ai-generate-a-lifelike-dragon.jpg",
//         status: "Completado",
//         venta: 7100.0,
//     },
// ];

export default function App() {
    const [data, setData] = useState(initialData);

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.rowItem,
                        {
                            // flex: 1,
                            backgroundColor: isActive
                                ? "red"
                                : item.backgroundColor,
                        },
                    ]}
                >
                    <Text style={styles.text}>{item.label}</Text>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return (
        <DraggableFlatList
            data={data}
            onDragEnd={({ data }) => setData(data)}
            keyExtractor={(item) => item.key}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    rowItem: {
        flex: 1,
        // height: 100,
        // width: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
    },
});
