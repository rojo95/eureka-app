import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import {
    // Button,
    DefaultTheme,
    Modal,
    Portal,
    useTheme,
} from "react-native-paper";
import { Fontisto } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { languageResources } from "../../../services/i18next";
import languageList from "../../../services/languagesList.json";
import Button from "../../components/Button/Button";
import changeLanguage from "../../utils/Language";
import { Text } from "../../components/Text/Text";

export default function Configs() {
    const theme: DefaultTheme = useTheme();
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 5,
        },
        modalStyle: {
            flex: 1,
            backgroundColor: "white",
            justifyContent: "flex-start",
            padding: 20,
        },
        listButton: {
            paddingVertical: 15,
            borderBottomWidth: 1,
        },
        modalTytle: {
            color: theme.colors.dark,
            fontWeight: "bold",
            alignItems: "center",
        },
    });

    function toggleModal(): void {
        setShowModal(!showModal);
    }

    /**
     *
     * @param lang {string}
     */
    async function changeLang(lang: string) {
        try {
            await AsyncStorage.setItem("lang", lang);
            changeLanguage(lang);
            toggleModal();
        } catch (e) {
            console.error("Error", e);
        }
    }

    return (
        <View style={styles.container}>
            <Portal>
                <Modal
                    visible={showModal}
                    onDismiss={toggleModal}
                    contentContainerStyle={styles.modalStyle}
                >
                    <Text style={styles.modalTytle}>
                        {t("config-language-selection-label")}
                    </Text>
                    <FlatList
                        data={Object.keys(languageResources).sort()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.listButton}
                                onPress={() => changeLang(item)}
                            >
                                <Text>
                                    {(languageList as any)[item]?.nativeName}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </Modal>
            </Portal>
            <Button
                onPress={toggleModal}
                icon={() => (
                    <Fontisto
                        name="world-o"
                        size={24}
                        color={theme.colors.primary}
                    />
                )}
                text={t("config-language-button")}
            />
        </View>
    );
}
