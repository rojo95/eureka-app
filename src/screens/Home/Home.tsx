import { useContext, useEffect } from "react";
import { View } from "react-native";
// import { RightDrawerContext } from "../../components/drawers/RightDrawerScreen";
import Button from "../../components/Button/Button";
import AppHeader from "../../components/AppHeader/AppHeader";
import { useTranslation } from "react-i18next";

export default function HomeScreen({ navigation }: { navigation: any }) {
    const { t } = useTranslation();

    return (
        <View>
            <AppHeader title={t("menu-title-home")} />
        </View>
    );
}
