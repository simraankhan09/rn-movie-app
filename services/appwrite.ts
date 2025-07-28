import { Client, Databases, ID, Query } from "react-native-appwrite";

// 1. track the searches by user
const APPRWITE_CONFIG = {
  ENDPOINT: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  PROJECT_ID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  COLLECTION_ID: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!,
  BOOKMARK_COLLECTION_ID:
    process.env.EXPO_PUBLIC_APPWRITE_BOOKMARK_COLLECTION_ID!,
};

const client = new Client()
  .setEndpoint(APPRWITE_CONFIG.ENDPOINT)
  .setProject(APPRWITE_CONFIG.PROJECT_ID);

const database = new Databases(client);

const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const results = await database.listDocuments(
      APPRWITE_CONFIG.DATABASE_ID,
      APPRWITE_CONFIG.COLLECTION_ID,
      [Query.equal("searchTerm", query)]
    );
    if (results.documents?.length) {
      const existingMovie = results.documents[0];
      await database.updateDocument(
        APPRWITE_CONFIG.DATABASE_ID,
        APPRWITE_CONFIG.COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(
        APPRWITE_CONFIG.DATABASE_ID,
        APPRWITE_CONFIG.COLLECTION_ID,
        ID.unique(),
        {
          searchTerm: query,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
          title: movie.title,
        }
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const results = await database.listDocuments(
      APPRWITE_CONFIG.DATABASE_ID,
      APPRWITE_CONFIG.COLLECTION_ID,
      [Query.limit(5), Query.orderDesc("count")]
    );
    return results.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const bookmarkMovie = async (deviceId: string, movie: MovieDetails) => {
  try {
    await database.createDocument(
      APPRWITE_CONFIG.DATABASE_ID,
      APPRWITE_CONFIG.BOOKMARK_COLLECTION_ID,
      ID.unique(),
      {
        deviceId: deviceId,
        movie: JSON.stringify(movie),
      }
    );
    return true;
  } catch (error) {
    throw error;
  }
};

const getBookmarkedMovies = async (
  deviceId: string
): Promise<BookmarkedMovie[]> => {
  try {
    const results = await database.listDocuments(
      APPRWITE_CONFIG.DATABASE_ID,
      APPRWITE_CONFIG.BOOKMARK_COLLECTION_ID,
      [Query.equal("deviceId", deviceId)]
    );
    return results.documents as unknown as BookmarkedMovie[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export {
  bookmarkMovie,
  getBookmarkedMovies,
  getTrendingMovies,
  updateSearchCount,
};
