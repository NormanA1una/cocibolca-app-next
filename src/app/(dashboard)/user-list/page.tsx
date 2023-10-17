"use client";

import NoDataSuppliers from "@/components/NoDataSuppliers/NoDataSuppliers";
import TableSkeleton from "@/components/TableSkeleton/TableSkeleton";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal);

const getUsers = async () => {
  try {
    const response = await axios.get("http://localhost:8000/user", {
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

export default function UserList() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [dataNotFound, setDataNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    getUsers()
      .then((responseData) => {
        setUserData(responseData);
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

  const deleteUser = async (id: number) => {
    try {
      const response = await axios.delete(`http://localhost:8000/user/${id}`, {
        headers: {
          Authorization: `Bearer ${session?.user.accesToken}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting item:", error);
      mySwal.fire({
        title: "ACCIÓN DENEGADA!",
        text: "Solamente los usuarios que sean administradores pueden realizar dicha acción.",
        allowOutsideClick: false,
        timer: 5000,
        timerProgressBar: true,
        icon: "error",
      });
      throw error;
    }
  };

  const handleDelete = (userId: number, index: number) => {
    try {
      deleteUser(userId).then(() => {
        const updateData = [...(userData as UserData[])];
        updateData.splice(index, 1);

        setUserData(updateData);

        if (!updateData.length) {
          setDataNotFound(true);
        }

        mySwal.fire({
          title: "Usuario eliminado",
          icon: "success",
          showConfirmButton: false,
          timer: 1500, // Cierra automáticamente después de 1.5 segundos
        });
      });
    } catch (error) {
      console.log("Error deleting user:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col flex-1 p-4 pt-20">
      <div className="animate__animated animate__fadeIn flex flex-col">
        {!loading ? (
          <h1 className="font-bold text-2xl mb-16">
            Lista de usuarios activos
          </h1>
        ) : (
          <div
            role="status"
            className="w-[300px] mb-16 animate-pulse h-[15px] bg-gray-200 rounded-full dark:bg-gray-700"
          ></div>
        )}
      </div>

      <div className={`${"relative overflow-x-auto mt-8"} `}>
        <table className="w-full text-sm text-left text-gray-500 ">
          <thead className="text-xs text-neutralWhite uppercase bg-accentPurple">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Nombre del Usuario
              </th>
              <th scope="col" className="px-6 py-3">
                Correo
              </th>
              <th scope="col" className="px-6 py-3">
                Rol
              </th>
              <th scope="col" className="px-6 py-3">
                Herramientas
              </th>
            </tr>
          </thead>
          <tbody className="min-h-[415px]">
            {!loading
              ? userData?.map((data, i) => (
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
                    <td className="px-6 py-4">{data.username}</td>
                    <td className="px-6 py-4">{data.correo}</td>
                    <td className="px-6 py-4">{data.roles}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() => {
                            mySwal
                              .fire({
                                title: "SE ELIMINARA UN USUARIO",
                                text: `Estas seguro que quieres eliminar a ${data.username}`,
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
                          className={`${
                            data.username ===
                            sessionStorage.getItem("lobbyName")
                              ? "bg-gray-500 p-3 rounded-md text-neutral-50"
                              : "bg-red-700 p-3 rounded-md text-neutral-50"
                          } `}
                          disabled={
                            data.username ===
                            sessionStorage.getItem("lobbyName")
                          }
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
                  userData.length ? null : <TableSkeleton n={4} key={i} />
                )}
          </tbody>
        </table>
      </div>

      {dataNotFound && <NoDataSuppliers text="Usuarios" />}
    </div>
  );
}
