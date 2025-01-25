const horarios = [
    { id: "ida8h", label: "Ida 8h" },
    { id: "volta17h30", label: "Volta 17h30" },
    { id: "naoVai", label: "Nenhum horário" }
];

function getAlunos() {
    return [
        { id: 1, name: "Griffin", ida: true, volta: false },
        { id: 2, name: "Kimberly", ida: false, volta: true },
        { id: 3, name: "Alison", ida: true, volta: true },
        { id: 4, name: "Mercedes", ida: false, volta: false },
        { id: 5, name: "Jorge", ida: false, volta: false },
        { id: 1, name: 'Maria Silva', ida: true, volta: true },
        { id: 2, name: 'João Souza', ida: true, volta: false },
        { id: 3, name: 'Ana Pereira', ida: false, volta: true },
        { id: 4, name: 'Carlos Oliveira', ida: false, volta: false },
    ];

}

// Filtra os alunos de acordo com a opção selecionada
function getAlunosPorHorario(horarioId) {
    alunos = getAlunos()
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
