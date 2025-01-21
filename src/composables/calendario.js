export default function maps() {
    // Store calendar data in memory (será substituído pelo banco de dados posteriormente)
    const calendarData = new Map();

    function getCalendarKey(year, month, day) {
        return `${year}-${month}-${day}`;
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
            const isPastDay =
                new Date(currentYearW, currentMonthW, i) <
                new Date(currentYear, currentMonth, currentDay);
            const isToday =
                i === currentDay &&
                currentMonthW === currentMonth &&
                currentYearW === currentYear;

            // Get saved data for this day if it exists
            const key = getCalendarKey(currentYearW, currentMonthW, i);
            const savedData = calendarData.get(key) || localData.find(item => item.dia === i && item.mes === currentMonthW + 1 && item.ano === currentYearW);
            console.log(savedData);

            let color = 'default'; // Default para dia sem seleção
            if (savedData) {
                console.log("new\n");
                if (savedData.ida && savedData.volta) color = 'dupla';
                else if (savedData.ida) color = 'ida';
                else if (savedData.volta) color = 'volta';
                else color = 'nada';
            }

            if (color !== 'default' && color !== 'inactive' && savedData) {
                console.log(`Day: ${i}, Color: ${color}, Saved Data: ${JSON.stringify(savedData)}`); // Log the color and saved data for relevant days
            }

            days.push({
                date: i,
                active: !isPastDay,
                key: `current-${i}`,
                color: isPastDay ? 'inactive' : color,
                isToday,
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

        // localData.forEach(item => {
        //     let color = 'default'; // Default para dia sem seleção
        //     if (item.ida && item.volta) color = 'dupla';
        //     else if (item.ida) color = 'ida';
        //     else if (item.volta) color = 'volta';
        //     else color = 'nada';

        //     days.push({
        //         date: item.dia,
        //         active: true,
        //         key: `current-${item.dia}`,
        //         color: color,
        //     });
        //     console.log(`Day: ${item.dia}, Color: ${color}`); // Log the color for relevant days
        // });

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
        if (currentMonthW === 11) {
            currentMonthW = 0;
            currentYearW += 1;
        } else {
            currentMonthW += 1;
        }
        return { currentMonthW, currentYearW };
    }

    return {
        updateCalendar,
        goToPreviousMonth,
        goToNextMonth,
        updateDayStatus,
        getDayStatus,
    };
}
