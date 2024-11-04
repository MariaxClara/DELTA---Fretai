import { ref } from 'vue';

interface FormData {
  email: string;
  password: string;
}

interface LoginResponse {
  status: string;
  user?: any;
  message?: string;
  primeiro_login?: boolean;
}

const formData = ref<FormData>({
  email: '',
  password: '',
});
const newPassword = ref('');
const showPasswordReset = ref<boolean>(false);

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

// Função principal de login
async function handleSubmit() {
  try {
    const response: LoginResponse = await loginUser(formData.value.email, formData.value.password);
    
    if (response.status === 'success') {
      console.log('Login bem-sucedido:', response.user);
      alert('Login bem-sucedido!');

      // Verifica se é o primeiro login
      if (response.user.primeiro_login) {
        alert('Você precisa alterar sua senha');
        showPasswordReset.value = true; // Exibe o pop-up para alteração de senha
      }
    } else {
      console.log('Credenciais inválidas');
    }
  } catch (error: any) {
    console.error('Erro ao fazer login:', error.message);
  }
}

// Função para lidar com a redefinição de senha
async function handlePasswordReset() {
  alert('Senha alterada com sucesso');
  console.log("Senha alterada com sucesso");
  showPasswordReset.value = false; // Fecha o pop-up
}

// Exporta as variáveis e funções para uso no componente
export default function useLogin() {
  return {
    formData,
    handleSubmit,
    showPasswordReset,
    handlePasswordReset,
  };
}
