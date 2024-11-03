// UseLogin.ts (composable)
import { ref } from 'vue';

interface FormData {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  user?: any;
  message?: string;
}

export default function useLogin() {
  const formData = ref<FormData>({
    email: '',
    password: '',
  });

  const showPasswordReset = ref<boolean>(false);

  const handleSubmit = async () => {
    try {
      const response: LoginResponse = await loginUser(formData.value.email, formData.value.password);
      if (response.status === 'success') {
        console.log('Login bem-sucedido:', response.user);
      } else {
        console.log('Credenciais inválidas');
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
    }
  };

  const onPasswordChanged = () => {
    console.log('Senha alterada com sucesso');
  };

  return {
    formData,
    handleSubmit,
    showPasswordReset,
    onPasswordChanged,
  };
}

// Função para realizar login via API
async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch('/api/login_api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return await response.json();
}
