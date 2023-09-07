import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            params: {
              username: params.username,
              password: params.password,
            },
          }),
        });

        const data = (await res.json()) as any;

        if (data) {
          user = { id: params.sub, username: params.username, rol: params.rol };
        }

        if (user) {
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
