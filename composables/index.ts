import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useIndex() {
  const showModal = ref(false)
  const router = useRouter()

  function toggleModal() {
    showModal.value = !showModal.value
  }

  return { showModal, toggleModal }
}
