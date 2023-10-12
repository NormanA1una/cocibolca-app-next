"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { FormControlLabel, Switch } from "@mui/material";
import { message, Progress } from "antd";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import FormSkeleton from "@/components/FormSkeleton/FormSkeleton";

const mySwal = withReactContent(Swal);

export default function AddSupplier() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSupplierActive, setIsSupplierActive] = useState(false);
  const { register, handleSubmit, reset, control, setValue } =
    useForm<SupplierForm>();
  const [imageFile, setImageFile] = useState<File>();
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const [buttonHidden, setButtonHiden] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
  });

  const createSupplier = async (formData: SupplierForm) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/supplier",
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
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
      console.log(data);

      await createSupplier(data);
      mySwal
        .fire({
          title: "Proveedor creado con exito!",
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

  const handleSelectedFile = (files: any) => {
    if (files.target.files && files.target.files[0].size < 10000000) {
      setImageFile(files.target.files[0]);
      setButtonHiden(false);

      console.log(files.target.files[0]);
    } else {
      message.error("El tamaño de la imagen es muy grande");
    }
  };

  const handleUploadFile = () => {
    if (imageFile) {
      const name = imageFile.name;

      const storageRef = ref(storage, `images/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          message.error(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((fileUrl) => {
            setDownloadUrl(fileUrl);

            setValue("logo", fileUrl);
            setValue("nombreImage", imageFile?.name);
          });
        }
      );
    } else {
      message.error("File not found");
    }

    setIsUploading(true);
  };

  const handleRemoveFile = () => {
    if (imageFile) {
      const name = imageFile.name;

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

    setProgressUpload(0);
    setDownloadUrl("");
    setIsUploading(false);
    setButtonHiden(true);
  };

  return (
    <div className="flex flex-col flex-1 justify-center p-4 pt-8">
      {!isLoading ? (
        <>
          <div className="w-full max-w-[700px] mx-auto text-right mb-4">
            <Link href={"/suppliers"}>
              <button
                type="button"
                className=" bg-red-600 rounded-md p-2 text-neutralWhite w-[100px]"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className=" text-neutralWhite mr-1"
                />{" "}
                Volver
              </button>
            </Link>
          </div>
          <form
            className="animate__animated animate__fadeIn bg-neutralWhite border-opacity-50 rounded p-5 w-full max-w-[700px] mx-auto shadow-sm h-[900] md:h-[750px]"
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
            </div>

            <div className="mb-10">
              <label
                htmlFor="logo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Logo del Proveedor
              </label>
              {downloadUrl ? (
                <>
                  <div className="h-[150px] flex items-center">
                    <Image
                      className="h-auto max-h-[150px] w-auto max-w-[150px]"
                      src={downloadUrl}
                      width={150}
                      height={150}
                      alt="Logo del Proveedor"
                    />
                  </div>
                </>
              ) : (
                <Image
                  src="/noImageFix.jpg"
                  alt="No image png"
                  width={150}
                  height={150}
                  className="h-auto max-h-[150px] w-auto max-w-[150px]"
                />
              )}

              <Progress percent={progressUpload} />

              <div
                className={
                  isUploading
                    ? "flex justify-center"
                    : "flex flex-col md:flex-row h-[101px] md:h-auto"
                }
              >
                {isUploading ? (
                  <div className="flex">
                    <div className="flex items-center">
                      <input
                        className="p-2 rounded-md border-gray-400 "
                        type="hidden"
                        {...register("nombreImage")}
                        placeholder={imageFile?.name}
                      />
                    </div>
                    <input
                      className=" border-none"
                      type="hidden"
                      {...register("logo")}
                      placeholder={downloadUrl}
                    />
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      onChange={(files) => handleSelectedFile(files)}
                    />
                    <span className={!isUploading && "flex-1"}></span>
                  </>
                )}
                {imageFile ? (
                  <div className={isUploading ? "flex" : "flex justify-center"}>
                    <div className="">
                      <button
                        hidden={!isUploading}
                        type="button"
                        className={
                          !isUploading
                            ? "p-2 bg-red-600 rounded-lg shadow text-neutralWhite mr"
                            : "p-2 mb-[60px] md:mb-0 bg-red-600 rounded-lg shadow text-neutralWhite mr"
                        }
                        onClick={handleRemoveFile}
                      >
                        Remover Imagen
                      </button>
                    </div>

                    <div>
                      <button
                        hidden={isUploading || buttonHidden}
                        type="button"
                        className="p-2 bg-accentPurple rounded-lg shadow text-neutralWhite mr-3"
                        onClick={handleUploadFile}
                      >
                        Cargar Imagen
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
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
        </>
      ) : (
        <FormSkeleton />
      )}
    </div>
  );
}
