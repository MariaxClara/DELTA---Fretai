import { ref } from 'vue'

export function useFormSetup() {
  const formData = ref<FormData>({
    nome: '',
    sobrenome: '',
    cpf: '',
    placa: '',
    email: '',
    senha: ''
  })
  
  const confirmationMessage = ref(null)
  
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData.value)
      })

      if (response.ok) {
        console.log('E-mail enviado com sucesso!')
        confirmationMessage.value = 'Cadastro solicitado, por favor aguarde receber sua senha temporária no email!'
      } else {
        console.error('Erro ao enviar o e-mail')
        confirmationMessage.value = 'Houve um erro ao solicitar o cadastro!'
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      confirmationMessage.value = 'Erro ao enviar os dados, tente novamente mais tarde.!'
    }
  }

  return { formData, handleSubmit, confirmationMessage }
}
