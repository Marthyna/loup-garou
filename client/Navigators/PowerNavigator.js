import { createStackNavigator } from "@react-navigation/stack";
import PowerView from "../Views/PowerView";
import PowerOutcomeView from "../Views/PowerOutcomeView";

export default function PowerNavigator({ navigation }) {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Power"
                component={PowerView}
                initialParams={{
                    power: {
                        name: "Psychic",
                        description: 'Talk to a deceived villager in a private chat'
                    }
                }}
                options={{ headerShown: false }}
            />
            <Stack.Screen 
                name="PowerOutcomeView" 
                component={PowerOutcomeView}
                options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}