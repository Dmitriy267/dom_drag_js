const div = document.createElement('div');
const h1 = document.createElement('h1');
const form = document.createElement('form');
div.classList.add('wrapper');
document.body.appendChild(div);
h1.textContent = 'Drag and Drop';
h1.classList.add('h1');
form.classList.add('form');
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
input.classList.add('input');
const ul = document.createElement('ul');
ul.classList.add('file-list');
form.appendChild(ul);
input.addEventListener('change', onChange);
function onChange(e) {
    const files = e.target.files;
    console.log(files);
    for (let file of files) {
        const li = document.createElement('li');
        li.classList.add('li');
        console.log(file.name);
        li.textContent =
            `${file.name}` + ' ' + `${bytSize(file.size)}` + ` ${file.type}`;
        ul.append(li);
    }
}

function bytSize(byts, press = 2) {
    const arr = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const index = parseInt(Math.floor(Math.log(byts) / Math.log(1024)));
    return Math.round(byts / Math.pow(1024, index), press) + ' ' + arr[index];
}
