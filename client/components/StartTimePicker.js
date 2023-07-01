import { createElement, useState } from "react";
import { View, Platform } from "react-native";
import { Text } from "@react-native-material/core";
import DatePicker from 'react-native-date-picker'
import { getDefaultDate } from "../utils/date";

export default function StartTimePicker({setDate}) {
    const [open, setOpen] = useState(false)

    if (Platform.OS === 'web') {
        // const {year, } getDefaultDate()
        return (
            <Text>Date picked by default</Text>
        )

    } else {
        return (
            <>
                <Button title="Open" onPress={() => setOpen(true)} />
                <DatePicker
                    modal
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
          </>
        );
    }
}