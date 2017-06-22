/**
 * Created by Алексей on 20.06.2017.
 */
// код калькулятора из книги "JavaScript. Подробное руководство, 6-е издание" п.1.2.1 стр.33
// https://yadi.sk/d/haLH267C3KJa72/2017
//
"use strict"; // использовать строгий режим ECMAScript 5, если браузер поддерживает его
/*
Этот сценарий определяет функцию calculate(), вызываемую обработчиками событий в разметке HTML.
Функция читает значения элементов <input>, вычисляет размеры платежей по ссуде, отображает результаты
в элементах <span>. Кроме того, она сохраняет пользовательские данные, отображает ссылки на
кредитные учреждения и рисует диаграмму.
 */
function calculate()
{
  // найдем элементы ввода и вывода в документе
  var f_amount = document.getElementById("amount");
  var f_apr = document.getElementById("apr");
  var f_years = document.getElementById("years");
  var f_zipcode = document.getElementById("zipcode");
  var f_payment = document.getElementById("payment");
  var f_total = document.getElementById("total");
  var f_totalinterest = document.getElementById("totalinterest");

  // значения полей ввода
  var amount = f_amount.value;
  var apr = f_apr.value;
  var years = f_years.value;
  var zipcode = f_zipcode.value;

  // получить ввод пользователя из элементов ввода. Предполагается, что
  // вводимые данные корректные. Преобразовать процентную ставку из
  // процентов в десятичное число и преобразовать годовую ставку в
  // месячную ставку.
  // Преобразовать период период платежей в годах в количество месячных
  // платежей.
  var principal = parseFloat(amount);
  var interest = parseFloat(apr) / 100 / 12;
  var payments = parseFloat(years) * 12;

  // теперь вычислим сумму ежемесячного платежа
  var x = Math.pow(1 + interest, payments); // вычислим степень
  var monthly = (principal * x * interest) / (x-1);

  // если результат - конечное число, следовательно, пользователь
  // указал корректные данные и результаты можно отобразить.
  if(isFinite(monthly)) {
    // заполним поля вывода, округлив результат до 2 десятичных знаков
    f_payment.innerHTML = monthly.toFixed(2);
    var tot = monthly * payments;
    f_total.innerHTML = tot.toFixed(2);
    f_totalinterest.innerHTML = (tot - principal).toFixed(2);

    // сохранить ввод пользователя, чтобы можно было восстановить данные
    // при следующем открытии страницы
    save(amount, apr, years, zipcode);

    // отыскать и отобразить ссылки на сайты местных кредитных организаций
    try {
      getLenders(amount, apr, years, zipcode);
    } catch (e) {
      // перехватывать и игнорировать все ошибки
    }

    // вывести график изменения остатка по кредиту, а также графики сумм,
    // выплачиваемых в погашение кредита и по процентам
    chart(principal, interest, monthly, payments);
  } else {
      // результат не является числом или имеет бесконечное значение, что означает,
      // что были получены неполные или некорректные данные.
      f_payment.innerHTML = "";
      f_total.innerHTML = "";
      f_totalinterest.innerHTML = "";
      chart();
  }
}

// сохранить ввод пользователя в свойствах объекта localStorage. Значения этих свойств будут
// доступны при повторном посещении страницы. В некоторых браузерах (Firefox) возможность сохранения
// не поддерживается, если страница открывается с адресом RL вида file://. Однако она поддерживается
// при открытии страницы через HTTP.

/**
 * сохраняет параметры в свойствах объекта localStorage
 * @param amount
 * @param apr
 * @param years
 * @param zipcode
 */
function save(amount, apr, years, zipcode)
{
  // выполнить сохранение если, поддерживается
  if(window.localStorage) {
    localStorage.loan_amount = amount;
    localStorage.loan_apr = apr;
    localStorage.loan_years = years;
    localStorage.loan_zipcode = zipcode;
  }
}

// (глобальная область)
// автоматически восстановить поля ввода при загрузке документа
window.onload = function() {
  // если браузер поддерживает loacalStorage и имеются сохраненные данные
  if(window.localStorage && localStorage.loan_amount) {
    document.getElementById("amount").value = localStorage.loan_amount;
    document.getElementById("apr").value = localStorage.loan_apr;
    document.getElementById("years").value = localStorage.loan_years;
    document.getElementById("zipcode").value = localStorage.loan_zipcode;
  }
};

// передать ввод пользователя серверному сценарию
// который может (теоретич) возвращать список ссылок на сайты местных кредитных
// учреждений, готовых предоставить кредит.
// Данный пример не включает фактическую реализацию такого сценария.
function getLenders(amount, apr, years, zipcode)
{
    // если браузер не поддерживает объект XMLHttpRequest, не делать ничего
    if(!window.XMLHttpRequest) return;

    // отыскать элемент для отображения списка кредитных учреждений
    var ad = document.getElementById("lenders");
    if(!ad) return;     // выйти, если элемент отсутствует

    // преобразовать ввод пользователя в параметры запроса в строке URL
    var url = "http://localhost/getLenders.php" +    // адрес службы плюс данные пользователя
            "?amt=" + encodeURIComponent(amount) +
            "&apr=" + encodeURIComponent(apr) +
            "&yrs=" + encodeURIComponent(years) +
            "&zip=" + encodeURIComponent(zipcode);

    // получить содержимое по заданному адресу URL с помощью XMLHttpRequest
    var req = new XMLHttpRequest();     // создать новый запрос
    req.open("GET", url);               // указать тип запроса HTTP GET
    req.send(null);                     // отправить запрос без тела

    // перед возвратом зарегистрировать обработчик событий, который будет вызываться
    // при получении HTTP-ответа от сервера. Такой прием асинхронного программирования
    // является довольно обычным в клиентском JavaScript
    req.onreadystatechange = function () {
        if(req.readyState == 4 && req.status == 200) {
            // если мы попали сюда, значит был получен коректный HTTP-ответ
            var response = req.responseText;    // HTTP-ответ в виде строки
            var lenders = JSON.parse(response); // преобразовать в JS-массив

            // преобразовать массив объектов lender в HTML-строку
            var list = "";
            for(var i = 0; i <lenders.length; i++) {
                list += "<li><a href='" + lenders[i].url + "'>" +
                        lenders[i].name + "</a>";
            }

            // отобразить полученную HTML-строку в элементе,
            // ссылка на который была получена выше.
            ad.innerHTML = "<ul>" + list + "</ul>";
        }
    }
}

