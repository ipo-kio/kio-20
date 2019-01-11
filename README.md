# Компиляция и запуск

1. Скомпилируйте проект kio-api, см. его README.md
1. Скопируйте оттуда каталог kio_test_box, его нужно положить в папку проекта kio-19, т.е. нужно создать путь kio-19/kio_test_box
1. Добавьте в каталог файл easeljs-1.0.0.min.js, его можно скачать по ссылке https://code.createjs.com/1.0.0/easeljs.min.js
(или найдите эту ссылку на https://code.createjs.com)
1. Команды `npm run` для компиляции и разработки аналогичны командам из kio-api.
1. Запускайте HTML файлы с задачами из каталога dist. Проблемы с запуском по протоколу file:// описаны
   в README.md из kio-api
   
# Создание задачи

Предположим, задача имеет идентификатор `taskid`. Такая задача должна быть реализована в файле `tasks/taskid/taskid.js`, класс
должен называться `Taskid`, т.е. с заглавной буквы. Шаблон для написания класса с задачей можно взять в файле `tasks/task.js`.

После компиляции, в каталоге `dist` появится файл `taskid.html`, который можно запустить для просмотра и отладки задачи.

В папке `tasks/taskid/res` можно положить ресурсы, в первую очередь, изображения. Они будут перенесены в каталог
`dist/taskid-resources`.