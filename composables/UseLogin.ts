import { ref } from 'vue';
import { loginUser } from '../server/db/database';

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

type UserRole = "motorista" | "passageiro" | "desconhecido" | null;

export default function useLogin() {
  const formData = ref<FormData>({
    email: '',
    password: '',
  });

  const showPasswordReset = ref<boolean>(false);
  const userType = ref<UserRole>("desconhecido");
  const errorMessage = ref<string>('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/login_api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.value.email,
          password: formData.value.password,
        }),
      });

      const data: LoginResponse = await response.json();
      
      if (data.status === 'success') {
        console.log('Login bem-sucedido:', data.user);
        
        // Verifica se é o primeiro login
        if (data.primeiro_login) {
          alert('Você precisa alterar sua senha');
          showPasswordReset.value = true; // Exibe o pop-up para alteração de senha
        }
        
        return data.user;
      } else {
        errorMessage.value = 'Credenciais inválidas';
        console.log('Credenciais inválidas');
        return null;
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
      errorMessage.value = 'Erro ao fazer login';
      return null;
    }
  };

  const loginAndDetermineUserType = async () => {
    const user = await handleSubmit();
    if (user && user.user_id) {
      try {
        const response = await fetch('/api/user-type', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: user.user_id })
        });
        
        const data = await response.json();
        userType.value = data.userType || "desconhecido";
        console.log(`O tipo de usuário é: ${userType.value}`);
        return data.userType;
      } catch (error) {
        console.error("Erro ao determinar tipo de usuário:", error);
        return "desconhecido";
      }
    } else {
      console.log("Falha no login ou erro ao obter o user_id.");
      return "desconhecido";
    }
  };

  const handlePasswordReset = async () => {
    alert('Senha alterada com sucesso');
    console.log("Senha alterada com sucesso");
    showPasswordReset.value = false; // Fecha o pop-up
  };

  return {
    formData,
    handleSubmit,
    showPasswordReset,
    loginAndDetermineUserType,
    handlePasswordReset,
    userType,
    errorMessage,
  };
}
