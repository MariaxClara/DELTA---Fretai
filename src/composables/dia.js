import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import maps from './calendario'; // Importe o maps

// Objeto usado para controlar quais meses já foram "atualizados"
const updates = {};

async function updateData() {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const user_id = 4; // exemplo
  const route = 1;  // exemplo
  const message = `http://localhost:3000/getCalendario/${user_id}/${route}/${year}/${month}/0`;

  try {
    const response = await fetch(message, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    for (let i = 0; i < data.message.length; i++) {
      data.message[i]["mes"] = month;
      data.message[i]["ano"] = year;
      data.message[i]["user"] = user_id;
      data.message[i]["rota"] = route;
    }

    console.log("Entrada :", data.message);
    updates[year] = [month];
    return data.message;
  } catch (error) {
    console.error('Erro ao buscar viagens:', error);
    return [];
  }
}

export function useTransportOptions() {
  // Crie o localData como ref inicial vazio (SEM await)
  const localData = ref([]);

  // Se quiser carregar os dados "automaticamente" quando este composable for usado,
  // você pode fazer um onMounted (só funciona se este composable for chamado dentro de um componente Vue).
  onMounted(() => {
    initLocalData();
  });

  // Função que efetivamente carrega os dados e atualiza localData
  async function initLocalData() {
    const data = await updateData();
    localData.value = data;
  }

  // Rotas e etc.
  const route = useRoute();
  const router = useRouter();
  const options = ['Eu vou!', 'Eu NÃO vou!', 'Apenas ida!', 'Apenas volta!'];
  const selectedOption = ref('');
  const calendar = maps(); // Crie uma instância do maps

  const selectOption = (option) => {
    selectedOption.value = option;
  };

  const confirmSelection = async (dia, mes, ano, rota, user) => {
    let driver_email = "motorista@mail.com"; //Exemplo
    let user_name = "José"; //Exemplo

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
      const existingIndex = localData.value.findIndex(
        (item) => item.dia === dia && item.mes === mes && item.ano === ano
      );
      if (existingIndex !== -1) {
        localData.value[existingIndex] = {
          dia, mes, ano, rota, user, ida, volta
        };
      } else {
        localData.value.push({
          dia, mes, ano, rota, user, ida, volta
        });
      }

      const response = await fetch(`${VITE_BASE_URL_BACKEND}/setCalendario`, {
        method: 'POST', // Método POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user__id: user,
          rotas_id: rota,
          ida,
          volta,
          year: ano,
          month: mes,
          day: dia,
        }),
      });

      const status = await response.json();
      if (status.message !== "success") {
        console.error('Erro ao confirmar seleção:', status);
        alert('Erro ao salvar a seleção. Por favor, tente novamente.');
        return;
      }

      // Notifica o Motorista
      const textValue = "O usuário " + user_name + " atualizou confirmação de ida para o dia " + dia + "/" + mes + "/" + ano;
      try {
        await fetch(`${VITE_BASE_URL_BACKEND}/sendEmail`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: driver_email,
            from: "fretaiunifesp@gmail.com",
            subject: "Atualização de ida!",
            text: textValue
          })
        });
      } catch (error) {
        console.log("Não foi possível avisar o motorista!: " + error);
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

  const updateMonth = async (month, year) => {
    console.log(updates);
    if (year in updates) {
      if (updates[year].includes(month)) {
        console.log("Já atualizado");
        return [];
      } else {
        updates[year].push(month);
      }
    } else {
      updates[year] = [month];
    }

    const user_id = 4; // exemplo
    const route = 1;  // exemplo
    const message = `http://localhost:3000/getCalendario/${user_id}/${route}/${year}/${month}/0`;

    try {
      const response = await fetch(message, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      for (let i = 0; i < data.message.length; i++) {
        data.message[i]["mes"] = month;
        data.message[i]["ano"] = year;
        data.message[i]["user"] = user_id;
        data.message[i]["rota"] = route;
      }
      console.log(data.message);
      return data.message;
    } catch (error) {
      console.error('Erro ao buscar viagens:', error);
      return [];
    }
  };

  // Exponha tudo o que precisar retornar
  return {
    localData,
    options,
    selectedOption,
    selectOption,
    confirmSelection,
    updateMonth,
  };
}
