import { icons } from "@/constants/icons";
import React from "react";
import { Image, TextInput, View } from "react-native";

interface SearchbarProps {
  onPress?: () => void;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
}
const Searchbar = ({
  onPress,
  placeholder,
  value,
  onChangeText,
}: SearchbarProps) => {
  return (
    <View className="flex-row rounded-full items-center bg-dark-200 py-4 px-5">
      <Image
        source={icons.search}
        className="size-5"
        tintColor="#ab8bff"
        resizeMode="contain"
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor="#ab8bff"
        value={value}
        className="flex-1 ml-2 text-white"
      />
    </View>
  );
};

export default Searchbar;
