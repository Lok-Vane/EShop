/**
 * carousel 轮播图封装
 * 调用方式
 * <lok-carousel imgData='data' width='500' height='281' clickable ifArrow autoTime='3000' target='_blank'></lok-carousel>
 * imgData 数组格式如下 imgSrc图片地址 aHref跳转链接
 * [{ imgSrc: '...', aHref: '...' },{ imgSrc: '...', aHref: '...' }]
 * width height 为轮播图长宽 默认500 281 不带单位
 * clickable 小圆点是否可点击 移动端点击无效 传入“none”则不显示
 * ifArrow 是否显示左右箭头 移动端不生效（移动端无左右箭头）
 * autoTime 轮播图动画间隔时间 传入false或非数字则禁止自动播放 
 * target 链接跳转方式  '_blank'、'_self'、'_parent'、'_top'  默认 '_self'  同a标签target属性
 */
$(function() {

    // 物理像素比
    var dpr = window.devicePixelRatio || 1;

    // 获取样式类名
    var classNameCache = (function() {
        var data = {
            carousel: 'carousel',
            arrowLeft: 'arrow-l',
            arrowRight: 'arrow-r',
            arrow: 'arrow',
            circle: 'circle',
            current: 'current',
            clickable: 'clickable'
        }
        return function() {
            return data;
        }
    })();

    // PC端
    var pc = function() {

        if ($('lok-carousel').length) {

            $('lok-carousel').each(function(index, domEle) {

                var carouselBox = $('<div></div>');
                var left = $('<a href="javascript:;">〈</a>');
                var right = $('<a href="javascript:;">〉</a>');
                var ul = $('<ul></ul>');
                var ol = $('<ol></ol>');
                var img_index = 0;
                var clickFlag = true; // 节流阀
                var timer = 'stop'; // 自动播放定时任务

                // 自动播放开关
                var toggleTimer = function() {
                    if (carouselData().autoTime) {
                        if (timer === 'stop') {
                            timer = setInterval(function() {
                                // 自动播放不受节流阀影响
                                img_index = img_index + 1 > carouselData().imgData.length ? 1 : img_index + 1;
                                if (img_index === 1) {
                                    ul.css({
                                        left: 0
                                    });
                                }
                                circleChange();
                                imgChange(false);
                            }, carouselData().autoTime);
                        } else {
                            clearInterval(timer);
                            timer = 'stop';
                        }
                    }
                }

                // 获取 carousel 属性数据
                var carouselData = (function() {
                    var data = {
                        imgData: window[$(domEle).attr('imgData')] || [],
                        width: $(domEle).attr('width') * 1 || 500,
                        height: $(domEle).attr('height') * 1 || 281,
                        autoTime: ($(domEle).attr('autoTime') * 1 ? $(domEle).attr('autoTime') * 1 : false) || false,
                        clickable: (function() {
                            if (typeof($(domEle).attr('clickable')) === "undefined") {
                                return false;
                            } else if ($(domEle).attr('clickable').trim() === '') {
                                return true;
                            } else if ($(domEle).attr('clickable').trim().length === 5 &&
                                $(domEle).attr('clickable').indexOf('false') !== -1) {
                                return false;
                            } else if ($(domEle).attr('clickable').trim() === 'none') {
                                return 'none';
                            } else {
                                return true;
                            }
                        })(),
                        ifArrow: (function() {
                            if (typeof($(domEle).attr('ifArrow')) === "undefined") {
                                return false;
                            } else if ($(domEle).attr('ifArrow').trim() === '') {
                                return true;
                            } else if ($(domEle).attr('ifArrow').trim().length === 5 &&
                                $(domEle).attr('ifArrow').indexOf('false') !== -1) {
                                return false;
                            } else {
                                return true;
                            }
                        })(),
                        target: (function() {
                            if (typeof($(domEle).attr('target')) === "undefined") {
                                return '_self';
                            } else if ($(domEle).attr('target').trim() === '') {
                                return '_self';
                            } else if ($(domEle).attr('target').trim() === '_parent') {
                                return '_parent';
                            } else if ($(domEle).attr('target').trim() === '_top') {
                                return '_top';
                            } else if ($(domEle).attr('target').trim() === '_blank') {
                                return '_blank';
                            } else {
                                return '_self';
                            }
                        })(),
                    }
                    return function() {
                        return data;
                    }
                })();

                // 节流阀开关，防止按钮重复点击，轮播图滚动过快
                function clickFlagChange() {
                    clickFlag = !clickFlag;
                }

                // 小圆点跟随变化
                function circleChange() {
                    var i = img_index;
                    // 找出带有current类名的li,并去除current类名
                    if (i >= carouselData().imgData.length) {
                        i = 0;
                    }
                    ol.children('li').eq(i)
                        .addClass(classNameCache().current)
                        .siblings('li').removeClass(classNameCache().current);
                }

                // 图片切换动画
                function imgChange(ifCallback) {
                    if (ifCallback) {
                        ul.stop().animate({
                            left: -img_index * carouselData().width
                        }, 500, clickFlagChange);
                    } else {
                        ul.stop().animate({
                            left: -img_index * carouselData().width
                        }, 500);
                    }
                }

                // 右箭头点击事件
                function click_r() {
                    if (clickFlag) {
                        clickFlagChange();
                        img_index = img_index + 1 > carouselData().imgData.length ? 1 : img_index + 1;
                        if (img_index === 1) {
                            ul.css({
                                left: 0
                            });
                        }
                        circleChange();
                        imgChange(true);
                    }
                }

                // 左箭头点击事件
                function click_l() {
                    if (clickFlag) {
                        clickFlagChange();
                        img_index = img_index - 1 < 0 ? carouselData().imgData.length - 1 : img_index - 1;
                        if (img_index === carouselData().imgData.length - 1) {
                            ul.css({
                                left: -carouselData().imgData.length * carouselData().width
                            });
                        }
                        circleChange();
                        imgChange(true);
                    }
                }

                // 轮播图盒子鼠标移入移出，显示隐藏左右箭头
                carouselBox.addClass(classNameCache().carousel)
                    .hover(function() {
                        if (carouselData().ifArrow) {
                            left.toggle();
                            right.toggle();
                            toggleTimer();
                        }
                    })
                    .css({
                        width: carouselData().width + 'px',
                        height: carouselData().height + 'px',
                    });

                // 左箭头默认样式、点击事件
                left.addClass(classNameCache().arrowLeft + ' ' + classNameCache().arrow)
                    .on({
                        click: click_l
                    })
                    .hide();

                // 右箭头默认样式、点击事件
                right.addClass(classNameCache().arrowRight + ' ' + classNameCache().arrow)
                    .on({
                        click: click_r
                    })
                    .hide();

                // 小圆点盒子样式 小圆点点击事件（事件委托）
                ol.addClass(classNameCache().circle)
                if (carouselData().clickable) {
                    ol.on('click', 'li', function() {
                        $(this).addClass(classNameCache().current)
                            .siblings('li').removeClass(classNameCache().current);
                        img_index = $(this).attr('li-index') * 1;
                        imgChange(false);
                    });
                }

                // 轮播图盒子添加子元素
                if (carouselData().imgData.length) {
                    carouselBox.append(left, right, ul, ol);
                }

                // 遍历添加图片、小圆点
                $.each(carouselData().imgData, function(i, item) {
                    var li = $('<li></li>');
                    var a = $('<a href=' + item.aHref + '></a>');
                    var img = $('<img src=' + item.imgSrc + '></img>');
                    img.css({
                        width: carouselData().width + 'px',
                        height: carouselData().height + 'px',
                    })
                    ul.append(li.append(a.append(img)));
                    ol.append($('<li li-index=' + i + '></li>'));
                });

                // 小圆点样式
                ol.children('li:first').addClass(classNameCache().current);
                if (carouselData().clickable) {
                    ol.children('li').addClass(classNameCache().clickable);
                }

                // 添加轮播图盒子，移除原标签元素
                $(domEle).after(carouselBox).remove();

                // ul尾部添加第一张图片的克隆
                var firstClone = $('.carousel ul li:first').clone();
                firstClone.attr('cloneName', 'firstClone')
                $('.carousel ul').append(firstClone).find('a').prop('target', carouselData().target);

                // 是否显示小圆点
                if (carouselData().clickable === 'none') {
                    ol.hide()
                }

                // 定时器开关
                toggleTimer();

            });
        }

    }

    // 移动端
    var mobile = function() {
        if ($('lok-carousel').length) {

            $('lok-carousel').each(function(index, domEle) {
                var carouselBox = $('<div></div>');
                var ul = $('<ul></ul>');
                var ol = $('<ol></ol>');
                var img_index = 0;
                // 节流阀
                var ifMove = false;
                // 自动播放定时任务
                var timer = 'stop';
                // 手指触摸初始坐标
                var startX = null;
                // ul初始位置坐标
                var boxX = null;
                //手指移动距离
                var moveX = null;

                // 自动播放开关
                var toggleTimer = function() {
                    if (carouselData().autoTime) {
                        if (timer === 'stop') {
                            timer = setInterval(function() {
                                img_index++;
                                circleChange();
                                imgChange('all .3s');
                            }, carouselData().autoTime);
                        } else {
                            clearInterval(timer);
                            timer = 'stop';
                        }
                    }
                }

                // 获取 carousel 属性数据
                var carouselData = (function() {
                    var data = {
                        imgData: window[$(domEle).attr('imgData')] || [],
                        width: (($(domEle).attr('width') * 1 || 500) / dpr).toFixed(2),
                        height: (($(domEle).attr('height') * 1 || 281) / dpr).toFixed(2),
                        autoTime: ($(domEle).attr('autoTime') * 1 ? $(domEle).attr('autoTime') * 1 : false) || false,
                        clickable: (function() {
                            if (typeof($(domEle).attr('clickable')) === "undefined") {
                                return false;
                            } else if ($(domEle).attr('clickable').trim() === '') {
                                return true;
                            } else if ($(domEle).attr('clickable').trim().length === 5 &&
                                $(domEle).attr('clickable').indexOf('false') !== -1) {
                                return false;
                            } else if ($(domEle).attr('clickable').trim() === 'none') {
                                return 'none';
                            } else {
                                return true;
                            }
                        })(),
                        target: (function() {
                            if (typeof($(domEle).attr('target')) === "undefined") {
                                return '_self';
                            } else if ($(domEle).attr('target').trim() === '') {
                                return '_self';
                            } else if ($(domEle).attr('target').trim() === '_parent') {
                                return '_parent';
                            } else if ($(domEle).attr('target').trim() === '_top') {
                                return '_top';
                            } else if ($(domEle).attr('target').trim() === '_blank') {
                                return '_blank';
                            } else {
                                return '_self';
                            }
                        })(),
                    }
                    return function() {
                        return data;
                    }
                })();

                // 小圆点跟随变化
                function circleChange() {
                    var i = img_index;
                    // 找出带有current类名的li,并去除current类名
                    if (i >= carouselData().imgData.length) {
                        i = 0;
                    }
                    ol.children('li').eq(i)
                        .addClass(classNameCache().current)
                        .siblings('li').removeClass(classNameCache().current);
                }

                // 图片切换动画
                function imgChange(transition) {
                    var translatex = -img_index * carouselData().width;
                    ul.css({
                        transform: 'translateX(' + translatex + 'px)',
                        transition: transition
                    });
                };

                // 轮播图盒子长宽
                carouselBox.addClass(classNameCache().carousel)
                    .css({
                        width: carouselData().width + 'px',
                        height: carouselData().height + 'px',
                    });

                // 轮播图盒子添加子元素
                if (carouselData().imgData.length) {
                    carouselBox.append(ul, ol);
                }

                // 遍历添加图片、小圆点
                $.each(carouselData().imgData, function(i, item) {
                    var li = $('<li></li>');
                    var a = $('<a href=' + item.aHref + '></a>');
                    var img = $('<img src=' + item.imgSrc + '></img>');

                    img.css({
                        width: carouselData().width + 'px',
                        height: carouselData().height + 'px',
                    })

                    ul.append(li.append(a.append(img)));

                    ol.append($('<li li-index=' + i + '></li>'));
                });

                // 小圆点样式
                ol.addClass(classNameCache().circle)
                    .children('li:first').addClass(classNameCache().current);

                // 添加轮播图盒子，移除原标签元素
                $(domEle).after(carouselBox).remove();

                // ul尾部添加第一张图片的克隆，头部添加最后一张图片的克隆
                var firstClone = ul.children('li').eq(0).clone();
                firstClone.attr('cloneName', 'firstClone');
                var endClone = ul.children('li').eq(ul.children('li').length - 1).clone();
                endClone.attr('cloneName', 'endClone');
                ul.append(firstClone)
                    .prepend(endClone)
                    .css({
                        left: -carouselData().width
                    })
                    .on({
                        touchstart: function(e) {
                            // 获取手指触摸初始坐标、盒子初始位置坐标
                            startX = e.targetTouches[0].pageX;
                            boxX = -img_index * carouselData().width;
                            toggleTimer();
                        },
                        touchmove: function(e) {
                            // 计算手指移动距离，手指移动后坐标减去初始坐标
                            moveX = e.targetTouches[0].pageX - startX;
                            // 移动盒子  手指拖动不需要动画效果
                            var translatex = boxX + moveX;
                            ul.css({
                                transform: 'translateX(' + translatex + 'px)',
                                transition: 'none'
                            })

                            // 手指移动也会默认触发滚动屏幕效果，所以这里要阻止默认行为
                            e.preventDefault();
                            ifMove = true;
                        },
                        touchend: function(e) {
                            if (ifMove) {
                                ifMove = false;
                                // 判断移动距离是否大于某个值，再决定弹回还是下一张
                                if (Math.abs(moveX) > carouselData().width / 3) {
                                    // 右滑
                                    if (moveX > 0) {
                                        img_index--;
                                    } else {
                                        img_index++;
                                    }
                                    imgChange('all .3s');
                                } else {
                                    imgChange('all .1s');
                                }
                            }
                            toggleTimer();
                        },
                        transitionend: function() {
                            if (img_index >= carouselData().imgData.length) {
                                // 走到尾部，第一张图片的克隆
                                img_index = 0;
                            } else if (img_index < 0) {
                                // 走到头部，最后一张图片的克隆
                                img_index = carouselData().imgData.length - 1;
                            }
                            imgChange('none');
                            circleChange();
                        }
                    })
                    .find('a').prop('target', carouselData().target);

                // 是否显示小圆点
                if (carouselData().clickable === 'none') {
                    ol.hide();
                }

                // 定时器开关
                toggleTimer();
            })

        }
    }

    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wosBrowser|BroserNG|WebOs|SymBian|Windows Phone)/i))) {
        mobile();
    } else {
        pc();
    }

})