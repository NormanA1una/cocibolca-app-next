"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";

const mySwal = withReactContent(Swal);

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

const createProduct = async (formData: ProductForm) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/product-supplier",
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error creating product:", error);
    throw error;
  }
};

export default function AddProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [dataSupplier, setDataSupplier] = useState<SupplierForm[]>([]);
  const { register, handleSubmit, reset, control } = useForm<ProductForm>();
  const router = useRouter();

  useEffect(() => {
    getSupplier()
      .then((dataSuppliers) => {
        setDataSupplier(dataSuppliers);
      })
      .catch((error) => {
        console.log("Error en guardar la data:", error);
        throw error;
      });
  }, []);

  const onSubmit = async (data: ProductForm) => {
    try {
      setIsLoading(true);
      mySwal.fire({
        title: "Añadiendo producto...",
        didOpen: () => {
          mySwal.showLoading();
        },
        allowOutsideClick: false,
      });

      if (typeof data.fechaDeInventario === "number") {
        const formatedDate = new Date(data.fechaDeInventario);
        data.fechaDeInventario = formatedDate;
      }

      await createProduct(data);
      mySwal
        .fire({
          title: "Producto añadido con exito!",
          icon: "success",
        })
        .then((resp) => {
          if (resp.value) {
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

        <section className="flex flex-col md:flex-row">
          <div className="mb-6">
            <label
              htmlFor="nombreProducto"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white max-w-[338px]"
            >
              Nombre del Producto
            </label>
            <input
              type="text"
              id="nombreProducto"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-[429px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              placeholder="Nombre del producto"
              required
              {...register("nombreProducto")}
            />
          </div>
          <span className="flex-1"></span>

          <div className="mb-6">
            <label
              htmlFor="nombreSupplier"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white "
            >
              Proveedor
            </label>
            <div className="mt-1 flex items-center min-w-[338px] md:min-w-[157px]">
              <Controller
                name="nombreSupplier"
                control={control}
                render={({ field }) => (
                  <Select
                    id="nombreSupplier"
                    defaultValue={"-"}
                    style={{ width: "100%", height: 42 }}
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
          </div>
        </section>

        <section className="flex flex-col md:flex-row">
          <div className="mb-6 md:mr-10 max-w-[338px]">
            <label
              htmlFor="cantidadAMano"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Cantidad a mano
            </label>
            <input
              type="number"
              id="cantidadAMano"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-[150px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
              required
              {...register("cantidadAMano")}
            />
          </div>

          <div className="mb-6 max-w-[338px]">
            <label
              htmlFor="cantidadContada"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Cantidad contada
            </label>
            <input
              type="number"
              id="cantidadContada"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-[150px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
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
                <div className="flex items-center">
                  <label className="text-sm">Fecha de Inventario</label>

                  <DatePicker
                    className="ml-12 md:ml-2"
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

        <div className="my-6 max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center">
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
