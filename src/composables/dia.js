import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const {VITE_BASE_URL_BACKEND} = import.meta.env 

export function useTransportOptions() {
  const route = useRoute();
  const router = useRouter();
  const options = ['Eu vou!', 'Eu NÃO vou!', 'Apenas ida!', 'Apenas volta!'];
  const selectedOption = ref('');

  const selectOption = (option) => {
    selectedOption.value = option;
  };

  const confirmSelection = (dia, mes, ano, rota, user) => {
    //alert(`Você selecionou: ${selectedOption.value || 'nenhuma opção'}`);
    console.log(dia, mes, ano, rota, user, selectedOption.value)
    let ida, volta;
    switch (selectedOption.value){
      case 'Eu vou!':
        ida = 1;
        volta = 1;
        break;
      
      case 'Eu NÃO vou!':
        ida = 0;
        volta = 0;
        break;
      
      case 'Apenas ida!':
        ida = 1;
        volta = 0;
        break;
      
      case 'Apenas volta!':
        ida = 0;
        volta = 1;
        break;
      
      default:
        console.log("Erro de opção");
        return;
        
    }
    addViagem(dia, mes, ano, rota, user, ida, volta)
  };

  async function addViagem(dia, mes, ano, rota, user, ida, volta) {
    try {
        console.log(JSON.stringify({
          user__id: user,
          rotas_id: rota,
          ida: ida,
          volta: volta,
          year: ano,
          month: mes,
          day: dia
          }));
        const response = await fetch(`${VITE_BASE_URL_BACKEND}/setCalendario`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user__id: user,
                rotas_id: rota,
                ida: ida,
                volta: volta,
                year: ano,
                month: mes,
                day: dia
                }),
        })
        console.log("Banco atualizado")
        console.log(response)
                
    } catch (error) {
        console.log(error)
    }
  }

  return {
    options,
    selectedOption,
    selectOption,
    confirmSelection
  };
}
