export default function maps() {    

    function updateCalendar(currentMonthW, currentYearW) {
        const firstDayOfMonth = new Date(currentYearW, currentMonthW, 1).getDay();
        const lastDateOfMonth = new Date(currentYearW, currentMonthW + 1, 0).getDate();
        const lastDayOfPrevMonth = new Date(currentYearW, currentMonthW, 0).getDate();

        const currentDate = new Date(currentYearW, currentMonthW).toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
        });

        const days = [];
        const classes = ['ida', 'volta', 'dupla', 'nada', 'unknow'];
        // Preencher os dias do mês anterior
        for (let i = firstDayOfMonth; i > 0; i--) {
            days.push({ date: lastDayOfPrevMonth - i + 1, active: false, key: `prev-${i}`, color: 'inactive' });
        }
        // Preencher os dias do mês atual
        for (let i = 1; i <= lastDateOfMonth; i++) {
            let choice = classes[Math.floor(Math.random() * classes.length)];
            days.push({ date: i, active: true, key: `current-${i}`, color: choice  });
        }
        // Preencher os dias do próximo mês
        const nextDays = 7 - (days.length % 7);
        for (let i = 1; i <= nextDays && nextDays < 7; i++) {
            days.push({ date: i, active: false, key: `next-${i}`, color: 'inactive'  });
        }

        return {currentDate, days}
    }

    function goToPreviousMonth(currentMonthW, currentYearW) {
        if (currentMonthW === 0) {
            currentMonthW = 11;
            currentYearW -= 1;
        } else {
            currentMonthW -= 1;
        }
        //this.updateCalendar();
        return {currentMonthW, currentYearW}
    }

    function goToNextMonth(currentMonthW, currentYearW) {
        if (currentMonthW === 11) {
            currentMonthW = 0;
        currentYearW += 1;
        } else {
            currentMonthW += 1;
        }
        //this.updateCalendar();
        return {currentMonthW, currentYearW}
    }

    return {updateCalendar, goToPreviousMonth, goToNextMonth};
}