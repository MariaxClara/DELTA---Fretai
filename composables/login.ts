import { ref } from 'vue'

interface FormData {
  nome: string
  sobrenome: string
}

export function useLogin() {
  const formData = ref<FormData>({
    nome: '',
    sobrenome: ''
  })

  const showPasswordReset = ref(false)
  const userId = ref<number | null>(null)

  async function handleSubmit() {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value),
      })

      const result = await response.json()

      if (result.success) {
        userId.value = result.userId
        if (result.primeiro_login) {
          showPasswordReset.value = true
        } else {
          console.log("Login bem-sucedido, redirecionando...")
        }
      } else {
        alert('Erro de login')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      alert('Erro de login. Tente novamente.')
    }
  }

  // Função para chamar quando a senha for alterada
  function onPasswordChanged() {
    alert('Senha alterada com sucesso!')
    showPasswordReset.value = false
  }

  return { formData, handleSubmit, showPasswordReset, userId, onPasswordChanged }
}
