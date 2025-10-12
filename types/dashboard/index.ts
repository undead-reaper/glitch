import { AppRouter } from "@/services/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type VideoGetOneOutput =
  inferRouterOutputs<AppRouter>["videos"]["getOne"];

export type VideoGetManyOutput =
  inferRouterOutputs<AppRouter>["suggestions"]["getMany"];

  export type PlaylistGetUserPlaylistsOutput =
    inferRouterOutputs<AppRouter>["playlists"]["getUserPlaylists"];

  export type UserGetOneOutput =
    inferRouterOutputs<AppRouter>["users"]["getOne"];