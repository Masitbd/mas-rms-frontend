import Credentials from "next-auth/providers/credentials";

import NextAuth, {
  AuthValidity,
  BackendAccessJWT,
  BackendJWT,
  DecodedJWT,
  User,
  UserObject,
} from "next-auth";
import type { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

async function refreshAccessToken(nextAuthJWTCookie: JWT): Promise<JWT> {
  try {
    // Get a new access token from backend using the refresh token
    const res = await axios
      .post(
        "http://localhost:5000/api/v1/auth/refresh-token",
        {},

        {
          headers: {
            authorization: nextAuthJWTCookie.data.tokens.refreshToken,
          },
        }
      )
      .catch((err) => {
        if (err?.response?.data?.message)
          throw Error(err.response.data.message);
        else throw Error(err);
      });

    const accessToken: BackendAccessJWT = await res.data?.data?.accessToken;

    const { exp }: DecodedJWT = jwtDecode(accessToken as unknown as string);

    // Update the token and validity in the next-auth cookie
    nextAuthJWTCookie.data.validity.valid_until = exp;
    nextAuthJWTCookie.data.tokens.accessToken = accessToken.accessToken;

    return nextAuthJWTCookie;
  } catch (error) {
    console.error(error);
    console.debug(error);
    return {
      ...nextAuthJWTCookie,
      error: "RefreshAccessTokenError",
    };
  }
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Login",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john@mail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios
            .post("http://localhost:5000/api/v1/auth/login", {
              email: credentials?.email,
              password: credentials?.password,
            })
            .catch((err) => {
              if (err?.response?.data?.message)
                throw Error(err.response.data.message);
              else throw Error(err);
            });

          const tokens: BackendJWT = await res?.data?.data;

          const access: DecodedJWT = jwtDecode(tokens.accessToken);
          const refresh: DecodedJWT = jwtDecode(tokens.refreshToken);
          // Extract the user from the access token
          const user: UserObject = {
            name: access?.name,
            email: access?.email,
            id: access?.id,
            role: access?.role,
            uuid: access?.uuid,
          };
          // Extract the auth validity from the tokens
          const validity: AuthValidity = {
            valid_until: access.exp,
            refresh_until: refresh.exp,
          };
          // Return the object that next-auth calls 'User'
          // (which we've defined in next-auth.d.ts)

          return {
            // User object needs to have a string id so use refresh token id
            id: refresh.jti,
            tokens: tokens,
            user: user,
            validity: validity,
          } as User;
        } catch (error) {
          throw Error("Authentication error" + error);
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl);
    },
    async jwt({ token, user, account }) {
      // Initial signin contains a 'User' object from authorize method
      if (user && account) {
        console.debug("Initial signin");
        return { ...token, data: user };
      }

      // The current access token is still valid
      if (Date.now() < token.data.validity.valid_until * 1000) {
        console.debug("Access token is still valid");
        return token;
      }

      // The refresh token is still valid
      if (Date.now() < token.data.validity.refresh_until * 1000) {
        console.debug("Access token is being refreshed");
        return await refreshAccessToken(token);
      }

      // The current access token and refresh token have both expired
      // This should not really happen unless you get really unlucky with
      // the timing of the token expiration because the middleware should
      // have caught this case before the callback is called
      console.debug("Both tokens have expired");
      return { ...token, error: "RefreshTokenExpired" } as JWT;
    },
    async session({ session, token }) {
      session.user = token.data.user;
      session.validity = token.data.validity;
      session.error = token.error;
      session.token = token.data.tokens?.accessToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
