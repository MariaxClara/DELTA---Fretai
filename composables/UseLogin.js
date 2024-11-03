// UseLogin.js (composable)
import { ref } from 'vue'

export default function useLogin() {
  const formData = ref({
    email: '',
    password: ''
  })

  const showPasswordReset = ref(false)

  const handleSubmit = async () => {
    try {
      const response = await loginUser(formData.value.email, formData.value.password)
      if (response.status === 'success') {
        console.log('Login bem-sucedido:', response.user)
      } else {
        console.log('Credenciais inválidas')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error.message)
    }
  }

  const onPasswordChanged = () => {
    console.log('Senha alterada com sucesso')
  }

  return {
    formData,
    handleSubmit,
    showPasswordReset,
    onPasswordChanged,
  }
}

// Função para realizar login via API
async function loginUser(email, password) {
  const response = await fetch('/api/login_api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
  return await response.json()
}
