type LoginForm = {
  username: string;
  password: string;
  remember: boolean;
};

type SignInForm = {
  id: number;
  correo: string;
  username: string;
  password: string;
  remember: boolean;
  roles: string;
};

type SupplierForm = {
  id: number;
  nombreProveedor: string;
  tipoDeProducto: string;
  estado: boolean;
  logo: string;
  nombreImage: string;
};

type ProductForm = {
  id: number;
  nombreProducto: string;
  cantidadAMano: number;
  cantidadContada: number;
  presentacion: string;
  fechaDeInventario: Date;
  nombreSupplier: string;
  nombreImage: string;
};

type ProductHistoryForm = {
  id: number;
  nombreProducto: string;
  cantidadAMano: number;
  cantidadContada: number;
  fechaDeInventario: Date;
  nombreSupplier: string;
};

type UserData = {
  id: number;
  correo: string;
  username: string;
  roles: string;
};

type Params = {
  params: {
    id: string;
  };
};

type NavLinksTypes = {
  name: string;
  pathname: string;
  icon: IconType;
};

type DataPagination = {
  selected: number;
};

type ProductHistoryProps = {
  params: {
    id: string;
  };
};

type CloseNavFunction = (isOpen: boolean) => void;
