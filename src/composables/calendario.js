const datesContainer = document.querySelector('.dates');
const daysInMonth = 30; // Você pode usar lógica para calcular o mês atual.

for (let day = 1; day <= daysInMonth; day++) {
    const dateElement = document.createElement('span');
    dateElement.textContent = day;
    datesContainer.appendChild(dateElement);
}
