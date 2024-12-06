import { View } from "react-native";
import AskMe from "./AskMe";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AskMe />
    </View>
  );
}
