import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useFormSetup() {
  // Dados do formulário
  const formData = ref({
    nome: '',
    cpf: '',
    telefone: '',
    modelo_veiculo: '',
    placa_veiculo: '',
    email: '',
    senha: '',
  });

  const confirmationMessage = ref(null);
  const errorMessage = ref(null);


  const handleSubmit = async () => {
    confirmationMessage.value = null;
    errorMessage.value = null;

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/cadastroMotorista`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value),
      });

      if (response.ok) {
        confirmationMessage.value = 'Cadastro enviado para aprovação com sucesso!';
        router.push("/Login");
      } else {
        const errorData = await response.json();
        errorMessage.value = errorData.error || 'Erro ao enviar o cadastro.';
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      errorMessage.value = 'Erro ao conectar ao servidor. Tente novamente mais tarde.';
    }
  };

  return { formData, handleSubmit, confirmationMessage, errorMessage };

}
