import {
    FlatList,
    ListRenderItem,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Checkbox,
    DefaultTheme,
    useTheme,
} from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Fontisto } from "@expo/vector-icons";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import { getStatesApi } from "../../services/states/states";
import { getResponsiblesApi } from "../../services/users/users";

interface ItemInterface {
    id: number;
    name: string;
    lastName?: string;
}

export default function SelectResponsiblesModal({
    setShowModal,
    selectedValues = [],
    setSelectedValues,
}: {
    setShowModal: () => void;
    selectedValues?: ItemInterface[];
    setSelectedValues: (values: ItemInterface[]) => void;
}) {
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();

    const styles = StyleSheet.create({
        formStyle: {
            padding: 20,
        },
        formTytle: {
            color: theme.colors.dark,
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "space-between",
        },
        listButton: {
            paddingVertical: 15,
            borderBottomWidth: 1,
        },
        titleContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 5,
        },
        topButtonsContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
        },
    });

    const [listItems, setListItems] = useState<any[]>([]);
    const [selected, setSelected] = useState<ItemInterface[]>(selectedValues);

    /**
     * function to get the availables activities
     */
    async function getResponsibles() {
        let data = await getResponsiblesApi();
        data = data.map((v: ItemInterface) => ({
            id: v.id,
            name: v.name.toUpperCase(),
            lastName: v.lastName?.toUpperCase(),
        }));
        setListItems(data);
    }

    useEffect(() => {
        getResponsibles();

        return () => {};
    }, []);

    /**
     * Function to select multiple activities
     * @param {ItemInterface} item
     */
    function handleSelectedActivity(item: ItemInterface) {
        setSelected((prevSelected) => {
            const objectIndex = prevSelected.findIndex((v) => v.id === item.id);
            if (objectIndex === -1) {
                return [...prevSelected, item];
            } else {
                return prevSelected.filter((v) => v.id !== item.id);
            }
        });
    }

    /**
     * Component to render the list
     * @param {ListRenderItem} param0
     * @returns
     */
    const FilterListItems: ListRenderItem<any> = ({ item }) => {
        return (
            <GestureHandlerRootView>
                <TouchableOpacity
                    style={{
                        paddingVertical: 15,
                        borderBottomWidth: 1,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    onPress={() =>
                        handleSelectedActivity({ id: item.id, name: item.name })
                    }
                >
                    <Checkbox
                        status={
                            selected.find((v) => v.id === item.id)
                                ? "checked"
                                : "unchecked"
                        }
                    />
                    <Text>{`${item.name} ${item.lastName}`}</Text>
                </TouchableOpacity>
            </GestureHandlerRootView>
        );
    };

    function finishSelection() {
        setSelectedValues(selected);
        setShowModal();
    }

    function checkUncheckAll() {
        if (selected.length >= listItems.length) {
            setSelected([]);
        } else {
            setSelected(listItems);
        }
    }

    return (
        <View style={styles.formStyle}>
            {listItems?.length > 0 ? (
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.formTytle}>
                            {t("placeholder-select-responsible-multiple")}
                        </Text>
                        <View>
                            <Button
                                type="link"
                                onPress={setShowModal}
                                icon={
                                    <Fontisto
                                        name="close"
                                        size={24}
                                        color={theme.colors.dark}
                                    />
                                }
                            />
                        </View>
                    </View>
                    <View style={styles.topButtonsContainer}>
                        <Button
                            type="secondary"
                            text={
                                selected.length >= listItems.length
                                    ? t("uncheck-all")
                                    : t("check-all")
                            }
                            onPress={checkUncheckAll}
                        />
                    </View>
                    <View style={{ maxHeight: "75%" }}>
                        <View>
                            <FlatList
                                data={listItems}
                                renderItem={FilterListItems}
                            />
                        </View>
                    </View>
                    <Button
                        onPress={() => finishSelection()}
                        text={t("finish-selection")}
                    ></Button>
                </View>
            ) : (
                <View>
                    <ActivityIndicator animating={true} size={"large"} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({});
