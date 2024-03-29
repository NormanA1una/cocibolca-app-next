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
import { DatePicker, Progress, Select, message } from "antd";
import dayjs from "dayjs";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../../firebaseConfig";
import FormSkeleton from "@/components/FormSkeleton/FormSkeleton";

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
  const [isLoading, setIsLoading] = useState(true);
  const [dataSupplier, setDataSupplier] = useState<SupplierForm[]>([]);
  const { register, handleSubmit, reset, control, setValue } =
    useForm<ProductForm>();
  const [imageFile, setImageFile] = useState<File>();
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const [buttonHidden, setButtonHiden] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsLoading(false);
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

      const storageRef = ref(storage, `images/product/${name}`);
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

            setValue("presentacion", fileUrl);
            setValue("nombreImage", imageFile?.name);
            console.log(imageFile.name);
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

    setProgressUpload(0);
    setDownloadUrl("");
    setIsUploading(false);
    setButtonHiden(true);
  };

  return (
    <div className="flex flex-col flex-1 justify-center p-4 md:pt-20">
      {!isLoading ? (
        <>
          <div className="w-full max-w-[700px] text-right md:mx-auto mb-4">
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

          <form
            className="animate__animated animate__fadeIn bg-neutralWhite border-opacity-50 rounded p-5 w-full max-w-[700px] mx-auto shadow-sm h-[950px] md:h-[680px]"
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

            <div className="mt-6 mb-5 max-[768px]:flex max-[768px]:flex-col max-[768px]:items-center">
              <label
                htmlFor="logo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Presentación del Producto
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
                  className=""
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
                      {...register("presentacion")}
                      placeholder={downloadUrl}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex w-full max-w-[323px]">
                      <input
                        type="file"
                        onChange={(files) => handleSelectedFile(files)}
                      />
                    </div>
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
                            ? "p-2 bg-red-600 rounded-lg shadow text-neutralWhite"
                            : "p-2 mb-[60px] md:mb-0 bg-red-600 rounded-lg shadow text-neutralWhite"
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
                        className="p-2 bg-accentPurple rounded-lg shadow text-neutralWhite mt-5 md:mt-0 w-[180px]"
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
                {isLoading ? "Actualizando..." : "Añadir producto"}
                <FontAwesomeIcon icon={faUser} className=" ml-2" />
              </button>
            </div>
          </form>
        </>
      ) : (
        <FormSkeleton isUpdatePage={false} />
      )}
    </div>
  );
}
