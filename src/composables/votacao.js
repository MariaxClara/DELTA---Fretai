const horarios = [
    { id: "ida8h", label: "Ida 8h" },
    { id: "volta17h30", label: "Volta 17h30" },
    { id: "naoVai", label: "Nenhum horário" }
];

async function getAlunos(dia, mes, ano) {
    const motorista_id = 1; //exemplo
    const message_1 =  `http://localhost:3000/driverUsers/${motorista_id}`
    let usuarios;
    try {
        const response = await fetch(message_1, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        usuarios = data.body;
        //console.log(data);
    }
    catch (error) {
        console.error('Erro ao buscar os passageiros:', error);
        return [];
    }
    const route = 1;
    const alunos = [];
    //console.log(usuarios);
    try {
        for (let i = 0; i < usuarios.length; i ++){
            const user_id = usuarios[i]["passageiro_id"];
            const user_name = usuarios[i]["passageiro_nome"];
            const message_2 = `http://localhost:3000/getCalendario/${user_id}/${route}/${ano}/${mes}/${dia}`;
            const response = await fetch(message_2, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.message == null) continue;
            alunos.push({
                id: user_id,
                name: user_name,
                ida: data.message[0]["ida"],
                volta: data.message[0]["volta"]
            });
        }
    }
    catch (error) {
        console.error('Erro ao buscar as viagens dos passageiros:', error);
        return [];
    }
    return alunos;
    // return [
    //     { id: 1, name: "Griffin", ida: true, volta: false },
    //     { id: 2, name: "Kimberly", ida: false, volta: true },
    //     { id: 3, name: "Alison", ida: true, volta: true },
    //     { id: 4, name: "Mercedes", ida: false, volta: false },
    //     { id: 5, name: "Jorge", ida: false, volta: false },
    //     { id: 1, name: 'Maria Silva', ida: true, volta: true },
    //     { id: 2, name: 'João Souza', ida: true, volta: false },
    //     { id: 3, name: 'Ana Pereira', ida: false, volta: true },
    //     { id: 4, name: 'Carlos Oliveira', ida: false, volta: false },
    // ];

}

// Filtra os alunos de acordo com a opção selecionada
async function getAlunosPorHorario(horarioId, dia, mes, ano) {
    const alunos = await getAlunos(dia, mes, ano);
    switch (horarioId) {
        case "ida8h":
            return alunos.filter(aluno => aluno.ida);
        case "volta17h30":
            return alunos.filter(aluno => aluno.volta);
        case "naoVai":
            return alunos.filter(aluno => !aluno.ida && !aluno.volta);
        default:
            return [];
    }
}

export { horarios, getAlunosPorHorario };