// График помесячного изменения остатка по кредиту, а также графики
// сумм, выплачиваемых в погашение кредита и по процентам в HTML-элементе
// <canvas>.
// если вызывается без аргументов, просто очищается ранее нарисованные графики.
/**
 * отобразить графики
 * @param principal
 * @param interest
 * @param monthly
 * @param payments
 */
function chart(principal, interest, monthly, payments)
{

    var graph = document.getElementById("graph"); // ссылка на тэг <canvas>
    graph.width = graph.width;    // Магия очистки элемента <canvas>

    // если функция вызвана без аргументов или браузер не поддерживает
    // элемент <canvas>, то просто вернуть управление.
    if(arguments.length == 0 || !graph.getContext) {
      return;
    }
    // получить объект "контекста" для элемента <canvas>,
    // который определяет набор методов рисования
    var g = graph.getContext("2d");   // рисование выполняется с помощью этого объекта
    var width = graph.width;          // получить ширину холста
    var height = graph.height;        // получить высоту холста

    // преобразуют кол-во месячных платежей
    function paymentToX(n) {
      return n * width / payments;
    }
    function amountToY(a) {
      return height - (a * height / (monthly*payments*1.05));
    }

    // платежи - прямая линия из точки (0,0) в точку (payments, monthly * payments)
    g.moveTo(paymentToX(0), amountToY(0));    // из нижнего левого угла
    g.lineTo(paymentToX(payments), amountToY(monthly*payments)); // в правый верхний
    g.lineTo(paymentToX(payments), amountToY(0)); // в правый нижний
    g.closePath();    // и обратно в начало
    g.fillStyle = "#f88"; // светло-красный
    g.fill();             // залить треугольник
    g.font = "bold 12px sans-serif";  // определить шрифт
    g.fillText("Total Interest Payments", 20,20); // вывести текст в легенде

    // кривая накопленной суммы погашения кредита не является линейной
    // и вывод ее реализуется немного сложнее.
    var equity = 0;
    var p, thisMonthsInterest;
    g.beginPath();    // новая фигура
    g.moveTo(paymentToX(0), amountToY(0));    // из левого нижнего угла
    for(p=1; p <= payments; p++) {
        // для каждого платежа выяснить долю выплат по процентам
        thisMonthsInterest = (principal-equity)*interest;
        equity += (monthly - thisMonthsInterest);   // остаток - погашение кредита
        g.lineTo(paymentToX(p), amountToY(equity));
    }
    g.lineTo(paymentToX(payments), amountToY(0));   // линию до оси X
    g.closePath();                      // и опять в нач. точку
    g.fillStyle = "green";              // заполнение зеленое
    g.fill();                           // залить область под кривой
    g.fillText("Total Equity", 20,35);  // надпись зеленым цветом

    // повторить цикл, как выше, но нарисовать график остатка по кредиту
    var bal = principal;
    g.beginPath();
    for(p=1; p <= payments; p++) {
        thisMonthsInterest = bal * interest;
        bal -= (monthly - thisMonthsInterest);    // остаток от погашения кредита
        g.lineTo(paymentToX(p), amountToY(bal));  // линию до точки
    }
    g.lineWidth = 3;    // жирная линия
    g.stroke();         // нарисовать кривую графика
    g.fillStyle = "black";              // черный цвет для текста
    g.fillText("Loan Balance", 20,50);  // элемент легенды

    // нарисовать отметки лет на оси X
    g.textAlign = "center";         // текст меток по центру
    var y = amountToY(0);           // координата Y на оси X
    for(var year=1; year*12 <= payments; year++) {  // для каждого года
        var x = paymentToX(year * 12);    // вычислить позицию метки
        g.fillRect(x - 0.5, y - 3, 1, 3);  // нарисовать метку
        if (year == 1) g.fillText("Year", x, y - 5);   // подписать ось
        if (year % 5 == 0 && year * 12 !== payments) { // числа через каждые 5 лет}
            g.fillText(String(year), x, y - 5);
        }
    }

    // суммы платежей у правой границы
    g.textAlign = "right";      // текст по правому краю
    g.textBaseline = "middle";  // центрировать по вертикали
    var ticks = [monthly*payments, principal];  // вывести две суммы
    var rightEdge = paymentToX(payments);       // Координата X на оси Y
    for(var i = 0; i < ticks.length; i++) {     // для каждой из 2 сумм
        y = amountToY(ticks[i]);            // определить координату Y
        g.fillRect(rightEdge-3,y-0.5, 3,1);     // нарисовать метку
        g.fillText(String(ticks[i].toFixed(0)), rightEdge-5,y);
    }
}