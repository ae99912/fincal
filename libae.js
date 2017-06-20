/**
 * Created by Алексей on 20.06.2017.
 */

/**
 * добавляет отладочное соообщение в специальную секцию документа
 * @param msg   текст сообщения
 */
function debugmsg(msg)
{
  var log = document.getElementById("debuglog");
  // усли элемент отсутствует, то создадим его
  if(!log) {
    log = document.createElement("div");
    log.id = "debuglog";                      // установить атрибут id
    log.innerHTML = "<h1>Debug Log</h1>";  // начальное содержимое
    document.body.appendChild(log);           // добавить в конец документа
  }
  // теперь обернуть сообщение в тэг <pre> и добавить элемент debuglog
  var pre = document.createElement("pre");  // создать тэг <pre>
  var txt = document.createTextNode(msg);   // обернуть сообщегние в текстовый узел
  pre.appendChild(txt);                     // добавить текстовый узел в тэг <pre>
  log.appendChild(pre);                     // добавить в раздел debuglog новое сообщение
}

/**
 * скрывает элемент, изменяя его стиль
 * @param e       элемент
 * @param reflow  скрыть, используя место элемента
 */
function hide(e, reflow) {
  if(reflow) {
    e.style.display = "none";       // скрыть и использовать место элемента
  } else {
    e.style.visibility = "hidden";  // скрыть, но место оставить пустым
  }
}

/**
 * выделить элемент, добавляя или переопределяя HTML-атрибут class
 * @param e   элемент
 */
function highlight(e)
{
  if(!e.className) e.className = "hilite";
  else e.className += "hilite";
}