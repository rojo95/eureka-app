import React, { useContext, useEffect, useState } from "react";
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
import { getBudgets } from "../../../services/budgets/Budgets";
import AppbarHeader from "../../../components/AppHeader/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { RightDrawerContext } from "../../../components/drawers/RightDrawerScreen";
import Text from "../../../components/Text/Text";
import Button from "../../../components/Button/Button";
import Select from "../../../components/Select/Select";
import { DatePickerInput } from "react-native-paper-dates";
import { FontAwesome } from "@expo/vector-icons";
import ChangeLanguageModal from "../../../components/ChangeLanguageModal/ChangeLanguageModal";

export default function Budgets() {
    const navigation: any = useNavigation();
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();
    const { OS } = Platform;
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModalLang, setShowModalLang] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [filterForm, setFilterForm] = useState<{
        client: { id: number; name: string } | null;
        startDate: any;
        endDate: any;
    }>({
        client: null,
        startDate: "",
        endDate: "",
    });

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
        drawerContainer: {
            flex: 1,
            marginVertical: 40,
            marginHorizontal: 10,
            justifyContent: "space-between",
        },
        input: {
            marginVertical: 5,
        },
        inputDate: { marginVertical: 32 },
    });

    // start get context right drawer
    const contextValue = useContext(RightDrawerContext);

    // Check if the context has been successfully retrieved
    if (!contextValue) {
        console.error("RightDrawerContext is not available");
        return null;
    }

    // Now TypeScript knows that contextValue is of type RightDrawerContextType
    const { toggleOpenRight, setRightDrawerContent } = contextValue;

    // create the content to be rendered in the drawer
    const rightDrawerContent = (
        <View style={styles.drawerContainer}>
            <View>
                <Button
                    buttonStyle={styles.input}
                    type="secondary"
                    text={t("placeholder-select-client")}
                />
                <Button
                    buttonStyle={styles.input}
                    type="secondary"
                    text={t("placeholder-select-state")}
                />
                <Button
                    buttonStyle={styles.input}
                    type="secondary"
                    text={t("placeholder-select-responsible")}
                />
                <Button
                    buttonStyle={styles.input}
                    type="secondary"
                    text={t("placeholder-select-activity")}
                />
                <View style={styles.inputDate}>
                    <DatePickerInput
                        style={[{ backgroundColor: "#fff" }]}
                        mode="outlined"
                        locale="en"
                        label={t("date-from")}
                        value={filterForm.startDate}
                        onChange={(d) =>
                            setFilterForm((preData) => ({
                                ...preData,
                                startDate: d,
                            }))
                        }
                        inputMode="start"
                    />
                </View>
                <View style={styles.inputDate}>
                    <DatePickerInput
                        style={[{ backgroundColor: "#fff" }]}
                        mode="outlined"
                        locale="en"
                        label={t("date-to")}
                        value={filterForm.endDate}
                        onChange={(d) =>
                            setFilterForm((preData) => ({
                                ...preData,
                                endDate: d,
                            }))
                        }
                        inputMode="start"
                    />
                </View>
            </View>
            <View>
                <View style={styles.input}>
                    <Button
                        icon={
                            <FontAwesome
                                name="trash-o"
                                size={24}
                                color="white"
                            />
                        }
                        text={t("clean-filters")}
                        onPress={() => {
                            toggleOpenRight();
                        }}
                    />
                </View>
                {OS === "web" && (
                    <View style={styles.input}>
                        <Button
                            icon={
                                <FontAwesome
                                    name="cog"
                                    size={24}
                                    color="white"
                                />
                            }
                            text={t("manage-columns")}
                            onPress={() => {}}
                        />
                    </View>
                )}
            </View>
        </View>
    );
    // set the drawer Content
    setRightDrawerContent(rightDrawerContent);
    // end of the right drawer context configuration

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

    // Define the handlePress function to handle the onPress event
    const handlePress = (item: any) => {
        navigation.navigate(`budget`, { itemId: item });
    };

    /**
     * Render an item in the list
     *
     * @param param0
     * @returns
     */
    const renderItem: ListRenderItem<any> = ({ item }) => (
        <BudgetsCard
            onPress={() => handlePress(item.id)}
            index={item.code}
            description={item.description}
            status={item.status}
            costo={item.costo}
            venta={item.venta}
        />
    );

    return (
        <View style={styles.container}>
            <AppbarHeader
                title={t("menu-title-budgets")}
                actions={[
                    {
                        icon: "earth",
                        onPress: () => setShowModalLang(!showModalLang),
                    },
                    { icon: "filter", onPress: toggleOpenRight },
                ]}
            />
            <ChangeLanguageModal
                showModal={showModalLang}
                toggleModal={() => setShowModalLang(!showModalLang)}
            />
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
