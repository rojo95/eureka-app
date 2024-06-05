import { ScrollView, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, DefaultTheme, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";

import AppHeader from "../../../../components/AppHeader/AppHeader";
import { getBudget } from "../../../../services/budgets/Budgets";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import Text from "../../../../components/Text/Text";
import Button from "../../../../components/Button/Button";
import StateBadge from "../../../../components/StateBadge/StateBadge";
import {
    calculateKTotal,
    calculateMarginProfit,
    formatDecimal,
    setDateFormat,
} from "../../../../utils/numbers";
import FAB from "../../../../components/FAB/FAB";
import Map from "../../../../components/Map/Map";

export default function DetailsBudget() {
    const {
        contextParams: { itemId },
    } = useContext(ParamsContext)!;
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function getDetails() {
        const info = await getBudget({ id: itemId });
        console.log(info);

        const i = {
            activity: {
                activityTypeId: 1,
                deletedAt: null,
                id: 15,
                name: "NAÚTICA",
                wcId: 3,
            },
            activityId: 15,
            brigadeToAssign: null,
            budgetId: 10826,
            chapters: [
                {
                    articleDatabaseId: null,
                    batches: [Array],
                    budgetId: 12026,
                    createdAt: "2023-01-04T12:00:33.000Z",
                    deletedAt: null,
                    description: "L.ESSENSE",
                    id: 57317,
                    kMat: 1,
                    kMatModified: null,
                    kMo: 1,
                    kMoModified: null,
                    kOut: 1,
                    kOutModified: null,
                    matCost: 2.6,
                    matSale: 2.6,
                    moCost: 0,
                    moSale: 0,
                    outsourceCost: 0,
                    outsourceSale: 0,
                    priceDatabaseId: null,
                    rank: 2,
                    totalCost: 2.6,
                    totalSale: 2.6,
                    updatedAt: "2023-01-04T12:00:33.000Z",
                },
            ],
            client: {
                businessName: null,
                cifNif: "A00100200",
                clientContacts: [],
                clientId: null,
                code: null,
                colorClient: null,
                contasimpleId: null,
                country: null,
                createdAt: "2022-08-31T09:49:52.000Z",
                customFields: null,
                defaultAddressId: null,
                defaultContactId: null,
                defaultVatId: null,
                deletedAt: null,
                domicile: null,
                dueDateDays: null,
                email: null,
                externalId: null,
                id: 15319,
                kMat: null,
                kMo: null,
                kOut: null,
                ledgerAccountNumber: null,
                locality: null,
                name: "FREYA",
                notes: null,
                number: "63",
                numberOfDeadlines: 1,
                paymentMethodId: null,
                personType: "client",
                profileImage: null,
                province: null,
                responsible: null,
                salesLedgerAccountNumber: null,
                tags: null,
                telephone: null,
                updatedAt: "2022-08-31T09:49:52.000Z",
                userCreated: null,
                wcId: 3,
                zip: null,
            },
            clientId: 15319,
            createdAt: "2023-01-04T12:00:33.000Z",
            dateAt: "2023-01-04T00:00:00.000Z",
            deletedAt: null,
            discount: 0,
            discountMat: null,
            discountMo: null,
            discountValue: 0,
            draftWorkOrderDescription: null,
            id: 12026,
            isActivityByAdministration: false,
            isDraft: true,
            kMat: 1,
            kMo: 1,
            kOut: 1,
            matCost: 2.6,
            matSale: 2.6,
            moCost: 0,
            moSale: 0,
            notes: "",
            number: "2023-0014",
            observations: "Cuenta bancaria 123",
            outsourceCost: 0,
            outsourceSale: 0,
            personnelResponsibleId: 873,
            place: {
                id: 43941,
                lat: 37.42342,
                lng: -122.08395,
                name: "1233 S 5th St, Mountain View, CA 91801, EE. UU.",
            },
            placeId: 43941,
            responsible: {
                active: true,
                activeDate: "2024-01-30T11:30:55.000Z",
                address: null,
                appVersion: "6.6.7-beta",
                bankAccount: null,
                brigadeId: null,
                categoryId: null,
                clientCanAssign: false,
                country: null,
                createdAt: "2022-06-06T07:38:33.000Z",
                deletedAt: null,
                email: "jmplazaruiz@gmail.com",
                id: 873,
                inactiveDate: "2024-01-30T08:57:45.000Z",
                insuranceNumber: null,
                lastAccessed: "2024-05-30T10:42:26.000Z",
                lastName: "Plaza 1",
                locality: null,
                modifiedAt: "2024-05-30T10:42:26.000Z",
                name: "Juan",
                nif: "12312312A",
                partTimeEmployee: false,
                personalEmail: null,
                personalPhone: null,
                profileImage: null,
                signatureImage: null,
                telephone: null,
                type: "ADMINISTRADOR",
                username: null,
                wcId: 3,
                workCenters: [3, 38],
                zip: null,
            },
            revisionOf: {
                activityId: 15,
                brigadeToAssign: null,
                budgetId: null,
                clientId: 15319,
                createdAt: "2022-09-01T08:21:22.000Z",
                dateAt: "2022-09-01T00:00:00.000Z",
                deletedAt: null,
                discount: 0,
                discountMat: null,
                discountMo: null,
                draftWorkOrderDescription: null,
                id: 10826,
                isActivityByAdministration: false,
                isDraft: true,
                kMat: 1,
                kMo: 1,
                kOut: 1,
                matCost: 568.36,
                matSale: 1136.72,
                moCost: 270,
                moSale: 540,
                notes: "Cambiar también un termo",
                number: "2022-0213",
                observations: null,
                outsourceCost: 0,
                outsourceSale: 0,
                personnelResponsibleId: 413,
                placeId: 37652,
                stateId: 3,
                title: "Cambio cilindros freys",
                totalCost: 838.36,
                totalSale: 1676.72,
                totalSaleDiscount: null,
                updatedAt: "2022-09-01T08:23:00.000Z",
                vat: 21,
                vatId: null,
                version: 0,
                wcId: 3,
                workId: null,
            },
            state: { id: 3, name: "Contratado", value: "contracted" },
            stateId: 3,
            title: "11111",
            totalCost: 2.6,
            totalHours: "0d 0h",
            totalSale: 2.6,
            totalSaleDiscount: null,
            totalSaleWithoutDiscount: 2.6,
            updatedAt: "2023-01-04T12:00:33.000Z",
            vat: 21,
            vatId: null,
            version: 0,
            wcId: 3,
            workCenter: {
                a3CompanyCode: 1,
                a3PurchasesAccount: 6,
                a3SalesAccount: 7,
                bankAccount: "4455785425454554",
                budgetConfig: {
                    budgetName: true,
                    budgetNumber: true,
                    clientAddress: true,
                    clientDocumentId: true,
                    clientName: true,
                    createdAt: "2022-06-07T15:40:33.000Z",
                    date: true,
                    defaultObservations: "Cuenta bancaria 123",
                    deletedAt: null,
                    footer: "Información del pie de portada",
                    footerCoverColor: "#ffffff",
                    id: 1,
                    kMat: null,
                    kMo: 1.2,
                    kOut: 1.2,
                    printCover: true,
                    printCoverOption: "both",
                    templateModel: "alternative",
                    updatedAt: "2024-05-23T07:07:09.000Z",
                    wcId: 3,
                    workCenterDocumentId: true,
                    workCenterLogo: true,
                    workCenterName: true,
                },
                cifNif: "B11111111",
                contasimpleEmail: "demo@eurekacloud.es",
                contasimpleIntegration: true,
                contasimplePassword: "Eurekacloud-contasimple-3",
                contasimpleToken: null,
                country: "España",
                customCounters: {
                    budget: "yearly",
                    stockorder: "always",
                    work: "always",
                },
                customPdf: {
                    budgetCover:
                        "https://pre.api.eurekacloud.es/api/containers/eurekacloud-pre/download/budgetCover-1705328597816-fondo_taktics.png",
                    budgetResponsible: true,
                    extraAvatar: null,
                    fontSize: 11,
                    footerColor: "#f5d2d6",
                    headerColor: "#ffffff",
                },
                defaultVatId: 5,
                distanceCost: 0.8,
                domicile: "Gremi des Fusters, 19",
                enabled: true,
                externalId: null,
                extraHourPrice: 25,
                hourPrice: 18,
                hoursTypes: {
                    extra: [Object],
                    fitosanitary: [Object],
                    night: [Object],
                    normal: [Object],
                },
                id: 3,
                incomeGoal: null,
                invoiceTemplateModel: "original",
                iva: 4,
                legalTerms:
                    "CONSTRUCCIONES RG 24 S.L. es el Responsable del tratamiento de los datos personales proporcionados bajo su consentimiento y le informa de que estos datos serán tratados de conformidad con lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril (GDPR), y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD), con la finalidad de mantener una relación comercial (por interés legítimo del responsable, art. 6.1.f GDPR) y conservarlos durante no más tiempo del necesario para mantener el fin del tratamiento o mientras existan prescripciones legales que dictaminen su custodia. No se comunicarán los datos a terceros, salvo obligación legal. Asimismo, se le informa de que puede ejercer los derechos de acceso, rectificación, portabilidad y supresión de sus datos y los de limitación y oposición a su tratamiento dirigiéndose a CONSTRUCCIONES RG 24 S.L. en C/ Sa Trenka, 52 - 07840 Santa Eulalia del Rio (Illes Balears). Email: ramosibiza@ramosibiza.com y el de reclamación a www.aepd.es.",
                locality: "Palma de Mallorca",
                name: "EUREKA",
                province: "Islas Baleares",
                purchasesLedgerAccountNumber: "1111",
                salesLedgerAccountNumber: "2222",
                telephone: "971317771",
                type: "CENTRO",
                urlAvatar:
                    "https://pre.api.eurekacloud.es/api/containers/eurekacloud-pre/download/urlAvatar-1671625416468-logo_eureka.png",
                wcId: null,
                website: "www.googl.es",
                zip: "07009",
            },
            workId: 4324,
        };

        setData(info);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        getDetails();

        return () => {};
    }, [itemId]);

    const stylesThemed = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primaryContrast,
        },
        text: {
            color: theme.colors.dark,
        },
        costo: {
            color: theme.colors.danger,
        },
        venta: {
            color: theme.colors.success,
        },
    });

    return (
        <View style={[styles.container, stylesThemed.container]}>
            <AppHeader
                title={t("budget-details-title")}
                actions={[{ icon: "dots-vertical" }]}
                subtitle={t("information-label")}
            />
            {!data || loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View>
                    <ScrollView style={[styles.content]}>
                        <View style={styles.containerCode}>
                            <Text>{data?.number}</Text>
                            <View>
                                <Button
                                    type="link"
                                    buttonStyle={{
                                        backgroundColor: theme.colors.primary,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                    }}
                                    icon={
                                        <MaterialCommunityIcons
                                            name="pencil"
                                            size={24}
                                            color="white"
                                        />
                                    }
                                />
                            </View>
                        </View>
                        <Text style={[styles.title, stylesThemed.text]}>
                            {data.title}
                        </Text>
                        <StateBadge
                            id={data?.state?.id}
                            name={data?.state?.name}
                            customStyles={{
                                fontSize: 15,
                                paddingHorizontal: 10,
                            }}
                        />
                        <Text>{setDateFormat(data.createdAt)}</Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name="clock-time-four-outline"
                                    size={50}
                                    color="black"
                                />
                                <Text>{data.totalHours}</Text>
                            </View>
                            <Image
                                source={
                                    data.client.profileImage ||
                                    require("../../../../../assets/avatar-pending.jpg")
                                }
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 100,
                                }}
                            />
                            <View style={styles.iconContainer}>
                                <Feather
                                    name="pie-chart"
                                    size={50}
                                    color="black"
                                />
                                <Text>
                                    K=
                                    {formatDecimal({
                                        number: calculateKTotal({
                                            totalCost: data.totalCost,
                                            totalSale: data.totalSale,
                                        }),
                                    })}
                                </Text>
                                <Text>
                                    {formatDecimal({
                                        number: calculateMarginProfit({
                                            totalCost: data.totalCost,
                                            totalSale: data.totalSale,
                                        }),
                                    })}
                                    %
                                </Text>
                            </View>
                        </View>
                        <View style={styles.mapContainer}>
                            <View style={styles.mapAddress}>
                                {data?.place ? (
                                    <View>
                                        <MaterialCommunityIcons
                                            name="map-marker-outline"
                                            size={24}
                                            color="black"
                                        />
                                        <Text>{data?.place?.name}</Text>
                                    </View>
                                ) : (
                                    <Text>{t("no-address-provided")}</Text>
                                )}
                            </View>

                            <Map
                                mapStyle={{ height: 200 }}
                                markerPreset={
                                    data?.place
                                        ? {
                                              latitude: data?.place?.lat,
                                              longitude: data?.place?.lng,
                                          }
                                        : null
                                }
                                address={
                                    data?.place
                                        ? {
                                              latitude: data?.place?.lat,
                                              latitudeDelta: 17.679489473469285,
                                              longitude: data?.place?.lng,
                                              longitudeDelta: 12.98109669238329,
                                          }
                                        : null
                                }
                                readOnly={true}
                            />
                        </View>
                        <View
                            style={{
                                alignItems: "flex-end",
                                marginTop: 20,
                            }}
                        >
                            <Text style={[styles.price, stylesThemed.costo]}>
                                {formatDecimal({ number: data?.totalCost })}€
                            </Text>
                            <Text style={[styles.price, stylesThemed.venta]}>
                                {formatDecimal({ number: data?.totalSale })}€
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            )}
            <FAB
                primaryIcon="content-save"
                onOpen={() => console.log("save")}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerCode: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        paddingHorizontal: 25,
        marginBottom: -100,
    },
    title: {
        marginVertical: 5,
        fontSize: 20,
        fontWeight: "bold",
    },
    code: {
        fontSize: 13,
    },
    iconContainer: {
        alignItems: "center",
    },
    mapContainer: {},
    mapAddress: {
        marginVertical: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    price: {
        fontWeight: "bold",
    },
});
