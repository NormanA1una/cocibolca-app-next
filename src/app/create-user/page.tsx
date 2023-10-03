"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal);

export default function CreateUser() {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit } = useForm<SignInForm>();
  const router = useRouter();

  const createUser = async (formData: SignInForm) => {
    if (formData.remember) {
      sessionStorage.setItem("username", formData.username);
    }

    try {
      const response = await axios.post("http://localhost:8000/user", formData);
      console.log("Response data:", response.data);
      return response.data;
    } catch (error) {
      console.log("Error creating user:", error);
      throw error;
    }
  };

  const onSubmit = async (data: SignInForm) => {
    try {
      setIsLoading(true);
      mySwal.fire({
        title: "Creando Usuario...",
        didOpen: () => {
          mySwal.showLoading();
        },
        allowOutsideClick: false,
      });
      await createUser(data);
      mySwal
        .fire({
          title: "Usuario creado con exito!",
          icon: "success",
        })
        .then((resp) => {
          if (resp.value) {
            router.push("/");
          }
        });
      console.log("data:", data);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error in submit data:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center container mx-auto ">
      <form
        className="animate__animated animate__fadeInLeftBig bg-neutral-50 border-opacity-50 rounded px-5 pb-5 pt-40 md:p-5 w-full max-w-[700px] mx-auto shadow-md h-screen md:h-[550px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center font-bold text-3xl my-8">Crear usuario</h1>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            placeholder="name@flowbite.com"
            required
            {...register("correo")}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            placeholder="name example"
            required
            {...register("username")}
          />
        </div>
        <div className="mb-6 flex justify-between">
          <div className="w-full max-w-[160px] md:max-w-[250px]">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              {...register("password")}
            />
          </div>

          <div className="w-full max-w-[160px] md:max-w-[250px]">
            <label
              htmlFor="role"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Rol
            </label>
            <select
              id="role"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
              {...register("roles")}
            >
              <option>-</option>
              <option>Administrador</option>
              <option>Usuario</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              {...register("remember")}
            />
          </div>
          <label
            htmlFor="remember"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Recordar usuario
          </label>
        </div>
        <div className=" text-center">
          <button
            disabled={isLoading}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isLoading ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}
