"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { FormControlLabel, Switch, createTheme } from "@mui/material";
import { green } from "@mui/material/colors";

const mySwal = withReactContent(Swal);

export default function AddSupplier() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSupplierActive, setIsSupplierActive] = useState(false);
  const { register, handleSubmit, reset } = useForm<SupplierForm>();
  const router = useRouter();

  const createSupplier = async (formData: SupplierForm) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/supplier",
        formData
      );
      return response.data;
    } catch (error) {
      console.log("Error creating user:", error);
      throw error;
    }
  };

  const onSubmit = async (data: SupplierForm) => {
    try {
      setIsLoading(true);
      mySwal.fire({
        title: "Añadiendo proveedor...",
        didOpen: () => {
          mySwal.showLoading();
        },
        allowOutsideClick: false,
      });
      await createSupplier(data);
      mySwal
        .fire({
          title: "Usuario creado con exito!",
          icon: "success",
        })
        .then((resp) => {
          if (resp.value) {
            reset();
            router.push("/suppliers");
          }
        });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error in submit data:", error);
    }
  };

  const onCheck = (e: any) => {
    const checked = e.target.checked;

    if (checked) {
      setIsSupplierActive(true);
    }

    if (!checked) {
      setIsSupplierActive(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-center p-4 border border-dashed">
      <div className="w-full max-w-[700px] mx-auto text-right mb-4">
        <Link href={"/suppliers"}>
          <button
            type="button"
            className=" bg-red-600 rounded-md p-2 text-neutral-50 w-[100px]"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className=" text-neutral-50 mr-1"
            />{" "}
            Volver
          </button>
        </Link>
      </div>
      <form
        className="animate__animated animate__fadeIn bg-neutral-50 border-opacity-50 rounded p-5 w-full max-w-[700px] mx-auto shadow-sm h-screen md:h-[680px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center font-bold text-3xl my-8">
          Agregar proveedor
        </h1>

        <div className="mb-6">
          <label
            htmlFor="nombreProveedor"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nombre del Proveedor
          </label>
          <input
            type="text"
            id="nombreProveedor"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            placeholder="compañia ejemplo S.A."
            required
            {...register("nombreProveedor")}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="tipoDeProducto"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tipo del Producto
          </label>
          <input
            type="text"
            id="tipoDeProducto"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            placeholder="Cerveza... Ron... Snacks..."
            required
            {...register("tipoDeProducto")}
          />
        </div>

        <div className="mb-6 flex justify-end items-center">
          <FormControlLabel
            htmlFor="estado"
            control={
              <Switch
                id="estado"
                inputProps={{ role: "checkbox" }}
                color="success"
                size="medium"
                {...(register("estado"),
                {
                  onChange: (e) => {
                    onCheck(e);
                  },
                })}
              />
            }
            label={`Estado del proveedor: ${
              isSupplierActive ? "Activo" : "Inactivo"
            }`}
            labelPlacement="start"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="logo"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Logo del Proveedor
          </label>
          <Image
            src="/no-image-icon-23485.png"
            alt="No image png"
            width={150}
            height={150}
            className=""
          ></Image>
          <input type="file" disabled {...register("logo")} />
        </div>

        <div className="flex justify-center">
          <button
            disabled={isLoading}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isLoading ? "Creando..." : "Crear proveedor"}
            <FontAwesomeIcon icon={faUser} className=" ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
}
