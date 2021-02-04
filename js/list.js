$(function() {
    const header = $('#header')[0];
    const shortcut = $('#shortcut')[0];

    $('#nav .sk_list li').on({
        click: function() {
            $(this).addClass('current').siblings().removeClass('current');
        }
    });
    const documentScroll = function() {
        if (window.pageYOffset <= shortcut.offsetHeight) {
            header.style.top = shortcut.offsetHeight - window.pageYOffset + 'px';
            header.style.borderBottom = '';
        } else {
            header.style.top = '0px';
            header.style.borderBottom = '2px solid #b1191a';
        }
    }
    documentScroll();
    $(document).on('scroll', documentScroll);
});