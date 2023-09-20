import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
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
        console.log("Dataaaa:", data.access_token);

        if (data.access_token) {
          user = {
            id: data.sub,
            username: data.username,
            rol: data.rol,
            accesToken: data.access_token,
          };
        }

        if (user) {
          return user;
        } else {
          console.log("Error de credenciales");

          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async (props) => {
      /* props.user && (props.token.user = props.user);
      return props.token; */
      return { ...props.token, ...props.user };
    },
    session: async ({ session, token }) => {
      session.user = token as any;

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
