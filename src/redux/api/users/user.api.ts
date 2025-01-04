import { IProfile, IUserPost } from "@/components/users/Types&Defaults";
import { baseApi } from "../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserList: build.query({
      query: (query: Record<string, string>) => ({
        url: "/user",
        method: "GET",
        params: query,
      }),
      providesTags: ["user-list"],
    }),
    getSingleUserByUUid: build.query({
      query: (uuid: string) => ({
        url: `/user/${uuid}`,
        method: "GET",
      }),
      providesTags: ["single-user"],
    }),

    createUser: build.mutation({
      query: (data: IUserPost) => ({
        url: "/user",
        method: "POST",
        body: data,
        data: data,
      }),
      invalidatesTags: ["user-list"],
    }),
    updateUserProfile: build.mutation({
      query: (data: { profile: IProfile; uuid: string }) => ({
        url: `/user/profile/${data.uuid}`,
        method: "PATCH",
        body: data.profile,
        data: data.profile,
      }),
      invalidatesTags: ["user-list", "single-user"],
    }),
    deleteUser: build.mutation({
      query: (uuid: string) => ({
        url: `/user/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user-list", "single-user"],
    }),
    changePasswordAdmin: build.mutation({
      query: (data: { data: { password: string }; id: string }) => ({
        url: `/user/change-password-admin/${data.id}`,
        method: "PATCH",
        body: data.data,
        data: data.data,
      }),
      invalidatesTags: ["user-list", "single-user"],
    }),

    // update

    // updateWaiterList: build.mutation({
    //   query: (options) => ({
    //     url: `/waiter/${options.id}`,
    //     method: "PATCH",
    //     body: options.data,
    //     data: options?.data,
    //   }),
    //   invalidatesTags: ["waiterList"],
    // }),

    // deleteWaiterList: build.mutation({
    //   query: (id) => ({
    //     url: `/waiter/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["waiterList"],
    // }),
  }),
});

export const {
  useGetUserListQuery,
  useCreateUserMutation,
  useLazyGetSingleUserByUUidQuery,
  useUpdateUserProfileMutation,
  useDeleteUserMutation,
  useChangePasswordAdminMutation,
} = userApi;

export type IUseCreateUserMutation = ReturnType<typeof useGetUserListQuery>;
export type IUserUpdateUserProfileMutation = ReturnType<
  typeof useUpdateUserProfileMutation
>;

export type IUserDeleteMutation = ReturnType<typeof useDeleteUserMutation>;
