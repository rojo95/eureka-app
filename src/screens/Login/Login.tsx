import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Platform } from "react-native";
import { DefaultTheme, TextInput, useTheme } from "react-native-paper";
import Button from "../../components/Button/Button";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import login, { LoginProps } from "../../utils/session";

const LoginScreen = ({ navigation }: { navigation: any }) => {
    const theme: DefaultTheme = useTheme();
    const { t } = useTranslation();
    const { OS } = Platform;
    const [formData, setFormData] = useState<LoginProps>({
        email: "r.johan95@gmail.com",
        password: "/*cd7091857cd*/",
    });
    const [error, setError] = useState("");

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            backgroundColor: theme.colors.primaryContrast,
        },
        input: { marginVertical: 3 },
        formContent: {
            margin: 15,
        },
        image: { flex: 1, width: "100%", backgroundColor: "#0553" },
    });

    function handleData({ name, value }: { name: string; value: string }) {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleLogin = async () => {
        const { email, password } = formData;
        if (email !== "" && password !== "") {
            const loged = await login({ email, password });
            if (loged) {
                navigation.navigate("home");
            }
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{}}>
                <View style={styles.formContent}>
                    <View
                        style={{
                            alignItems: "center",
                        }}
                    >
                        <Image
                            style={{
                                width: "100%",
                                height: OS === "web" ? 100 : 200,
                            }}
                            source={require("../../../assets/logo_eureka.png")}
                            contentFit="contain"
                        />
                    </View>
                    <View style={styles.input}>
                        <TextInput
                            mode="outlined"
                            label={t("label-email")}
                            value={formData.email}
                            onChangeText={(text) =>
                                handleData({ name: "email", value: text })
                            }
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.input}>
                        <TextInput
                            mode="outlined"
                            label={t("label-password")}
                            value={formData.password}
                            secureTextEntry={true}
                            onChangeText={(text) =>
                                handleData({ name: "password", value: text })
                            }
                            style={styles.input}
                            right={<TextInput.Icon icon="eye" />}
                        />
                    </View>
                    <View style={styles.input}>
                        {error ? (
                            <Text style={{ color: "red" }}>{error}</Text>
                        ) : null}
                        <Button
                            text={t("button-login")}
                            onPress={handleLogin}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default LoginScreen;
