export default function maps() {
    // Store calendar data in memory (será substituído pelo banco de dados posteriormente)
    const calendarData = new Map();

    function getCalendarKey(year, month, day) {
        return `${year}-${month}-${day}`;
    }

    function isMonthAllowed(targetMonth, targetYear) {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Calculate months difference
        const monthsDiff = (targetYear - currentYear) * 12 + (targetMonth - currentMonth);
        return monthsDiff <= 2;
    }

    function updateCalendar(currentMonthW, currentYearW, localData) {
        const firstDayOfMonth = new Date(currentYearW, currentMonthW, 1).getDay();
        const lastDateOfMonth = new Date(currentYearW, currentMonthW + 1, 0).getDate();
        const lastDayOfPrevMonth = new Date(currentYearW, currentMonthW, 0).getDate();

        const currentDate = new Date(currentYearW, currentMonthW).toLocaleString('pt-BR', {
            month: 'long',
            year: 'numeric',
        });

        // Get current date for comparison
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const days = [];

        // Previous month days
        for (let i = firstDayOfMonth; i > 0; i--) {
            days.push({
                date: lastDayOfPrevMonth - i + 1,
                active: false,
                key: `prev-${i}`,
                color: 'inactive',
            });
        }

        // Current month days
        for (let i = 1; i <= lastDateOfMonth; i++) {
            console.log(`Checking day ${i} of month ${currentMonthW + 1} of year ${currentYearW}`);
            const date = new Date(currentYearW, currentMonthW, i);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isPastDay =
                new Date(currentYearW, currentMonthW, i) <
                new Date(currentYear, currentMonth, currentDay);
            const isToday =
                i === currentDay &&
                currentMonthW === currentMonth &&
                currentYearW === currentYear;

            // Find if this day has a saved vote
            const savedDay = localData.find(item => 
                parseInt(item.dia) === i && 
                item.mes === currentMonthW + 1 && 
                parseInt(item.ano) === currentYearW
            );
            console.log(savedDay);

            let choice = 'default';
            if (savedDay) {
                if (savedDay.ida && savedDay.volta) choice = 'dupla';
                else if (savedDay.ida) choice = 'ida';
                else if (savedDay.volta) choice = 'volta';
                else choice = 'nada';
                console.log(`Found vote for day ${i}: ${choice}`);
            }

            days.push({
                date: i,
                active: !isPastDay && !isWeekend,
                key: `current-${i}`,
                color: isPastDay ? 'inactive' : (isWeekend ? 'weekend' : choice),
                isToday,
                isWeekend,
                choice
            });
        }

        // Next month days
        const nextDays = 7 - (days.length % 7);
        for (let i = 1; i <= nextDays && nextDays < 7; i++) {
            days.push({
                date: i,
                active: false,
                key: `next-${i}`,
                color: 'inactive',
            });
        }

        return { currentDate, days };
    }

    function updateDayStatus(year, month, day, ida, volta) {
        const key = getCalendarKey(year, month, day);
        calendarData.set(key, { ida, volta });
        console.log('Calendar Data:', Array.from(calendarData.entries())); // Print saved days
        return updateCalendar(month, year, Array.from(calendarData.values())); // Retorna o calendário atualizado
    }

    function getDayStatus(year, month, day) {
        const key = getCalendarKey(year, month, day);
        return calendarData.get(key);
    }

    function goToPreviousMonth(currentMonthW, currentYearW) {
        if (currentMonthW === 0) {
            currentMonthW = 11;
            currentYearW -= 1;
        } else {
            currentMonthW -= 1;
        }
        return { currentMonthW, currentYearW };
    }

    function goToNextMonth(currentMonthW, currentYearW) {
        let nextMonth = currentMonthW === 11 ? 0 : currentMonthW + 1;
        let nextYear = currentMonthW === 11 ? currentYearW + 1 : currentYearW;

        if (!isMonthAllowed(nextMonth, nextYear)) {
            alert('Não é possível visualizar mais de dois meses à frente.');
            return { currentMonthW, currentYearW };
        }

        return { currentMonthW: nextMonth, currentYearW: nextYear };
    }

    return {
        updateCalendar,
        goToPreviousMonth,
        goToNextMonth,
        updateDayStatus,
        getDayStatus,
        isMonthAllowed
    };
}
