const horarios = [
    { id: "ida8h", label: "Ida 8h" },
    { id: "volta17h30", label: "Volta 17h30" },
    { id: "naoVai", label: "Nenhum horário" }
];

const alunos = [
    { id: 1, name: "Griffin", ida: true, volta: false },
    { id: 2, name: "Kimberly", ida: false, volta: true },
    { id: 3, name: "Alison", ida: true, volta: true },
    { id: 4, name: "Mercedes", ida: false, volta: false },
    { id: 5, name: "Jorge", ida: false, volta: false },
    { id: 1, name: 'Maria Silva', ida: 1, volta: 1 },
    { id: 2, name: 'João Souza', ida: 1, volta: 0 },
    { id: 3, name: 'Ana Pereira', ida: 0, volta: 1 },
    { id: 4, name: 'Carlos Oliveira', ida: 0, volta: 0 },
];

// Filtra os alunos de acordo com a opção selecionada
function getAlunosPorHorario(horarioId) {
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

export { horarios, alunos, getAlunosPorHorario };
