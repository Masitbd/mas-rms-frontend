import { baseApi } from "../baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProfileList: build.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProfileListQuery } = profileApi;
