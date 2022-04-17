$(function () {
    const target = $('.well-ice');

    const observer = new MutationObserver(function () {
        let resourceCost = 0;

        target.find('.test-resource-detail')
            .first()
            .children()
            .each(function () {
                let text = $(this).find('span').text();
                text = text.replaceAll(',', '.');
                const matches = text.match(/([\d/.]+)x\$([\d/.]+)/);
                if (!matches)
                    return;
                resourceCost += eval(matches[1]) * eval(matches[2]);
            });

        console.log(resourceCost);
    });

    observer.observe(target.get(1), {
        childList:     true,
        characterData: true
    });
});