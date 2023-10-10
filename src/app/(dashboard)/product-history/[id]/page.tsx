"use client";

import NoDataSuppliers from "@/components/NoDataSuppliers/NoDataSuppliers";
import TableSkeleton from "@/components/TableSkeleton/TableSkeleton";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "antd";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const useFetchData = ({ id }: { id: string }) => {
  const [data, setData] = useState<ProductHistoryForm[]>([]);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const getProductHistory = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/product-history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      return response.data.reverse();
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (session?.user) {
      sessionStorage.setItem("accessToken", session.user.accesToken);
    }
    getProductHistory()
      .then((responseData) => {
        setData(responseData);
        if (!responseData.length) {
          setDataNotFound(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error en guardar la data:", error);
        // throw error;
      });
  }, []);

  return { data, loading, dataNotFound };
};

export default function ProductHistory({ params }: ProductHistoryProps) {
  const { data, loading, dataNotFound } = useFetchData({ id: params.id });

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemPerPage] = useState<number>(5);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col flex-1 p-4 pt-20">
      <div className="text-right mb-4">
        <Link href={"/product"}>
          <button
            type="button"
            className=" bg-red-600 rounded-md p-2 text-neutralWhite w-[100px]"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-neutralWhite mr-1"
            />{" "}
            Volver
          </button>
        </Link>
      </div>

      <input
        type="text"
        className="w-[380px] md:hidden rounded-lg"
        placeholder="Producto...                                                      🔍"
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        type="text"
        className="w-[300px] rounded-lg hidden md:block"
        placeholder="Producto...                                      🔍"
        onChange={(e) => setSearch(e.target.value)}
      />

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
                Fecha de Inventario
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre del Proveedor
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
                    <td className="px-6 py-4">
                      {formatDate(data.fechaDeInventario)}
                    </td>
                    <td className="px-6 py-4">{data.nombreSupplier}</td>
                  </tr>
                ))
              : Array.from({ length: 5 }).map((_, i) =>
                  data.length ? null : <TableSkeleton key={i} n={5} />
                )}
          </tbody>
        </table>
      </div>
      {/* Botones de paginación */}
      <div
        className={
          dataNotFound ? "hidden" : "flex justify-center items-center mt-3"
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
