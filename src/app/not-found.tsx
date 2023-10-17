import Link from "next/link";

export default function NotFound() {
  return (
    <main className="text-center h-[calc(100vh-64px)] flex items-center justify-center">
      <section className="flex flex-col gap-8 dark:text-[#FFFF]">
        <div className="text-9xl">🏝️</div>
        <p className="text-3xl font-bold">Ups! Creo que te perdiste</p>
        <p>
          Regresar a{" "}
          <Link className=" text-blue-600" href={"/"}>
            Proveedores
          </Link>{" "}
          🔙
        </p>
      </section>
    </main>
  );
}
