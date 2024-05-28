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
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);

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
    async function searchBudgets() {
        if (loading) return;
        setLoading(true);
        const budgets = await getBudgets({ page: currentPage, limit: 1 });
        const newData = budgets.map((d: any, i: any) => {
            return {
                id: d.id,
                code: d.number,
                description: d.title,
                status: d.state.name,
                costo: d.totalCost,
                venta: d.totalSale,
            };
        });
        setData((prevData) => [...prevData, ...newData]);
        setLoading(false);
    }

    /**
     * Fetch data when the component mounts or the page changes
     */
    useEffect(() => {
        searchBudgets();
    }, [currentPage]);

    /**
     * Handle loading more data when the end of the list is reached
     */
    const handleLoadMore = () => {
        if (!loading) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    /**
     * Handle refreshing the list
     */
    const handleRefresh = () => {
        setIsRefreshing(true);
        setCurrentPage(1);
        setData([]);
        searchBudgets();
        setIsRefreshing(false);
    };

    // Render the loading indicator at the bottom of the list
    const renderFooter = () => {
        return loading ? (
            <View /* style={styles.loader} */>
                <ActivityIndicator size="large" />
            </View>
        ) : null;
    };

    /**
     * Render an item in the list
     *
     * @param param0
     * @returns
     */
    const renderItem: ListRenderItem<any> = ({ item }) => (
        <BudgetsCard
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
                    disabled={loading}
                    right={
                        <TextInput.Icon
                            disabled={loading}
                            icon="magnify"
                            onPress={() => handleRefresh()}
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
                    refreshing={isRefreshing}
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
