"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NoDataSuppliers from "@/components/NoDataSuppliers/NoDataSuppliers";
import { FormControlLabel, Switch } from "@mui/material";
import { useSession } from "next-auth/react";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import { message } from "antd";

const mySwal = withReactContent(Swal);

export default function Suppliers() {
  const [data, setData] = useState<SupplierForm[]>([]);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const getSuppliers = async () => {
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

  const deleteSupplier = async (id: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/supplier/${id}`,
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

  useEffect(() => {
    if (session?.user) {
      sessionStorage.setItem("accessToken", session.user.accesToken);
    }
    getSuppliers()
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

  const handleDelete = (dataSupplier: SupplierForm, index: number) => {
    if (dataSupplier.nombreImage) {
      const name = dataSupplier.nombreImage;

      const storageRef = ref(storage, `images/${name}`);

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
      deleteSupplier(dataSupplier.id).then(() => {
        const updateData = [...(data as SupplierForm[])];
        updateData.splice(index, 1);

        setData(updateData);

        if (!updateData.length) {
          setDataNotFound(true);
        }

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
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
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
    <div className="flex flex-col flex-1 p-4 pt-20">
      <div className="animate__animated animate__fadeIn flex flex-col">
        <h1 className="font-bold text-2xl mb-16">Módulo de proveedores</h1>
        <div className="flex justify-end">
          <Link href={"/add-supplier"}>
            <button
              type="button"
              className=" bg-gray-800 hover:bg-gray-900 text-neutralWhite p-3 rounded-md w-[200px]"
            >
              Agregar proveedor
            </button>
          </Link>
        </div>
      </div>

      <div className={`${"relative overflow-x-auto mt-8"} `}>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-neutralWhite uppercase bg-accentPurple">
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
                    <td className="px-6 py-4">{data.nombreProveedor}</td>
                    <td className="px-6 py-4">{data.tipoDeProducto}</td>
                    <td className="px-6 py-4">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={data.estado}
                            inputProps={{ type: "checkbox", role: "switch" }}
                            color="success"
                            size="medium"
                            onClick={() => cambiarEstado(data)}
                          />
                        }
                        label={`${data.estado ? "Activo" : "Inactivo"}`}
                        labelPlacement="start"
                      />
                    </td>
                    <td className="px-6 py-4">
                      {data.logo ? (
                        <Image
                          src={data.logo}
                          alt={`Logo ${data.nombreProveedor}`}
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
          <button
            type="button"
            className={"bg-red-600 p-2 text-neutral-50 rounded-md w-[200px]"}
            disabled={true}
          >
            Estado
          </button>
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
