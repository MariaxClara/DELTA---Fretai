const horarios = [
    { id: "ida8h", label: "Ida 8h" },
    { id: "volta17h30", label: "Volta 17h30" },
    { id: "naoVai", label: "Não vai em nenhum horário" }
];

const alunos = [
    { id: 1, name: "Griffin", ida: true, volta: false },
    { id: 2, name: "Kimberly", ida: false, volta: true },
    { id: 3, name: "Alison", ida: true, volta: true },
    { id: 4, name: "Mercedes", ida: false, volta: false }
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
