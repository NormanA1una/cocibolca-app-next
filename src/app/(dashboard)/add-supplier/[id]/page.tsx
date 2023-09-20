"use client";

import { FormControlLabel, Switch } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal);

export default function ProductDetail({ params: { id } }: Params) {
  const [data, setData] = useState<SupplierForm | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupplierActive, setIsSupplierActive] = useState(false);
  const { register, handleSubmit, reset, control } = useForm<SupplierForm>({
    defaultValues: async () => getSupplier(),
  });

  const router = useRouter();

  const getSupplier = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/supplier/${id}`);
      return response.data;
    } catch (error) {
      console.log("Error geting a one supplier:", error);
      throw error;
    }
  };

  useEffect(() => {
    getSupplier()
      .then((responseData) => {
        setData(responseData);
        setIsSupplierActive(responseData.estado);
      })
      .catch((error) => {
        console.log("Error in setData:", error);
        throw error;
      });
  }, []);

  const updateSupplier = async (formData: SupplierForm) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/supplier/${id}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.log("Error updating supplier:", error);
      throw error;
    }
  };

  const onSubmit = async (data: SupplierForm) => {
    try {
      setIsLoading(true);
      mySwal.fire({
        title: "Actualizando proveedor...",
        didOpen: () => {
          mySwal.showLoading();
        },
        allowOutsideClick: false,
      });
      console.log("DATA", data);

      await updateSupplier(data);
      mySwal
        .fire({
          title: "Usuario actualizado con exito!",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        })
        .then((resp) => {
          if (resp.dismiss) {
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
  console.log("IS SUPPLIER ACTIVE", isSupplierActive);

  return (
    <div className="flex flex-col flex-1 justify-center p-4 border border-dashed my-auto">
      <form
        className="animate__animated animate__fadeIn bg-neutral-50 border-opacity-50 rounded p-5 w-full max-w-[700px] mx-auto shadow-sm h-screen md:h-[550px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center font-bold text-3xl my-8">
          Actualizar proveedor
        </h1>
        <div className="mb-6">
          <label
            htmlFor="id"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            ID
          </label>
          <input
            type="number"
            id="id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            placeholder="Generado por la base de datos!"
            disabled
            {...register("id")}
          />
        </div>

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
          <Controller
            name="estado"
            control={control}
            defaultValue={isSupplierActive}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={isSupplierActive}
                    inputProps={{ type: "checkbox", role: "switch" }}
                    color="success"
                    size="medium"
                    onChange={(e) => {
                      field.onChange(e);
                      onCheck(e);
                    }}
                  />
                }
                label={`Estado del proveedor: ${
                  isSupplierActive ? "Activo" : "Inactivo"
                }`}
                labelPlacement="start"
              />
            )}
          />
          {/* <input
            type="checkbox"
            {...register("estado", {
              onChange: (e) => {
                onCheck(e);
              },
            })}
            className="mr-4"
          />
          <button
            className={`${
              isSupplierActive
                ? "bg-green-600 p-2 text-neutral-50 rounded-md w-[200px]"
                : "bg-red-600 p-2 text-neutral-50 rounded-md w-[200px]"
            }`}
            type="button"
            disabled
          >
            {isSupplierActive ? "Activo" : "Inactivo"}
          </button> */}
        </div>

        <div className=" text-center">
          <button
            disabled={isLoading}
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isLoading ? "Actualizando..." : "Actualizar proveedor"}
          </button>
        </div>
      </form>
    </div>
  );
}
