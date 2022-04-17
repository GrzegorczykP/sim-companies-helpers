let buildings = [
    {"db_letter": "6", "name": "Fabryka napojów", "wages": 241},
    {"db_letter": "D", "name": "Fabryka napędów", "wages": 621},
    {"db_letter": "e", "name": "Rzeźnia", "wages": 414},
    {"db_letter": "E", "name": "Elektrownia", "wages": 414},
    {"db_letter": "F", "name": "Farma", "wages": 138},
    {"db_letter": "g", "name": "Główny wykonawca", "wages": 345},
    {"db_letter": "i", "name": "Młyn", "wages": 379.50000000000006},
    {"db_letter": "j", "name": "Piekarnia", "wages": 448.5},
    {"db_letter": "k", "name": "Zakład przetwórstwa żywności", "wages": 379.50000000000006},
    {"db_letter": "L", "name": "Fabryka elektroniki", "wages": 379.50000000000006},
    {"db_letter": "m", "name": "Catering", "wages": 655.5},
    {"db_letter": "M", "name": "Kopalnia", "wages": 276},
    {"db_letter": "o", "name": "Betoniarnia", "wages": 379.50000000000006},
    {"db_letter": "O", "name": "Platforma wiertnicza", "wages": 517.5},
    {"db_letter": "P", "name": "Plantacja", "wages": 103.5},
    {"db_letter": "Q", "name": "Kamieniołom", "wages": 276},
    {"db_letter": "R", "name": "Rafineria", "wages": 482.99999999999994},
    {"db_letter": "S", "name": "Baza transportowa", "wages": 310.5},
    {"db_letter": "T", "name": "Fabryka ubrań", "wages": 138},
    {"db_letter": "W", "name": "Zbiornik wodny", "wages": 345},
    {"db_letter": "x", "name": "Fabryka budowlana", "wages": 482.99999999999994},
    {"db_letter": "Y", "name": "Fabryka", "wages": 414}
];

$(function () {
    const target = $('.well-ice');

    const observer = new MutationObserver(function () {

        let regResources = /([\d\/.]+)x\n\$([\d.]+)/gm;
        let regFactory = /href="\/pl\/encyclopedia\/building\/(.)"/;
        let regProductValue = /\$([\d.]+) \(Giełda\)/;
        let regAdmCost = /Koszty administracyjne\s+([\d.]+)%/;
        let regProducedAnHour = /Jednostki na godzinę\s+([\d.]+)/;

        let rows = target.find('.test-resource-detail')
            .first()
            .children();

        let text = rows[0].innerText;
        text = text.replaceAll(',', '.');
        let resourceCost = [...text.matchAll(regResources)]
            .reduce((previousValue, currentValue) => previousValue + eval(currentValue[1]) * eval(currentValue[2]), 0);

        let factoryIndex = rows[1].innerHTML.match(regFactory)[1];
        let factoryData = buildings.find(value => value['db_letter'] === factoryIndex);

        let productValue = Number(rows[1].innerText.replaceAll(',', '.').match(regProductValue)[1]);

        text = rows[2].innerText;
        if (!text.includes('KALKULATOR PRODUKCJI'))
            text = rows[3].innerText

        text = text.replaceAll(',', '.');
        let admCost = Number(text.match(regAdmCost)[1]) / 100;
        let producedAnHour = Number(text.match(regProducedAnHour)[1]);

        let hourlyResourcesCost = resourceCost * producedAnHour;
        let hourlyFees = factoryData['wages'] * (1 + admCost);
        let hourlyIncome = productValue * producedAnHour;

        let row = rows[2];
        if (!row.innerText.includes('KALKULATOR PRODUKCJI'))
            row = rows[3]
        $(row).find('div.col-xs-6:contains("Jednostki na godzinę")')[0].innerHTML +=
            `Dochody: $${(hourlyIncome - hourlyFees - hourlyResourcesCost).toFixed(2)} <br>
            Koszt zakupu surowców: $${hourlyResourcesCost.toFixed(2)} <br>
            Koszty pracownicze: $${hourlyFees.toFixed(2)} <br>
            Przychody: $${hourlyIncome.toFixed(2)} <br>`;
    });

    observer.observe(target.get(1), {
        childList: true,
        characterData: true
    });
});