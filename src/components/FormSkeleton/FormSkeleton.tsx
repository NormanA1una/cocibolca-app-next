import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControlLabel, Switch } from "@mui/material";
import { Progress } from "antd";
import Image from "next/image";

export default function FormSkeleton() {
  return (
    <>
      <div className="w-full max-w-[700px] mx-auto text-right mb-4">
        <div className="flex justify-end">
          <button
            type="button"
            className=" bg-red-600 rounded-md p-2 h-[40px] text-neutralWhite w-[100px] flex items-center"
          >
            <div className="bg-gray-300 rounded-full dark:bg-gray-600 w-24 h-2.5"></div>
          </button>
        </div>
      </div>
      <form className="animate__animated animate__fadeIn bg-neutralWhite border-opacity-50 rounded p-5 w-full max-w-[700px] mx-auto shadow-sm h-screen md:h-[750px]">
        <div className="w-full">
          <h1 className="bg-gray-300 rounded-full dark:bg-gray-600 w-[220px] h-[36px] my-8 mx-auto"></h1>
        </div>

        <div className="mb-6">
          <label
            htmlFor="nombreProveedor"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            <div className="bg-gray-300 rounded-full dark:bg-gray-600 w-[220px] h-4"></div>
          </label>
          <input
            type="text"
            id="nombreProveedor"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="tipoDeProducto"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            <div className="bg-gray-300 rounded-full dark:bg-gray-600 w-[220px] h-4"></div>
          </label>
          <input
            type="text"
            id="tipoDeProducto"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
            required
          />
        </div>

        <div className="mb-6 flex justify-end items-center">
          <div className="bg-gray-300 rounded-full dark:bg-gray-600 w-[220px] h-2.5"></div>
          <FormControlLabel
            control={
              <Switch
                inputProps={{ type: "checkbox", role: "switch" }}
                color="success"
                size="medium"
              />
            }
            label=""
            labelPlacement="start"
          />
        </div>

        <div className="mb-10">
          <label
            htmlFor="logo"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Logo del Proveedor
          </label>

          <Image
            src="/noImageFix.jpg"
            alt="No image png"
            width={150}
            height={150}
            className=""
          />

          <div className="bg-gray-300 rounded-full dark:bg-gray-600 w-full h-[8px] my-[14px]"></div>

          <div className="flex">
            <input type="file" />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="text-white bg-blue-700 h-[40px] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <div className="bg-gray-300 rounded-full dark:bg-gray-600 w-full h-2.5"></div>
          </button>
        </div>
      </form>
    </>
  );
}
