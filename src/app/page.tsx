"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import "animate.css";
import Link from "next/link";

export default function Login() {
  const { register, handleSubmit, reset } = useForm<LoginForm>();
  const router = useRouter();

  const onSubmit = (data: LoginForm) => {
    console.log(data);
    router.push("/suppliers");
  };

  return (
    <div className="min-h-screen flex items-center container mx-auto">
      <form
        className="animate__animated animate__fadeInLeftBig bg-neutral-50 border-opacity-50 rounded p-5 w-full max-w-[700px] mx-auto shadow-sm h-screen md:h-[450px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center font-bold text-3xl my-8">Iniciar sesión</h1>
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nombre de Usuario
          </label>
          <input
            value="Norman"
            type="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            placeholder="name example"
            required
            {...register("username")}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Contraseña
          </label>
          <input
            value="123456"
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
            {...register("password")}
          />
        </div>
        <div className="flex justify-center mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              {...register("remember")}
            />
          </div>
          <label
            htmlFor="remember"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Recordar usuario /{" "}
            <Link
              href={"create-user"}
              className=" hover:text-blue-600 hover:underline"
            >
              Crear
            </Link>
          </label>
        </div>
        <div className=" text-center">
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}
