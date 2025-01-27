import { ref } from 'vue';

export function useFormSetup() {
  const formData = ref({
    nome: '',
    cpf: '',
    telefone: '',
    modelo_veiculo: '',
    placa_veiculo: '',
    email: '',
    senha: ''
  });

  const confirmationMessage = ref(null);

  const handleSubmit = async () => {
    confirmationMessage.value = null; // Resetar mensagem de confirmação
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL_BACKEND}/cadastroMotorista`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value),
      });

      if (response.ok) {
        confirmationMessage.value = 'Cadastro realizado com sucesso!';
      } else {
        const errorData = await response.json();
        confirmationMessage.value = errorData.error || 'Erro ao realizar o cadastro.';
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
      confirmationMessage.value = 'Erro ao conectar ao servidor.';
    }
  };

  return { formData, handleSubmit, confirmationMessage };
}
