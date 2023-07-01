import { View, Platform, Text } from "react-native";
import { Picker } from '@react-native-picker/picker';
import SelectMenu from "../components/SelectMenu";

export default function ValueSelector({ label, onValueChange, value, prompt, options, title }) {
    if (Platform.OS === 'web') {
        return (
            <View 
                // style={styles.header}
            >
                <Text 
                    // style={styles.title}
                >
                        {title}
                </Text>
                <Picker
                    selectedValue={value}
                    onValueChange={onValueChange}
                    prompt={prompt}
                    // style={styles.picker}
                    // itemStyle={styles.pickerItem}
                >
                    <Picker.Item label={label} value={null} />
                    {options && options.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                </Picker>
            </View>
        );
    } else {
        return (
            <SelectMenu
                label={label}
                onValueChange={onValueChange}
                value={value}
                options={options}
            />
        );
    }
};

