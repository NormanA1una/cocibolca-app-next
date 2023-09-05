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
};

type Params = {
  params: {
    id: string;
  };
};

type CloseNavFunction = (isOpen: boolean) => void;
