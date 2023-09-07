export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/supplier",
    "/add-supplier",
    "/product",
    "/add-product",
    "/product-history",
    "user-list",
  ],
};
