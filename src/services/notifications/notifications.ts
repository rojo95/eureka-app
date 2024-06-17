import Toast from "react-native-root-toast";

export function notificationToast({
    type,
    text,
    opacity = 1,
    duration = "LONG",
    position = "BOTTOM",
}: {
    text: string;
    type: "success" | "danger";
    opacity?: number;
    duration?: "LONG" | "SHORT";
    position?: "CENTER" | "BOTTOM" | "TOP";
}) {
    Toast.show(text, {
        opacity: opacity,
        backgroundColor: type === "success" ? "#44cf73" : "#ee5a3f",
        duration: Toast.durations[duration],
        position: Toast.positions[position],
    });
}
