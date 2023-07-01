import { ListItem, VStack, Flex, Text } from "@react-native-material/core";
import RNPickerSelect from 'react-native-picker-select';

export default function SelectMenu({label, options, value, onValueChange}) {
    return (
        <RNPickerSelect 
            onValueChange={onValueChange}
            items={options}
            placeholder={{}}
            value={value}
        >
            <Flex direction="row" justify="space-between">
                <Text>{label}</Text>
                {value!=null && <Text>{value}</Text>}
            </Flex>
        </RNPickerSelect>
    )
}