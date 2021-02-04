$(function() {
    window.imgData = [
        { imgSrc: '../upload/carousel/1.webp', aHref: 'https://www.baidu.com' },
        { imgSrc: '../upload/carousel/2.webp', aHref: 'javascript:;' },
        { imgSrc: '../upload/carousel/3.webp', aHref: 'javascript:;' },
        { imgSrc: '../upload/carousel/4.jpg', aHref: 'javascript:;' },
        { imgSrc: '../upload/carousel/5.webp', aHref: 'javascript:;' },
        { imgSrc: '../upload/carousel/6.jpg', aHref: 'javascript:;' },
        { imgSrc: '../upload/carousel/7.webp', aHref: 'javascript:;' },
        { imgSrc: '../upload/carousel/8.webp', aHref: 'javascript:;' },
    ];

    const floorSlider = $('#floor_slider')[0];
    const recommend = $('#recommend')[0];
    const header = $('#header')[0];
    const shortcut = $('#shortcut')[0];
    const floorSliderTop = floorSlider.offsetTop - recommend.offsetTop + header.offsetHeight + 50;
    const floorSlider_style_top = floorSlider.style.top;

    const documentScroll = function() {
        if (window.pageYOffset >= recommend.offsetTop - header.offsetHeight - 50) {
            floorSlider.style.position = 'fixed';
            floorSlider.style.top = floorSliderTop + 'px';
        } else {
            floorSlider.style.position = 'absolute';
            floorSlider.style.top = floorSlider_style_top;
        }
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

    $('.floor_slider>ul').on({
        click: function(e) {
            // 判断触发点击的对象是a还是li
            // e.target.children.length ? e.target.children[0].click() : null;
            // 去除a标签跳转的hash值
            // history.replaceState(null, '', location.pathname + location.search);

            // e.target.children[0].click();
            // $(e.target.children).click();
            $(e.target.children).trigger("click");
        }
    });

    $('.label').on('click touch', function(e) {
        e.stopPropagation(); // 阻止冒泡
        //根据a标签的_href转换为id选择器，获取id元素所处的位置，并高度减105px
        $('html,body').animate({
            scrollTop: ($($(this).attr('_href')).offset().top - shortcut.offsetHeight)
        }, 1000);
    });

    $('.backtop').on({
        click: function(e) {
            e.stopPropagation(); // 阻止冒泡
            $('html,body').animate({
                scrollTop: 0
            }, 1000);
        }
    });
});