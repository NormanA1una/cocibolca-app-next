type LoginForm = {
  username: string;
  password: string;
  remember: boolean;
};

type SignInForm = {
  email: string;
  username: string;
  password: string;
  remember: boolean;
  role: string;
};

type CloseNavFunction = (isOpen: boolean) => void;
