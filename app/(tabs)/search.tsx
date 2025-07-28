import MovieCard from "@/components/MovieCard";
import Searchbar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const rounter = useRouter();

  const {
    data: movies,
    loading: movieLoading,
    error: movieError,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    const func = async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    };
    const debounce = setTimeout(func, 800);
    return () => {
      reset();
      clearTimeout(debounce);
    };
  }, [searchQuery]);

  useEffect(() => {
    const func = async () => {
      if (searchQuery?.trim() && movies?.length && movies?.[0]) {
        await updateSearchCount(searchQuery, movies[0]);
      }
    };
    func();
  }, [searchQuery, movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="w-full z-0 absolute" />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        className="px-2"
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row items-center justify-center mt-20">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>
            <View className="w-full flex-row items-center justify-center my-4">
              <Searchbar
                placeholder="Search movies..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
            </View>
            {movieLoading ? (
              <ActivityIndicator
                size="large"
                color="#0000FF"
                className="my-3"
              />
            ) : null}
            {movieError ? (
              <Text className="my-3 px-5 text-red-500">
                Error: {movieError?.message}
              </Text>
            ) : null}

            {!movieLoading &&
            !movieError &&
            searchQuery.trim() &&
            movies?.length > 0 ? (
              <Text className="text-xl font-bold text-white">
                Search result for{" "}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            ) : null}
          </>
        }
        ListEmptyComponent={
          !movieLoading && !movieError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim() ? "No results found" : "Search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
