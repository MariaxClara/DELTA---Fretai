import { ref } from 'vue';

export default function useLogin() {
  const formData = ref({
    email: '',
    password: '',
  });
  const { VITE_BASE_URL_BACKEND } = import.meta.env;

  const showPasswordReset = ref(false);
  const userType = ref('');
  const errorMessage = ref('');

  // Função auxiliar para definir um cookie com expiração em dias
  const setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST', // Método POST para login
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
  
        // Armazena o e-mail e o id do usuário em cookies com validade de 7 dias
        setCookie('userEmail', data.user.email, 7);
        setCookie('userID', data.user.user_id, 7);
  
        // Verifica se é o primeiro login
        if (data.user.primeiro_login) {
          alert('Você precisa alterar sua senha');
          showPasswordReset.value = true; // Exibe o pop-up para alteração de senha
        }
  
        return data.user;
      } else {
        errorMessage.value = 'Credenciais inválidas';
        console.log('Credenciais inválidas');
        return null;
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      errorMessage.value = 'Erro ao fazer login';
      return null;
    }
  };
  
  const loginAndDetermineUserType = async () => {
    const user = await handleSubmit();
    if (user && user.user_id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/user-type?user_id=${encodeURIComponent(user.user_id)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Erro na resposta do servidor: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        // Ajuste para lidar com 0 e 1 retornados pelo backend
        userType.value = data.userType;
  
        return userType.value;
      } catch (error) {
        console.error('Erro ao determinar tipo de usuário:', error);
        return 'desconhecido';
      }
    } else {
      console.log('Falha no login ou erro ao obter o user_id.');
      return 'desconhecido';
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
