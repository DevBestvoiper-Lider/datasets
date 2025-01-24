$(document).ready(function () {
    $('.progress-circle').each(function () {
        const percentage = $(this).attr('data-percentage');
        $(this)[0].style.setProperty('--percentage', percentage);
    });
});