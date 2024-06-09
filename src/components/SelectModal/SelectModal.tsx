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
    Avatar,
    Checkbox,
    DefaultTheme,
    useTheme,
} from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Fontisto } from "@expo/vector-icons";
import Button from "../Button/Button";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";

interface ItemInterface {
    id: number;
    name: string;
    profileImage?: string;
}

type selectedValues = ItemInterface[] | ItemInterface;

export default function SelectModal({
    data,
    onClose,
    selectedValues = [],
    setSelectedValues,
    title,
    singleSelection,
}: {
    data: ItemInterface[];
    onClose: () => void;
    selectedValues?: selectedValues;
    setSelectedValues: (values: selectedValues) => void;
    title: string;
    singleSelection: boolean;
}) {
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();

    const [listItems, setListItems] = useState<any[]>([]);
    const [selected, setSelected] = useState<selectedValues>(selectedValues);

    useEffect(() => {
        setListItems(data);
    }, [data]);

    /**
     * Function to select multiple activities
     * @param {ItemInterface} item
     */
    function handleSelectedActivity(item: ItemInterface) {
        setSelected((prevSelected) => {
            if (!singleSelection) {
                const objectIndex = (prevSelected as ItemInterface[]).findIndex(
                    (v) => v.id === item.id
                );
                if (objectIndex === -1) {
                    return [...(prevSelected as ItemInterface[]), item];
                } else {
                    return (prevSelected as ItemInterface[]).filter(
                        (v) => v.id !== item.id
                    );
                }
            } else {
                return item;
            }
        });
    }

    /**
     * Component to render the list
     * @param {ListRenderItem} param0
     * @returns
     */
    const SelectListItems: ListRenderItem<any> = ({ item }) => {
        return (
            <GestureHandlerRootView>
                <TouchableOpacity
                    style={{
                        paddingVertical: 15,
                        borderBottomWidth: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                    onPress={() =>
                        handleSelectedActivity({ id: item.id, name: item.name })
                    }
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            maxWidth: "90%",
                        }}
                    >
                        {item.profileImage && (
                            <Avatar.Image
                                size={24}
                                source={
                                    item.profileImage
                                        ? () => (
                                              <Image
                                                  style={{
                                                      width: 30,
                                                      height: 30,
                                                  }}
                                                  source={{
                                                      uri: item.profileImage,
                                                  }}
                                              />
                                          )
                                        : require("../../../assets/avatar-pending.jpg")
                                }
                            />
                        )}
                        <Text>{item.profileImage ? " " : "" + item.name}</Text>
                    </View>
                    <Checkbox
                        status={
                            Array.isArray(selected)
                                ? selected.find((v) => v.id === item.id)
                                    ? "checked"
                                    : "unchecked"
                                : selected.id === item.id
                                ? "checked"
                                : "unchecked"
                        }
                    />
                </TouchableOpacity>
            </GestureHandlerRootView>
        );
    };

    function finishSelection() {
        setSelectedValues(selected);
        onClose();
    }

    function checkUncheckAll() {
        if (singleSelection) {
            if (
                Array.isArray(selected) &&
                selected.length >= listItems.length
            ) {
                setSelected([]);
            } else {
                setSelected(listItems);
            }
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
                    {!singleSelection && (
                        <View style={styles.topButtonsContainer}>
                            <Button
                                type="secondary"
                                text={
                                    Array.isArray(selected) &&
                                    selected.length >= listItems.length
                                        ? t("uncheck-all")
                                        : t("check-all")
                                }
                                onPress={checkUncheckAll}
                            />
                        </View>
                    )}
                    <View style={{ maxHeight: "75%" }}>
                        <FlatList
                            data={listItems}
                            renderItem={SelectListItems}
                        />
                    </View>
                    <View style={styles.button}>
                        <Button
                            onPress={finishSelection}
                            text={t("finish-selection")}
                        ></Button>
                    </View>
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
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 5,
        marginBottom: 10,
    },
    formTytle: {
        fontWeight: "bold",
    },
    button: {
        marginTop: 10,
    },
    topButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        marginBottom: 10,
    },
});
