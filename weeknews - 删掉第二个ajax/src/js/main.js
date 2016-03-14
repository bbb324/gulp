/**
 * Created by X-jn on 2015/11/23.
 */
(function(){
    draw1();
})();
function draw1(){

    var sum = 0, highest;
    $.ajax({
        type: 'GET',
        url: "src/js/template.json",
        data: 'json',
        success: function(data){
            console.log(data.eachDayPay[0]);
            highest = data.eachDayPay[0];

         for(var i=0; i<data.eachDayPay.length; i++){
             if(data.eachDayPay[i]>highest){
                 highest = data.eachDayPay[i];
             }
             sum+=data.eachDayPay[i];
         }
            json_fill(data);
            draw_average(data.eachDayPay, highest, sum);  //画缩略图
            stars(data.ratingStart);  //画星星
            draw2(data.eachDayPay, sum); //画圆圈
            draw3(data, sum/7, data.eachDayPay.indexOf(highest)); //画柱状图
        },
        error: function(){
            console.log('wrong');
        }
    });
}
function json_fill(data){
    var regex = data.topPayDay,
        today = $('.weekday')[regex],
        day_span = $('.day span');
        today.classList.add('today');
    switch(regex){
        case 0:
            today.innerHTML = "一";
            day_span[0].innerHTML = '周一';
            break;
        case 1:
            today.innerHTML = "二";
            day_span[0].innerHTML = '周二';
            break;
        case 2:
            today.innerHTML = "三";
            day_span[0].innerHTML = '周三';
            break;
        case 3:
            today.innerHTML = "四";
            day_span[0].innerHTML = '周四';
            break;
        case 4:
            today.innerHTML = "五";
            day_span[0].innerHTML = '周五';
            break;
        case 5:
            today.innerHTML = "六";
            day_span[0].innerHTML = '周六';
            break;
        case 6:
            today.innerHTML = "七";
            day_span[0].innerHTML = '周七';
            break;
    }
    $('.user_name')[0].innerHTML = data.name;
    $('.date')[0].innerHTML = data.cycleRange+"周报";
    $('.rank span')[0].innerHTML = data.assetPecentage;
    $('.comment')[0].innerHTML = data.ratingBadgeDescription;
    $('.title span')[0].innerHTML = '('+data.currencyName+')';
    $('.value')[0].innerHTML = data.weekPay;

    $('.income span')[0].innerHTML = data.weekIncome;
    $('.daily_average_conclude span')[0].innerHTML = data.averagePay;
    for(var i=0; i<data.topPayList.length; i++){
        $('.text')[i].innerHTML = data.topPayList[i].payName;
    }

    var percent = data.payComparePercent.substr(1, data.payComparePercent.length-1);
    var sign = data.payComparePercent.substr(0, 1);
    if(sign=='+'){
        $('.triangle')[0].classList.add('triangle_up');
    }
    else if(sign == '-'){
        $('.triangle')[0].classList.add('triangle_down');
    }
    $('.percent')[0].innerHTML = percent;  //正则去掉+ -
}
function draw_average(data, highest, sum){
    var daily_average = document.getElementById('daily_average');
    var ctx = daily_average.getContext('2d');
    var e = parseFloat(window.innerWidth/320).toFixed(2);  //根据iPhone5 的320宽等比放大
    daily_average.style.width = 100*e+'px';
    daily_average.style.height = 50*e+'px';

    var ratio=[], count = 0, median;
    ctx.beginPath();
    ctx.fillStyle = '#e5e6e9';
    for(var i=0; i<data.length; i++){
        ratio[count] = parseInt(data[i]/highest*100);
        count++;
    }
    for(i=0; i<data.length; i++){
        ctx.fillRect(22+i*9, 25-ratio[i]/4, 4, ratio[i]/4);
    }
    median = parseInt(sum/7)/highest;  //第一个canvas 均线高度获取
    ctx.moveTo(15, 25-25*median);
    ctx.lineTo(85,25-25*median);
    ctx.strokeStyle = "#14ba89";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}
function stars(stars){
    var s = 0,j = 0; //s 整数部分，j小数部分
    s=stars%1;
    j=stars-s;
    for(var i=0; i<=j; i++){
        if(i==j){
            $('.star')[i].style.backgroundPosition =  '0 -1.7rem';
        }
        else{
            $('.star')[i].style.backgroundPosition =  '0 -0.85rem';
        }
    }
}
function draw2(data, sum){
    var top3 = [], ratio = [], count = 0;


    for(var i=data.sort(sortNumber).length-1; i>=data.sort(sortNumber).length-3; i--){
        top3[count]=data[i];
        ratio[count] = Math.round(data[i]/sum*100);
        count++;
    }
    $('.amount')[1].innerHTML = ratio[0]+'<span>%</span>';


    $('.amount')[0].innerHTML = ratio[2]+'<span>%</span>';


    $('.amount')[2].innerHTML = ratio[1]+'<span>%</span>';
}
function sortNumber(a, b){ //排序，从大到小
    return a - b;
}

