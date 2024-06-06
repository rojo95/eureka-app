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
import { getActivitiesApi } from "../../services/activities/activities";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";

interface ItemInterface {
    id: number;
    name: string;
    activityType?: { id: number; name: string };
}

export default function SelectActivitiesForm({
    title,
    onClose,
    selectedValues = [],
    setSelectedValues,
}: {
    title: string;
    onClose: () => void;
    selectedValues?: ItemInterface[];
    setSelectedValues: (values: ItemInterface[]) => void;
}) {
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();

    const [listItems, setListItems] = useState<any[]>([]);
    const [selected, setSelected] = useState<ItemInterface[]>(selectedValues);

    /**
     * function to get the availables activities
     */
    async function getActivities() {
        let data = await getActivitiesApi();
        data = data.map((v) => ({
            id: v.id,
            name: `${v.name.toUpperCase()} (${v.activityType.name.substring(
                0,
                3
            )}.)`,
        }));
        setListItems(data);
    }

    useEffect(() => {
        getActivities();
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
                    <Text>{item.name}</Text>
                </TouchableOpacity>
            </GestureHandlerRootView>
        );
    };

    function finishSelection() {
        setSelectedValues(selected);
        onClose();
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
                        <Text
                            style={[
                                styles.formTytle,
                                { color: theme.colors.dark },
                            ]}
                        >
                            {title}
                        </Text>
                        <View>
                            <Button
                                type="link"
                                onPress={onClose}
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
                    <View>
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
                    <View style={{ maxHeight: "80%" }}>
                        <View>
                            <FlatList
                                data={listItems}
                                renderItem={FilterListItems}
                            />
                        </View>
                    </View>
                    <Button
                        onPress={finishSelection}
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

const styles = StyleSheet.create({
    formStyle: {
        padding: 20,
    },
    formTytle: {
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
});
