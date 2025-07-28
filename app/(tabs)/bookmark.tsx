import MovieCard from "@/components/MovieCard";
import { images } from "@/constants/images";
import { getBookmarkedMovies } from "@/services/appwrite";
import { getAndroidId, getIosIdForVendorAsync } from "expo-application";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  Text,
  View,
} from "react-native";

const Bookmark = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const func = async () => {
      try {
        setLoading(true);
        let dId = null;
        if (Platform.OS === "ios") {
          dId = await getIosIdForVendorAsync();
        } else if (Platform.OS === "android") {
          dId = getAndroidId();
        }
        const data = await getBookmarkedMovies(dId!);
        const movieList: MovieDetails[] = [];
        data.forEach((obj) => {
          movieList.push(JSON.parse(obj.movie));
        });
        setMovies(movieList);
      } catch (error) {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    func();
  }, [refresh]);

  if (loading) {
    return (
      <View className="size-full flex items-center justify-center bg-primary flex-1">
        <ActivityIndicator size="large" color={"#A8B5DB"} />
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <Image source={images.bg} className="absolute w-full z-0" />
      {movies.length === 0 ? (
        <View className="flex items-center justify-center size-full">
          <Text className="text-white text-base font-bold mt-2">
            No Bookmarks
          </Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={
            <Text className="text-white text-base font-bold mt-10 mb-5 ml-2">
              Bookmarks Movies
            </Text>
          }
          data={movies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 20,
            marginBottom: 10,
            paddingRight: 5,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                setRefresh((prev) => prev + 1);
              }}
            />
          }
          className="pl-2 mt-2 pb-36"
        />
      )}
    </View>
  );
};

export default Bookmark;