function draw3(data, sum) {
    var diagram = document.getElementById('diagram');
    var ctx = diagram.getContext('2d');
    var highest = 0;
    var index = 0;
    var average = parseInt(sum);
    var e = parseFloat(window.innerWidth/320).toFixed(2);  //根据iPhone5 的320宽等比放大
    diagram.style.width = 320*e+'px';
    diagram.style.height = 150*e+'px';
    ctx.beginPath();
    ctx.translate(0.5, 0.5);
    ctx.strokeStyle = '#c2c5ca';
    ctx.lineWidth = 1;
    ctx.moveTo(35, 10.5);
    ctx.lineTo(35, 125);  //y轴
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = '#394042';
    ctx.moveTo(25, 125);
    ctx.lineTo(280, 125);  //x轴
    ctx.stroke();
    $.ajax({
        url: 'src/js/template.json',
        type: 'GET',
        data: 'json',
        success: function(data){
            highest = data.eachDayPay[0];
            for(var i=0; i<data.eachDayPay.length; i++){
                if(data.eachDayPay[i]>highest){
                    highest=data.eachDayPay[i];
                    index=data.eachDayPay.indexOf(highest);
                }
            }
            var Y_set = getY_coordinate(highest);//Y轴纵坐标,由大到小 150, 100, 50, 0
            console.log(Y_set);
            for( i=0; i<(Y_set.length)*2; i++){
                ctx.beginPath();
                if(i===0){
                    ctx.strokeStyle = '#394042';
                }
                else{
                    ctx.strokeStyle = '#c2c5ca';
                }
                ctx.moveTo(25, (125-i*19));
                ctx.lineTo(35, (125-i*19));
                ctx.stroke();
            }
            for( i=Y_set.length-1; i>=0; i--){
                if(i==Y_set.length-1)
                {
                    ctx.fillText(Y_set[i], 18, i*38+14);
                }
                else{
                    if(Y_set[i]>=1000){
                        ctx.fillText(Y_set[i]/1000+'k', 23, i*38+14);
                    }else{
                        ctx.fillText(Y_set[i], 23, i*38+14);
                    }
                }
                    ctx.textAlign='end';
            }
            var weekday = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            ctx.font = '0.6rem Times New Roman';
            //画柱状图
            for(i=0; i<data.eachDayPay.length; i++){
                if(i==index){
                    var gradient = ctx.createLinearGradient(44+i*35, 124.5, 20,(-1)*(data.eachDayPay[i]/13.2));
                    gradient.addColorStop("1.0","rgba(39,180,95,1)");
                    gradient.addColorStop("0.4","rgba(39,180,95,1)");
                    gradient.addColorStop("0","rgba(39,180,95,0.53)");
                    ctx.fillStyle = gradient;
                    ctx.fillRect(48+i*32, 124.5, 16, (-1)*(114/highest*data.eachDayPay[i]));
                }
                else{
                    ctx.fillStyle = '#ced1d6';
                    ctx.fillRect(48+i*32, 124.5, 16, (-1)*(114/highest*data.eachDayPay[i]));
                }
                ctx.stroke();
            }

            //x轴每周
            ctx.fillStyle = '#394042';
            for(var i=0; i<weekday.length; i++){
                ctx.font="8px Arial";
                ctx.fillText(weekday[i],69+i*32, 144);
            }
            //画日均线

            //var y = 114-parseInt(average/7);  //日均线Y轴 114为总Y轴长度, 10.5为canvas起始点到Y轴起画点距离
            var y = 114-parseInt(114/Y_set[0]*average)+10.5;  //日均线Y轴 114为总Y轴长度, 10.5为canvas起始点到Y轴起画点距离
            ctx.beginPath();
            ctx.lineTo(35, y);
            ctx.lineTo(260, y);
            ctx.strokeStyle = 'rgba(58,99,117, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();


            //画日均线三角,“日均”文字
            ctx.fillStyle="#37403d";
            ctx.beginPath();
            ctx.moveTo(260,y);
            ctx.lineTo(267,y-4);
            ctx.lineTo(267,y+4);
            ctx.closePath();
            ctx.fill();
            ctx.font = "8px Times New Roman";
            ctx.fillText('日均', 295,y+4);
            ctx.stroke();
        },
        error: function(){
            console.log('read error')
        }
    })
}

//获取Y轴坐标
function getY_coordinate(highest){
    var String = highest.toString().length;
    var s1, s2;
    var Y_arr = [];
    if(String==1){
        s2=highest;
        s1=1;
    }
   else {
        s1 = Math.pow(10, (String - 2));
        s2 = parseInt(highest / s1);
    }
        for(var i=1; i<4; i++){
            if((s2)%3==0){
                s2 = s2*s1;
                break;
            }
            s2 = s2+1;
        }
        var Y_set = [];
        Y_set[0]=0;
        Y_set[3]=s2;
        var count = 0;
        var base = s2/3;
        for(var i=1; i<=base; i++){
            Y_set[count++] = s2;
            s2=s2-base;
            if(s2==0){
                Y_set[count++] = s2;
                break;
            }
        }

    return Y_set;
}



