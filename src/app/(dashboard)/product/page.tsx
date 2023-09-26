"use client";

import NoDataSuppliers from "@/components/NoDataSuppliers/NoDataSuppliers";
import {
  faPenToSquare,
  faTrash,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal);

const getProduct = async () => {
  try {
    const response = await axios.get("http://localhost:8000/product-supplier", {
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

const deleteSupplier = async (id: number) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/product-supplier/${id}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

export default function Product() {
  const [data, setData] = useState<ProductForm[]>([]);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct()
      .then((responseData) => {
        console.log();

        setData(responseData);
        if (!responseData.length) {
          setDataNotFound(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error en guardar la data:", error);
        throw error;
      });
  }, []);

  const handleDelete = (supplierId: number, index: number) => {
    try {
      deleteSupplier(supplierId).then(() => {
        const updateData = [...(data as ProductForm[])];
        updateData.splice(index, 1);

        setData(updateData);

        if (!updateData.length) {
          setDataNotFound(true);
        }

        mySwal.fire({
          title: "Producto eliminado",
          icon: "success",
          showConfirmButton: false,
          timer: 1500, // Cierra automáticamente después de 1.5 segundos
        });
      });
    } catch (error) {
      console.log("Error deleting supplier:", error);
      throw error;
    }
  };

  const formatDate = (fechaDeInventario: Date) => {
    if (!fechaDeInventario) {
      return ""; // Devuelve una cadena vacía si la fecha es falsy (por ejemplo, undefined o null)
    }

    const date = new Date(fechaDeInventario);

    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Agrega ceros a la izquierda si es necesario
      const day = date.getDate().toString().padStart(2, "0"); // Agrega ceros a la izquierda si es necesario

      return `${day}-${month}-${year}`;
    } else {
      console.log("Fecha inválida:", fechaDeInventario);
      return ""; // Devuelve una cadena vacía si la fecha no es válida
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 border border-dashed pt-20">
      <div className="animate__animated animate__fadeIn flex flex-col">
        <h1 className="font-bold text-2xl mb-16">Módulo de productos</h1>
        <div className="flex justify-end">
          <Link href={"/add-product"}>
            <button
              type="button"
              className=" bg-slate-800 hover:bg-gray-900 text-neutral-50 p-3 rounded-md w-[200px]"
            >
              Agregar producto
            </button>
          </Link>
        </div>
      </div>

      <div className={`${"relative overflow-x-auto mt-8"} `}>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-neutral-50 uppercase bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre del Producto
              </th>
              <th scope="col" className="px-6 py-3">
                Cantidad a Mano
              </th>
              <th scope="col" className="px-6 py-3">
                Cantidad Contada
              </th>
              <th scope="col" className="px-6 py-3">
                Presentación
              </th>
              <th scope="col" className="px-6 py-3">
                Fecha de Inventario
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre del Proveedor
              </th>
              <th scope="col" className="px-6 py-3">
                Herramientas
              </th>
            </tr>
          </thead>
          <tbody className="min-h-[415px]">
            {!loading
              ? data?.map((data, i) => (
                  <tr
                    key={data.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {data.id}
                    </th>
                    <td className="px-6 py-4">{data.nombreProducto}</td>
                    <td className="px-6 py-4">{data.cantidadAMano}</td>
                    <td className="px-6 py-4">{data.cantidadContada}</td>
                    <td className="px-6 py-4">
                      {data.presentacion ? (
                        "Hay algo"
                      ) : (
                        <Image
                          src="/no-image-icon-23485.png"
                          alt="No image png"
                          width={50}
                          height={50}
                        ></Image>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(data.fechaDeInventario)}
                    </td>
                    <td className="px-6 py-4">{data.nombreSupplier}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Link href={`/add-product/${data.id}`}>
                          <button
                            type="button"
                            className=" bg-blue-700 p-3 rounded-md text-neutral-50 mr-4"
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              style={{ color: "#ffffff" }}
                            />
                          </button>
                        </Link>

                        <Link href={`/product-history`}>
                          <button
                            type="button"
                            className=" bg-slate-500 p-3 rounded-md text-neutral-50 mr-4"
                          >
                            <FontAwesomeIcon
                              icon={faList}
                              style={{ color: "#ffffff" }}
                            />
                          </button>
                        </Link>

                        <button
                          onClick={() => {
                            mySwal
                              .fire({
                                title: "SE ELIMINARA UN PROVEEDOR",
                                text: `Estas seguro que quieres eliminar a ${data.nombreProducto}`,
                                icon: "warning",
                                showConfirmButton: true,
                                showCancelButton: true,
                              })
                              .then((res) => {
                                if (res.value) {
                                  handleDelete(data.id, i);
                                }
                              });
                          }}
                          type="button"
                          className=" bg-red-700 p-3 rounded-md text-neutral-50"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ color: "#ffffff" }}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : Array.from({ length: 5 }).map((_, i) =>
                  data.length ? null : <TableSkeleton key={i} />
                )}
          </tbody>
        </table>
      </div>

      {dataNotFound && <NoDataSuppliers />}
    </div>
  );
}

const TableSkeleton = () => {
  return (
    <>
      <tr
        role="status"
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 animate-pulse"
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        </th>
        <td className="px-6 py-4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        </td>
        <td className="px-6 py-4">
          <Image
            src="/no-image-icon-23485.png"
            alt="No image png"
            width={50}
            height={50}
          ></Image>
        </td>
        <td className="px-6 py-4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        </td>
        <td className="px-6 py-4">
          <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
        </td>
        <td className="px-6 py-4">
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-blue-700 p-3 rounded-md text-neutral-50 mr-4 w-[38px] h-[44px]"
              disabled={true}
            >
              <FontAwesomeIcon
                icon={faPenToSquare}
                style={{ color: "#ffffff" }}
              />
            </button>

            <button
              type="button"
              className="bg-red-700 p-3 rounded-md text-neutral-50 w-[36.25px] h-[44px]"
              disabled={true}
            >
              <FontAwesomeIcon icon={faTrash} style={{ color: "#ffffff" }} />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};
