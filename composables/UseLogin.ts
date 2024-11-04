// UseLogin.ts
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

      const data = await response.json();
      
      if (data.status === 'success') {
        console.log('Login bem-sucedido:', data.user);
        return data.user;
      } else {
        console.log('Credenciais inválidas');
        return null;
      }
    } catch (error: any) {
      console.error('Erro ao fazer login:', error.message);
      return null;
    }
  };

  async function loginAndDetermineUserType() {
    const user = await handleSubmit();
    if (user && user.user_id) {
      try {
        // Call the user-type API endpoint
        const response = await fetch('/api/user-type', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: user.user_id })
        });
        
        const data = await response.json();
        userType.value = data.userType;
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
  }

  return {
    formData,
    handleSubmit,
    showPasswordReset,
    loginAndDetermineUserType,
    userType,
    errorMessage,
  };
}
