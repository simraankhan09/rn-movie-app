import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Tabs } from "expo-router";
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";

const TabIcon = (props: {
  image: any;
  text: string;
  icon: any;
  focused: boolean;
}) => {
  const { image, text, icon, focused } = props;

  if (!focused) {
    return (
      <View className="size-full items-center justify-center mt-4 rounded-full ">
        <Image source={icon} tintColor={"#A8B5DB"} className="size-5" />
      </View>
    );
  }
  return (
    <ImageBackground
      source={image}
      className="flex flex-row w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center overflow-hidden rounded-full"
    >
      <Image tintColor={"#151312"} className="size-5" source={icon} />
      <Text className="text-secondary text-base ml-2 font-semibold">
        {text}
      </Text>
    </ImageBackground>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0F0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: (props) => {
            return (
              <TabIcon
                image={images.highlight}
                icon={icons.home}
                text="Home"
                focused={props.focused}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          tabBarIcon: (props) => {
            return (
              <TabIcon
                image={images.highlight}
                icon={icons.search}
                text="Search"
                focused={props.focused}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="bookmark"
        options={{
          headerShown: false,
          tabBarIcon: (props) => {
            return (
              <TabIcon
                image={images.highlight}
                icon={icons.save}
                text="Bookmarks"
                focused={props.focused}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
