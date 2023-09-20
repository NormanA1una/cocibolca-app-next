export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/suppliers",
    "/add-supplier",
    "/product",
    "/add-product",
    "/product-history",
    "/user-list",
  ],
};
