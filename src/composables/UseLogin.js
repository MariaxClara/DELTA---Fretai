import { ref } from 'vue';

export default function useLogin() {
  const formData = ref({
    email: '',
    password: '',
  });
  const {VITE_BASE_URL_BACKEND} = import.meta.env 

  const showPasswordReset = ref(false);
  const userType = ref("desconhecido");
  const errorMessage = ref('');

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
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/user-type`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: user.user_id }),
        });
  
        const data = await response.json();
        userType.value = data.userType || 'desconhecido';
        console.log(`O tipo de usuário é: ${userType.value}`);
        return data.userType;
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
