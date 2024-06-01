import React, { useContext, useEffect, useState } from "react";
import {
    FlatList,
    ListRenderItem,
    Platform,
    StyleSheet,
    View,
} from "react-native";
import { DefaultTheme, useTheme } from "react-native-paper";
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
import Button from "../../../components/Button/Button";
import { DatePickerInput } from "react-native-paper-dates";
import { FontAwesome } from "@expo/vector-icons";
import Tag from "../../../components/Tag/Tag";
import { ScrollView } from "react-native-gesture-handler";
import SelectActivitiesForm from "../../../components/SelectActivitiesForm/SelectActivitiesForm";
import SelectStatesModal from "../../../components/SelectStatesModal/SelectStatesModal";
import SelectResponsiblesModal from "../../../components/SelectResponsiblesModal/SelectResponsiblesModal";
import SelectClientsModal from "../../../components/SelectClientsModal/SelectClientsModal";

interface filtersInterface {
    id: number;
    name: string;
    lastName?: string;
}

export default function Budgets() {
    const navigation: any = useNavigation();
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();
    const { OS } = Platform;
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalBudgets, setTotalBudgets] = useState<number | null>(null);
    const [limit, setLimit] = useState<number>(10);
    const [clients, setClients] = useState<filtersInterface[]>([]);
    const [states, setStates] = useState<filtersInterface[]>([]);
    const [responsibles, setResponsibles] = useState<filtersInterface[]>([]);
    const [activity, setActivity] = useState<filtersInterface[]>([]);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [timer, setTimer] = useState<any>(null);
    const [typeModal, setTypeModal] = useState<number>(1);

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
                    text={
                        clients.length > 0
                            ? `${clients.length} ${t("client-label")}(s) ${t(
                                  "selected-plural"
                              )}`
                            : t("placeholder-select-client")
                    }
                    onPress={getClients}
                />
                <Button
                    buttonStyle={styles.input}
                    type="secondary"
                    text={
                        states.length > 0
                            ? `${states.length} ${t("state-label")}(s) ${t(
                                  "selected-plural"
                              )}`
                            : t("placeholder-select-state")
                    }
                    onPress={getStates}
                />
                <Button
                    buttonStyle={styles.input}
                    type="secondary"
                    text={
                        responsibles.length > 0
                            ? `${responsibles.length} ${t(
                                  "responsible-label"
                              )}(s) ${t("selected-plural")}`
                            : t("placeholder-select-responsible")
                    }
                    onPress={getResponsibles}
                />
                <Button
                    buttonStyle={styles.input}
                    type="secondary"
                    text={
                        activity.length > 0
                            ? `${activity.length} ${t(
                                  "activity-label"
                              )}(ies) ${t("selected-plural")}`
                            : t("placeholder-select-activity")
                    }
                    onPress={getActivities}
                />
                <View style={styles.inputDate}>
                    <DatePickerInput
                        style={[{ backgroundColor: "#fff" }]}
                        mode="outlined"
                        locale="en"
                        label={t("date-from")}
                        value={startDate}
                        onChange={(d) => setStartDate(d)}
                        inputMode="start"
                    />
                </View>
                <View style={styles.inputDate}>
                    <DatePickerInput
                        style={[{ backgroundColor: "#fff" }]}
                        mode="outlined"
                        locale="en"
                        label={t("date-to")}
                        value={endDate}
                        onChange={(d) => setEndDate(d)}
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
                            cleanFilters();
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
     * function to give format to date fields
     * @param param0
     */
    function setDateFormat(value: any): string {
        const text = new Date(value);
        const day = text.getDate().toString().padStart(2, "0");
        const month = (text.getMonth() + 1).toString().padStart(2, "0");
        const year = text.getFullYear();
        const finalDate = `${day}-${month}-${year}`;
        return finalDate;
    }

    /**
     * Function to reset all the search parameters
     */
    function cleanFilters() {
        setActivity([]);
        setEndDate(undefined);
        setStartDate(undefined);
        setText("");
        setClients([]);
        setStates([]);
        setResponsibles([]);
    }

    /**
     * Function to fetch data
     * @returns
     */
    async function searchBudgets(page?: number) {
        if (loading) return;

        setLoading(true);
        try {
            const filters = {
                page: page || currentPage,
                limit: limit,
                textFilter: text,
                activities: activity.map((v) => v.id),
                createdTo: endDate,
                createdFrom: startDate,
                states: states.map((v) => v.id),
                responsibles: responsibles.map((v) => v.id),
            };
            const { budgets, total } = await getBudgets(filters);
            setTotalBudgets(total);
            let newData: any[] = [];
            const fields: any[] = await budgets?.map((d: any, i: any) => {
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
                            if (!data?.find((v) => v.id === field.id)) {
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
     * Function to change view to the budget detail
     * @param {number} item
     */
    const handlePress = (item: number) => {
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

    /**
     * Function to get data with filters 1.5 seconds
     * after the last change in them
     * @param {() => void} param.functionality
     */
    useEffect(() => {
        if (timer) {
            clearTimeout(timer);
        }

        setTimer(
            setTimeout(() => {
                handleRefresh();
            }, 1500)
        );
    }, [endDate, startDate, text, clients, activity, states, responsibles]);

    /**
     * function to get the availables activities
     */
    function getActivities() {
        setShowModal(true);
        setTypeModal(2);
    }

    /**
     * function to get the availables states
     */
    function getStates() {
        setShowModal(true);
        setTypeModal(3);
    }

    /**
     * function to get the availables responsibles
     */
    function getResponsibles() {
        setShowModal(true);
        setTypeModal(4);
    }

    /**
     * function to get the availables clients
     */
    function getClients() {
        setShowModal(true);
        setTypeModal(5);
    }

    /**
     * functio to change the renderized component in the modal
     * @param param
     * @returns
     */
    function rendererListType(param: number) {
        switch (param) {
            case 1:
                return (
                    <CreateBudget
                        setShowModal={() => setShowModal(!showModal)}
                    />
                );

            case 2:
                return (
                    <View>
                        <SelectActivitiesForm
                            selectedValues={activity}
                            setSelectedValues={setActivity}
                            setShowModal={() => setShowModal(!showModal)}
                            title={t("placeholder-select-activity-multiple")}
                        />
                    </View>
                );

            case 3:
                return (
                    <SelectStatesModal
                        selectedValues={states}
                        setSelectedValues={setStates}
                        setShowModal={() => setShowModal(!showModal)}
                    />
                );
            case 4:
                return (
                    <SelectResponsiblesModal
                        selectedValues={responsibles}
                        setSelectedValues={setResponsibles}
                        setShowModal={() => setShowModal(!showModal)}
                    />
                );
            case 5:
                return (
                    <SelectClientsModal
                        selectedValues={clients}
                        setSelectedValues={setClients}
                        setShowModal={() => setShowModal(!showModal)}
                    />
                );

            default:
                return (
                    <CreateBudget
                        setShowModal={() => setShowModal(!showModal)}
                    />
                );
        }
    }

    /**
     * function to remove a selected activity
     * @param id
     */
    function removeActivity(id: number) {
        setActivity((prevSelected) => {
            return prevSelected.filter((v) => v.id !== id);
        });
    }

    /**
     * function to remove a selected state
     * @param id
     */
    function removeStates(id: number) {
        setStates((prevSelected) => {
            return prevSelected.filter((v) => v.id !== id);
        });
    }

    /**
     * function to remove a selected responsible
     * @param id
     */
    function removeResponsible(id: number) {
        setResponsibles((prevSelected) => {
            return prevSelected.filter((v) => v.id !== id);
        });
    }

    /**
     * function to remove a selected client
     * @param id
     */
    function removeClients(id: number) {
        setClients((prevSelected) => {
            return prevSelected.filter((v) => v.id !== id);
        });
    }

    return (
        <View style={styles.container}>
            <View>
                <AppbarHeader
                    title={t("menu-title-budgets")}
                    actions={[{ icon: "filter", onPress: toggleOpenRight }]}
                />
            </View>
            <View style={styles.containerSearch}>
                <TextInput
                    mode="outlined"
                    label={t("budgets-input-search-label")}
                    placeholder={t("budget-input-search-placeholder")}
                    value={text}
                    onChangeText={(tx) => setText(tx)}
                    right={
                        <TextInput.Icon
                            icon="magnify"
                            color={theme.colors.primary}
                        />
                    }
                />
            </View>
            <View>
                <ScrollView
                    horizontal={true}
                    style={{
                        margin: 10,
                    }}
                >
                    {clients &&
                        clients.map((v) => (
                            <Tag
                                key={v.id}
                                text={`${t("client-label").toLowerCase()}: ${
                                    v.name
                                }`}
                                icon={
                                    <FontAwesome
                                        name="close"
                                        size={15}
                                        color="white"
                                    />
                                }
                                onPress={() => removeClients(v.id)}
                            />
                        ))}
                    {states &&
                        states.map((v) => (
                            <Tag
                                key={v.id}
                                text={`${t("state-label").toLowerCase()}: ${
                                    v.name
                                }`}
                                icon={
                                    <FontAwesome
                                        name="close"
                                        size={15}
                                        color="white"
                                    />
                                }
                                onPress={() => removeStates(v.id)}
                            />
                        ))}
                    {responsibles &&
                        responsibles.map((v) => (
                            <Tag
                                key={v.id}
                                text={`${t(
                                    "responsible-label"
                                ).toLowerCase()}: ${v.name}${
                                    v.lastName ? " " + v.lastName : ""
                                }`}
                                icon={
                                    <FontAwesome
                                        name="close"
                                        size={15}
                                        color="white"
                                    />
                                }
                                onPress={() => removeResponsible(v.id)}
                            />
                        ))}
                    {activity &&
                        activity.map((v) => (
                            <Tag
                                key={v.id}
                                text={`${t("activity-label").toLowerCase()}: ${
                                    v.name
                                }`}
                                icon={
                                    <FontAwesome
                                        name="close"
                                        size={15}
                                        color="white"
                                    />
                                }
                                onPress={() => removeActivity(v.id)}
                            />
                        ))}
                    {startDate && (
                        <Tag
                            text={`${t(
                                "date-from"
                            ).toLowerCase()}: ${setDateFormat(startDate)}`}
                            icon={
                                <FontAwesome
                                    name="close"
                                    size={15}
                                    color="white"
                                />
                            }
                            onPress={() => setStartDate(undefined)}
                        />
                    )}
                    {endDate && (
                        <Tag
                            text={`${t(
                                "date-from"
                            ).toLowerCase()}: ${setDateFormat(endDate)}`}
                            icon={
                                <FontAwesome
                                    name="close"
                                    size={15}
                                    color="white"
                                />
                            }
                            onPress={() => setEndDate(undefined)}
                        />
                    )}
                </ScrollView>
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
                {rendererListType(typeModal)}
            </Modal>
            <View style={{ flex: 1, marginTop: "-150%" }}>
                <FAB
                    actions={[
                        {
                            icon: "plus",
                            label: t("menu-title-create-budget"),
                            onPress: () => {
                                setShowModal(!showModal);
                                setTypeModal(1);
                            },
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
