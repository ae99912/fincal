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
  }



}


// сохранить ввод пользователя в свойствах объекта localStorage
function save(amount, apr, years, zipcode)
{

}

// передать ввод пользователя серверному сценарию
function getLenders(amount, apr, years, zipcode)
{

}

// изобразить график
function chart(principal, interest, monthly, payments)
{

}