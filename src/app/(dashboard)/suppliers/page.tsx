"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal);

const getSuppliers = async () => {
  try {
    const response = await axios.get("http://localhost:8000/supplier");

    return response.data.reverse();
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

const deleteSupplier = async (id: number) => {
  try {
    const response = await axios.delete(`http://localhost:8000/supplier/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

export default function Suppliers() {
  const [data, setData] = useState<SupplierForm[] | null>(null);

  useEffect(() => {
    getSuppliers()
      .then((responseData) => {
        setData(responseData);
      })
      .catch((error) => {
        console.log("Error en guardar la data:", error);
        throw error;
      });
  }, []);

  const handleDelete = (supplierId: number, index: number) => {
    try {
      deleteSupplier(supplierId).then(() => {
        const updateData = [...(data as SupplierForm[])];
        updateData.splice(index, 1);
        setData(updateData);

        mySwal.fire({
          title: "Proveedor eliminado",
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

  const updateSupplier = async (formData: SupplierForm) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/supplier/${formData.id}`,
        formData
      );
      return response.data;
    } catch (error) {
      console.log("Error updating supplier:", error);
      throw error;
    }
  };

  const cambiarEstado = (dataUpdate: SupplierForm) => {
    mySwal
      .fire({
        title: "Estado del Proveedor",
        text: `Quieres cambiar el estado de ${dataUpdate.nombreProveedor} a ${
          !dataUpdate.estado ? "Activo" : "Inactivo"
        }`,
        icon: "warning",
        showConfirmButton: true,
        showCancelButton: true,
      })
      .then((res) => {
        if (res.value) {
          dataUpdate.estado = !dataUpdate.estado;
          updateSupplier(dataUpdate).then(() => {
            const updateData = [...(data as SupplierForm[])];
            setData(updateData);
          });
          mySwal.fire({
            text: "Información actualizada correctamente!",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            timerProgressBar: true,
          });
        }
      });
  };

  return (
    <div className="flex flex-col flex-1 justify-center p-4 border border-dashed">
      <div className="animate__animated animate__fadeIn flex justify-end">
        <Link href={"/add-supplier"}>
          <button
            type="button"
            className=" bg-slate-800 hover:bg-gray-900 text-neutral-50 p-3 rounded-md w-[200px]"
          >
            Agregar proveedor
          </button>
        </Link>
      </div>

      <div className={`${data ? "relative overflow-x-auto mt-8" : "hidden"}`}>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-neutral-50 uppercase bg-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre del Proveedor
              </th>
              <th scope="col" className="px-6 py-3">
                Tipo del Producto
              </th>
              <th scope="col" className="px-6 py-3">
                Estado
              </th>
              <th scope="col" className="px-6 py-3">
                Logo
              </th>
              <th scope="col" className="px-6 py-3">
                Herramientas
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((data, i) => (
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
                <td className="px-6 py-4">{data.nombreProveedor}</td>
                <td className="px-6 py-4">{data.tipoDeProducto}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => cambiarEstado(data)}
                    type="button"
                    className={`${
                      data.estado
                        ? "bg-green-600 p-2 text-neutral-50 rounded-md w-[200px]"
                        : "bg-red-600 p-2 text-neutral-50 rounded-md w-[200px]"
                    }`}
                  >
                    {" "}
                    {data.estado ? "Activo" : "Inactivo"}{" "}
                  </button>
                </td>
                <td className="px-6 py-4">
                  {data.logo ? (
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
                  <div className="flex justify-center">
                    <Link href={`/add-supplier/${data.id}`}>
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

                    <button
                      onClick={() => {
                        mySwal
                          .fire({
                            title: "SE ELIMINARA UN PROVEEDOR",
                            text: `Estas seguro que quieres eliminar a ${data.nombreProveedor}`,
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
