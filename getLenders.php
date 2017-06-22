<?php
header("Access-Control-Allow-Origin: *");

echo <<<EOF
[ 
    { "url": "http://alfabank.ru", "name": "Alfa Bank"},
    { "url": "http://sberbank.ru", "name": "Sberbank"},
    { "url": "http://TinkoffBlack.ru", "name": "Tinkoff Black"},
    { "url": "http://citybank.ru", "name": "City Bank"}
]
EOF;

?>