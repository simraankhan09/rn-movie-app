import { icons } from "@/constants/icons";
import { fetchMovieDetails } from "@/services/api";
import { bookmarkMovie } from "@/services/appwrite";
import { useFetch } from "@/services/useFetch";
import { getAndroidId, getIosIdForVendorAsync } from "expo-application";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MovieInfo = (props: {
  label: string;
  value?: string | number | null;
}) => {
  const { label, value } = props;
  return (
    <View className="flex-col items-start justify-center mt-5">
      <Text className="font-normal text-sm text-light-200">{label}</Text>
      <Text className="font-bold text-sm text-light-100 mt-2">
        {value || "N/A"}
      </Text>
    </View>
  );
};

const MovieDetails = () => {
  const { id } = useLocalSearchParams<{ id: any }>();
  const {
    data: movieDetails,
    loading: movieDetailsLoading,
    error: movieDetailsError,
  } = useFetch(() => fetchMovieDetails(id));

  const handleBookmarkMovie = async () => {
    let deviceId = null;
    try {
      if (Platform.OS === "ios") {
        deviceId = await getIosIdForVendorAsync();
      } else if (Platform.OS === "android") {
        deviceId = getAndroidId();
      }
      const response = await bookmarkMovie(deviceId!, movieDetails!);
      if (response) {
        console.info("movie bookmarked");
        Alert.alert("Success", "Movie bookmarked successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (movieDetailsLoading) {
    return (
      <View className="bg-primary flex-1">
        <ActivityIndicator
          size="large"
          color="#0000FF"
          className="mt-10 self-center"
        />
      </View>
    );
  }

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500/${movieDetails?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />
          <TouchableOpacity
            onPress={handleBookmarkMovie}
            className="absolute -bottom-7 right-7 bg-[#000000a4] rounded-full size-12 flex items-center justify-center"
          >
            <Image
              source={icons.save}
              className="size-7"
              tintColor={"#A8B5DB"}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white text-xl font-bold">
            {movieDetails?.title}
          </Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movieDetails?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">
              {movieDetails?.runtime}m
            </Text>
          </View>
          <View className="flex-row items-center gap-x-1 mt-2 bg-dark-100 py-1 px-2 rounded-md">
            <Image className="size-4" source={icons.star} />
            <Text className="text-sm text-white font-bold">
              {Math.round(movieDetails?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movieDetails?.vote_count} votes)
            </Text>
          </View>
          <MovieInfo label="Overview" value={movieDetails?.overview} />
          <MovieInfo
            label="Genres"
            value={movieDetails?.genres?.map((g) => g.name).join(" - ")}
          />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={
                "$" + (movieDetails?.budget ?? 0) / 1_000_000 + " millions"
              }
            />
            <MovieInfo
              label="Revenue"
              value={
                "$" +
                Math.round((movieDetails?.revenue ?? 0) / 1_000_000) +
                " millions"
              }
            />
          </View>
          <MovieInfo
            label="Production Companies"
            value={movieDetails?.production_companies
              ?.map((c) => c.name)
              .join(" - ")}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MovieDetails;
