import React, { useEffect, useState } from "react";
import {
    FlatList,
    ListRenderItem,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import { ActivityIndicator, DefaultTheme, useTheme } from "react-native-paper";
import { TextInput } from "react-native-paper";
import BudgetsCard from "../../../components/BudgetsCard/BudgetsCard";
import { useTranslation } from "react-i18next";
import FAB from "../../../components/FAB/FAB";
import Modal from "../../../components/Modal/Modal";
import CreateBudget from "./CreateBudget/CreateBudget";
import axios from "axios";
import { getBudgets } from "../../../services/budgets/Budgets";

export default function Budgets({ navigation }: { navigation: any }) {
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();
    const { OS } = Platform;
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

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

    /**
     * Function to fetch data
     * @returns
     */
    async function searchBudgets(page?: number) {
        if (loading) return;
        setLoading(true);
        try {
            const budgets = await getBudgets({
                page: page || currentPage,
                limit: limit,
                textFilter: text,
            });
            let newData: any[] = [];
            const fields: any[] = await budgets.map((d: any, i: any) => {
                return {
                    id: d.id,
                    code: d.number,
                    description: d.title,
                    status: { id: d.state.id, name: d.state.name },
                    costo: d.totalCost,
                    venta: d.totalSale,
                };
            });
            if (budgets[0]?.id) {
                if (page === 1) {
                    newData = fields;
                } else {
                    for (let field of fields) {
                        if (field.id) {
                            if (!data.find((v) => v.id === field.id)) {
                                newData.push(field);
                            }
                        }
                    }
                }
            } else {
                newData = fields;
            }
            setData((prevData) => [...prevData, ...newData]);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
        setLoading(false);
    }

    /**
     * Fetch data when the component mounts or the page changes
     */
    useEffect(() => {
        searchBudgets(1);
    }, []);

    /**
     * Handle loading more data when the end of the list is reached
     */
    const handleLoadMore = () => {
        if (!loading && data.length >= 1) {
            setCurrentPage(currentPage + 1);
            searchBudgets();
        }
    };

    /**
     * Handle refreshing the list
     */
    const handleRefresh = () => {
        setData([]);
        setLoading(true);
        setCurrentPage(1);
        searchBudgets(1);
        setLoading(false);
    };

    /**
     * Render the loading indicator at the bottom of the list
     *
     * @returns
     */
    const renderFooter = () => {
        return loading ? (
            <View>
                <ActivityIndicator size="large" />
            </View>
        ) : null;
    };

    // Define the handlePress function to handle the onPress event
    const handlePress = (item: any) => {
        navigation.navigate(`budget`, { itemId: "123" });
    };

    /**
     * Render an item in the list
     *
     * @param param0
     * @returns
     */
    const renderItem: ListRenderItem<any> = ({ item }) => (
        <BudgetsCard
            onPress={() => handlePress(item)}
            index={item.code}
            description={item.description}
            status={item.status}
            costo={item.costo}
            venta={item.venta}
        />
    );

    return (
        <View style={styles.container}>
            <View style={styles.containerSearch}>
                <TextInput
                    mode="outlined"
                    label={t("budgets-input-search-label")}
                    placeholder={t("budget-input-search-placeholder")}
                    value={text}
                    onChangeText={setText}
                    right={
                        <TextInput.Icon
                            icon="magnify"
                            onPress={handleRefresh}
                            color={theme.colors.primary}
                        />
                    }
                />
            </View>

            <View style={{ marginVertical: 10, flex: 1 }}>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    refreshing={loading}
                    onRefresh={handleRefresh}
                />
            </View>

            <Modal
                visible={showModal}
                setShowModal={setShowModal}
                style={{
                    ...(OS === "web" && {
                        alignItems: "center",
                    }),
                }}
            >
                <CreateBudget setShowModal={() => setShowModal(!showModal)} />
            </Modal>
            <View style={{ flex: 1, marginTop: "-150%" }}>
                <FAB
                    actions={[
                        {
                            icon: "plus",
                            label: t("menu-title-create-budget"),
                            onPress: () => setShowModal(!showModal),
                            color: theme.colors.primary,
                            style: {
                                backgroundColor: theme.colors.primaryContrast,
                                borderRadius: 20,
                            },
                        },
                        {
                            icon: "file-export",
                            label: t("export"),
                            onPress: () => console.log("Pressed star"),
                            color: theme.colors.primary,
                            style: {
                                backgroundColor: theme.colors.primaryContrast,
                                borderRadius: 20,
                            },
                        },
                    ]}
                ></FAB>
            </View>
        </View>
    );
}
