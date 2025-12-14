const div = document.createElement('div');
const h1 = document.createElement('h1');
const form = document.createElement('form');
div.classList.add('wrapper');
document.body.appendChild(div);
h1.textContent = 'Drag and Drop';
h1.classList.add('h1');
form.classList.add('form');
form.id = 'formElem';
div.appendChild(h1);
div.appendChild(form);
const h2 = document.createElement('h2');
h2.classList.add('h2');
h2.textContent = 'Перетащите сюда файлы';
form.appendChild(h2);
const p = document.createElement('p');
p.textContent = 'или';
form.appendChild(p);
const label = document.createElement('label');
label.classList.add('label');
form.appendChild(label);
const span = document.createElement('span');
span.textContent = 'Загрузите файлы';
label.appendChild(span);
const input = document.createElement('input');
label.appendChild(input);
input.type = 'file';
input.multiple = 'true';
input.accept = '.jpg, .jpeg, .png';
input.name = 'file';
input.classList.add('input');
input.addEventListener('change', onChange);
const submit = document.createElement('button');
submit.type = 'submit';
submit.textContent = 'Отправить';
submit.classList.add('submit');
form.appendChild(submit);
function onChange(e) {
    const files = e.target.files;
    const ul = document.createElement('ul');
    ul.classList.add('file-list');
    form.appendChild(ul);
    if (files.length <= 5) {
        for (let file of files) {
            const li = document.createElement('li');
            li.classList.add('li');

            li.textContent =
                `${file.name}` +
                ' ' +
                `${bytSize(file.size)}` +
                ` ${file.type}`;
            ul.appendChild(li);

            const preview = document.createElement('img');
            preview.src = URL.createObjectURL(file);
            preview.classList.add('preview');
            li.prepend(preview);
            const btn = document.createElement('button');
            btn.textContent = 'Удалить ';
            btn.classList.add('btn');
            li.appendChild(btn);
            btn.addEventListener('click', btnClick);
            const liCol = document.querySelectorAll('li');
            console.log(liCol.length);
        }
    }
    if (files.length > 5) {
        const limit = document.querySelector('ul');
        limit.remove();
        const p = document.createElement('p');
        p.textContent = 'Превышено допустимое количество файлов: 5';
        form.appendChild(p);
    }
}

function btnClick() {
    const li = document.querySelector('li');
    li.remove();
}

function bytSize(byts, press = 2) {
    const arr = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const index = parseInt(Math.floor(Math.log(byts) / Math.log(1024)));
    return Math.round(byts / Math.pow(1024, index), press) + ' ' + arr[index];
}

const formId = document.querySelector('#formElem');
formId.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(formId);
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: formData,
    });
    let result = await response.json();
    console.log(result);
});
