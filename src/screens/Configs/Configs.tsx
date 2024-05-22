import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Button,
    DefaultTheme,
    Modal,
    Portal,
    useTheme,
} from "react-native-paper";
import { Fontisto } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import i18next, { languageResources } from "../../../services/i18next";
import languageList from "../../../services/languagesList.json";

export default function Config() {
    const theme: DefaultTheme = useTheme();
    const [showModal, setShowModal] = useState(false);

    const { t } = useTranslation();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        button: {
            borderColor: theme.colors.primary,
            borderWidth: 1,
            backgroundColor: "#FFF",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
        text: {
            color: theme.colors.primary,
        },
        modalStyle: {
            flex: 1,
            backgroundColor: "white",
            padding: 20,
        },
        listButton: {
            paddingVertical: 15,
            borderBottomWidth: 1,
        },
        modalTytle: {
            color: theme.colors.dark,
        },
    });

    function toggleModal(): void {
        setShowModal(!showModal);
    }

    function changeLanguage(lang: string) {
        i18next.changeLanguage(lang);
        toggleModal();
    }

    return (
        <View style={styles.container}>
            <Portal>
                <Modal
                    visible={showModal}
                    onDismiss={toggleModal}
                    contentContainerStyle={styles.modalStyle}
                >
                    <View>
                        <Text style={styles.modalTytle}>
                            {t("config-language-selection-label")}
                        </Text>
                        <FlatList
                            data={Object.keys(languageResources).sort()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.listButton}
                                    onPress={() => changeLanguage(item)}
                                >
                                    <Text>
                                        {
                                            (languageList as any)[item]
                                                ?.nativeName
                                        }
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Modal>
            </Portal>
            <Button
                style={styles.button}
                onPress={toggleModal}
                icon={() => (
                    <Fontisto
                        name="world-o"
                        size={24}
                        color={theme.colors.primary}
                    />
                )}
            >
                <Text style={styles.text}>{t("config-language-button")}</Text>
            </Button>
        </View>
    );
}
