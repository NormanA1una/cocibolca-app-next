"use client";

import NoDataSuppliers from "@/components/NoDataSuppliers/NoDataSuppliers";
import {
  faPenToSquare,
  faTrash,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select, message } from "antd";
import axios from "axios";
import { deleteObject, ref } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { storage } from "../../../../firebaseConfig";
import TableSkeleton from "@/components/TableSkeleton/TableSkeleton";

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
  console.log(id);

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

const deleteProductHistory = async (id: number) => {
  try {
    const response = await axios.delete(
      `http://localhost:8000/product-history/${id}`,
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(5);

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

  const handleDelete = (dataProduct: ProductForm, index: number) => {
    if (dataProduct.nombreImage) {
      const name = dataProduct.nombreImage;

      const storageRef = ref(storage, `images/product/${name}`);

      deleteObject(storageRef)
        .then(() => {
          message.success("Imagen Removida!");
        })
        .catch((error) => {
          message.error(error);
        });
    } else {
      message.error("File not found");
    }
    try {
      deleteSupplier(dataProduct.id).then(() => {
        const updateData = [...(data as ProductForm[])];
        updateData.splice(index, 1);

        setData(updateData);

        if (!updateData.length) {
          setDataNotFound(true);
        }

        deleteProductHistory(dataProduct.id);

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
  // Función para cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filtra los datos en función de la búsqueda
  const filteredData = data.filter((item) => {
    return (
      search.toLowerCase() === "" ||
      item.nombreProducto.toLowerCase().includes(search.toLowerCase()) ||
      item.nombreSupplier.toLowerCase().includes(search.toLowerCase()) ||
      formatDate(item.fechaDeInventario).includes(search.toString())
    );
  });

  // Calcula el índice inicial y final de los elementos a mostrar en la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filteredData.slice(startIndex, endIndex);

  const handleSelect = (value: number) => {
    setItemPerPage(value);
  };

  return (
    <div className="flex flex-col flex-1 p-4 pt-6 md:pt-20">
      <div className="animate__animated animate__fadeIn flex flex-col">
        {!loading ? (
          <>
            <h1 className="font-bold text-2xl mb-10">Módulo de productos</h1>
            <div className="flex justify-end">
              <Link href={"/add-product"}>
                <button
                  type="button"
                  className=" bg-gray-800 hover:bg-gray-900 text-neutralWhite p-3 rounded-md w-[200px] mb-3"
                >
                  Agregar producto
                </button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div
              role="status"
              className="w-[300px] mb-16 animate-pulse h-[15px] bg-gray-200 rounded-full dark:bg-gray-700"
            ></div>
            <div className="flex justify-end">
              <Link href={"/add-product"}>
                <button
                  type="button"
                  className=" bg-gray-800 hover:bg-gray-900 text-neutralWhite p-3 rounded-md w-[200px] mb-3"
                >
                  <div
                    role="status"
                    className="w-[170px] mx-auto animate-pulse h-[15px] bg-gray-200 rounded-full dark:bg-gray-700"
                  ></div>
                </button>
              </Link>
            </div>
          </>
        )}
      </div>

      {!loading ? (
        <input
          type="text"
          className="w-[380px] md:hidden rounded-lg"
          placeholder="Producto...                                                      🔍"
          onChange={(e) => setSearch(e.target.value)}
        />
      ) : (
        <div
          role="status"
          className="w-[380px] animate-pulse h-[15px] bg-gray-200 rounded-full dark:bg-gray-700"
        ></div>
      )}

      {!loading ? (
        <input
          type="text"
          className="w-[300px] rounded-lg hidden md:block"
          placeholder="Producto...                                      🔍"
          onChange={(e) => setSearch(e.target.value)}
        />
      ) : (
        ""
      )}

      <div className={`${"relative overflow-x-auto mt-3"} `}>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-neutralWhite uppercase bg-accentPurple">
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
              ? pageData.map((data, i) => (
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
                    <td className="px-6 py-4 ">
                      {data.presentacion ? (
                        <Image
                          className="w-auto h-auto"
                          src={data.presentacion}
                          alt={`Logo ${data.nombreProducto}`}
                          width={50}
                          height={50}
                        />
                      ) : (
                        <Image
                          src="/no-image-icon-23485.png"
                          alt="No image png"
                          width={50}
                          height={50}
                        />
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

                        <Link href={`/product-history/${data.id}`}>
                          <button
                            type="button"
                            className=" bg-gray-500 p-3 rounded-md text-neutral-50 mr-4"
                          >
                            <FontAwesomeIcon
                              icon={faClockRotateLeft}
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
                                  handleDelete(data, i);
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
                  data.length ? null : <TableSkeleton n={7} key={i} />
                )}
          </tbody>
        </table>
      </div>
      {/* Botones de paginación */}
      <div
        className={
          dataNotFound || loading
            ? "hidden"
            : "flex justify-center items-center mt-3"
        }
      >
        <Select
          placeholder="Items por página"
          style={{ width: 157, height: 42 }}
          options={[
            { value: 3, label: "3" },
            { value: 5, label: "5" },
            { value: 10, label: "10" },
            { value: 15, label: "15" },
            { value: 20, label: "20" },
          ]}
          onChange={handleSelect}
        />
        {Array.from({
          length: Math.ceil(filteredData.length / itemsPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            } p-2 mx-1 rounded`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {dataNotFound && <NoDataSuppliers text={"Productos"} />}
    </div>
  );
}
