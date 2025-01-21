import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import maps from './calendario'; // Importe o maps
// const VITE_BASE_URL_BACKEND = import.meta.env.VITE_BASE_URL_BACKEND || 'http://localhost:3000'; // Fallback URL

const localData = ref([]); // Local array to store data

export function useTransportOptions() {
  const route = useRoute();
  const router = useRouter();
  const options = ['Eu vou!', 'Eu NÃO vou!', 'Apenas ida!', 'Apenas volta!'];
  const selectedOption = ref('');
  const calendar = maps(); // Crie uma instância do maps

  const selectOption = (option) => {
    selectedOption.value = option;
  };

  const confirmSelection = async (dia, mes, ano, rota, user) => {
    if (!selectedOption.value) {
      alert('Por favor, selecione uma opção!');
      return;
    }

    let ida = 0, volta = 0;
    switch (selectedOption.value) {
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

    try {
      // Salva os dados localmente primeiro
      const existingIndex = localData.value.findIndex(item => item.dia === dia && item.mes === mes && item.ano === ano);
      if (existingIndex !== -1) {
        localData.value[existingIndex] = { dia, mes, ano, rota, user, ida, volta };
      } else {
        localData.value.push({ dia, mes, ano, rota, user, ida, volta });
      }
      
      // Força atualização do calendário com os novos dados
      calendar.updateCalendar(mes - 1, ano, localData.value);
      
      // Atualiza o calendário em memória
      calendar.updateDayStatus(ano, mes, dia, ida, volta);
      
      console.log('Local Data após atualização:', localData.value);
      
      // Navega de volta para o calendário
      router.push({ name: 'Calendario' });
    } catch (error) {
      console.error('Erro ao confirmar seleção:', error);
      alert('Erro ao salvar a seleção. Por favor, tente novamente.');
    }
  };

  // async function addViagem(dia, mes, ano, rota, user, ida, volta) {
  //   try {
  //     const response = await fetch(`${VITE_BASE_URL_BACKEND}/setCalendario`, {
  //       method: 'POST',
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         user__id: user,
  //         rotas_id: rota,
  //         ida: ida,
  //         volta: volta,
  //         year: ano,
  //         month: mes,
  //         day: dia
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Erro ao salvar no servidor');
  //     }

  //     console.log("Banco atualizado");
  //     return response;
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  return {
    options,
    selectedOption,
    selectOption,
    confirmSelection,
    localData // Expose localData for debugging or further use
  };
}
