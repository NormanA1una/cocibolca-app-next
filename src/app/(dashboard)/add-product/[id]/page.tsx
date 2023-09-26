"use client";

import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal);

export default function ProductDetail({ params: { id } }: Params) {
  const [dataProduct, setDataProduct] = useState<ProductForm | null>(null);
  const [dataSupplier, setDataSupplier] = useState<SupplierForm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupplierActive, setIsSupplierActive] = useState(false);
  const { register, handleSubmit, reset, control, setValue } =
    useForm<ProductForm>({
      defaultValues: async () => getProduct(),
    });

  const router = useRouter();

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/product-supplier/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Error geting a one supplier:", error);
      throw error;
    }
  };
  const getSupplier = async () => {
    try {
      const response = await axios.get("http://localhost:8000/supplier", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });

      return response.data.reverse();
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    getSupplier()
      .then((dataSuppliers) => {
        setDataSupplier(dataSuppliers);
      })
      .catch((error) => {
        console.log("Error en guardar la data:", error);
        throw error;
      });

    getProduct()
      .then((responseData) => {
        setDataProduct(responseData);
        setIsSupplierActive(responseData.estado);
      })
      .catch((error) => {
        console.log("Error in setData:", error);
        throw error;
      });
  }, []);

  const onSubmit = async (data: ProductForm) => {
    try {
      setIsLoading(true);
      mySwal.fire({
        title: "Actualizando producto...",
        didOpen: () => {
          mySwal.showLoading();
        },
        allowOutsideClick: false,
      });
      console.log("DATA", data);

      if (typeof data.fechaDeInventario === "number") {
        const formatedDate = new Date(data.fechaDeInventario);
        data.fechaDeInventario = formatedDate;
      }

      await updateProduct(data);
      mySwal
        .fire({
          title: "Producto actualizado con exito!",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false,
        })
        .then((resp) => {
          if (resp.dismiss) {
            reset();
            router.push("/product");
          }
        });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("Error in submit data:", error);
    }
  };

  const updateProduct = async (formData: ProductForm) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/product-supplier/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log("Error updating supplier:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-center p-4 border border-dashed">
      <div className="w-full max-w-[700px] mx-auto text-right mb-4">
        <Link href={"/product"}>
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
          Añadir nuevo producto
        </h1>

        <section className="flex">
          <div className="mb-6 mr-4">
            <label
              htmlFor="id"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              ID
            </label>
            <input
              type="text"
              id="id"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[100px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              placeholder="Nombre del producto"
              required
              disabled
              {...register("id")}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="nombreProducto"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nombre del Producto
            </label>
            <input
              type="text"
              id="nombreProducto"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[329px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              placeholder="Nombre del producto"
              required
              {...register("nombreProducto")}
            />
          </div>

          <span className="flex-1"></span>

          <div className="mt-1 flex items-center">
            <Controller
              name="nombreSupplier"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder={dataProduct?.nombreSupplier}
                  style={{ width: 157, height: 42 }}
                  onChange={(data) => {
                    field.onChange(data ? data.valueOf() : null);
                  }}
                  options={dataSupplier.map((data) => ({
                    value: data.nombreProveedor,
                    label: data.nombreProveedor,
                  }))}
                ></Select>
              )}
            />
          </div>
        </section>

        <section className="flex">
          <div className="mb-6 mr-10">
            <label
              htmlFor="cantidadAMano"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Cantidad a mano
            </label>
            <input
              type="number"
              id="cantidadAMano"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[150px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              required
              {...register("cantidadAMano")}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="cantidadContada"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Cantidad contada
            </label>
            <input
              type="number"
              id="cantidadContada"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[150px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              required
              {...register("cantidadContada")}
            />
          </div>

          <span className="flex-1"></span>

          <div className="flex my-auto">
            <Controller
              name="fechaDeInventario"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <label className="text-sm">Fecha de Inventario</label>
                  <DatePicker
                    className="ml-2"
                    format={"YYYY/MM/DD"}
                    style={{ height: 42, width: 157 }}
                    status={fieldState.error ? "error" : undefined}
                    ref={field.ref}
                    name={field.name}
                    onBlur={field.onBlur}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {
                      field.onChange(date ? date.valueOf() : null);
                    }}
                  ></DatePicker>
                </div>
              )}
            />
          </div>
        </section>

        <div className="mb-6">
          <label
            htmlFor="presentacion"
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
          <input
            id="presentacion"
            type="file"
            disabled
            {...register("presentacion")}
          />
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
