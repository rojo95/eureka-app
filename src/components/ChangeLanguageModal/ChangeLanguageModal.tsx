import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React from "react";
import { DefaultTheme, Modal, Portal, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import changeLanguage from "../../utils/Language";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { languageResources } from "../../services/languages/i18next";
import languageList from "../../services/languages/languagesList.json";

export default function ChangeLanguageModal({
    showModal,
    toggleModal,
}: {
    showModal: boolean;
    toggleModal: () => void;
}) {
    const theme: DefaultTheme = useTheme();
    const { t } = useTranslation();

    const styles = StyleSheet.create({
        modalStyle: {
            flex: 1,
            backgroundColor: "white",
            justifyContent: "flex-start",
            padding: 20,
        },
        modalTytle: {
            color: theme.colors.dark,
            fontWeight: "bold",
            alignItems: "center",
        },
        listButton: {
            paddingVertical: 15,
            borderBottomWidth: 1,
        },
    });

    /**
     * function to change the app language
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
    );
}
