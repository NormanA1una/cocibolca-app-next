import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {},
      type: "credentials",
      async authorize(credentials, _req) {
        let user = null;
        const params = credentials as any;
        console.log("params", params);

        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: params.username,
            password: params.password,
          }),
        });

        const data = (await res.json()) as any;
        console.log("Data:", data);

        if (data.access_token) {
          user = { id: data.sub, username: data.username, rol: data.rol };
        }

        if (user) {
          console.log(user);
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async (props) => {
      props.user && (props.token.user = props.user);
      return props.token;
    },
    session: async ({ session, token }) => {
      session.user = token.user as any;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
