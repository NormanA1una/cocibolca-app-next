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

type CloseNavFunction = (isOpen: boolean) => void;
