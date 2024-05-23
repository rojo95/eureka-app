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
import { ScrollView, StyleSheet, View } from "react-native";
import { DefaultTheme, Text, useTheme } from "react-native-paper";
import { TextInput } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import BudgetsCard from "../../../components/BudgetsCard/BudgetsCard";
import Paginator from "../../../components/Paginator/Paginator";
import { useTranslation } from "react-i18next";
import { Button } from "react-native-paper";
import FAB from "../../../components/FAB/FAB";

export default function Budgets({ navigation }: { navigation: any }) {
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        containerSearch: {
            marginHorizontal: 10,
        },
        card: {
            minHeight: 100,
            backgroundColor: theme.colors.backgroundCard,
            padding: 20,
            elevation: 5,
            marginEnd: 10,
            justifyContent: "center",
            borderTopEndRadius: 10,
            borderBottomEndRadius: 10,
        },
        cardsContainer: { marginVertical: 20 },
    });

    function searchBudgets() {
        if (loading) return;
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }

    const totalPages = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Fetch or update the data to be displayed based on the new page
        console.log("Current Page:", page);
    };

    function handleLimitPerPage() {}

    return (
        <View style={styles.container}>
            <View style={styles.containerSearch}>
                <TextInput
                    mode="outlined"
                    label={t("budgets-input-search-label")}
                    placeholder={t("budget-input-search-placeholder")}
                    value={text}
                    onChangeText={setText}
                    disabled={loading}
                    right={
                        <TextInput.Icon
                            disabled={loading}
                            icon="magnify"
                            onPress={() => searchBudgets()}
                            color={theme.colors.primary}
                        />
                    }
                />
            </View>

            <ScrollView style={{ marginVertical: 10 }}>
                <BudgetsCard
                    index={"2024-001.4"}
                    description={
                        "FOTOVOLTAICA AUTOCONSUMO [DEMO] [REVISION 300424]"
                    }
                    status={"Contratado"}
                    costo={"4.400,00"}
                    venta={"7.100,00"}
                />
            </ScrollView>
            <FAB
                actions={[
                    {
                        icon: "plus",
                        onPress: () => navigation.navigate("createBudget"),
                    },
                    {
                        icon: "star",
                        label: "Star",
                        onPress: () => console.log("Pressed star"),
                    },
                    {
                        icon: "email",
                        label: "Email",
                        onPress: () => console.log("Pressed email"),
                    },
                    {
                        icon: "bell",
                        label: "Remind",
                        onPress: () => console.log("Pressed notifications"),
                    },
                ]}
            ></FAB>
            <Paginator
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitPerPage}
            />
        </View>
    );
}
