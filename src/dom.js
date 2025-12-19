const div = document.createElement('div');
const h1 = document.createElement('h1');
const form = document.createElement('form');
const dropZone = document.createElement('div');
dropZone.classList.add('upload-zone_dragover');
form.prepend(dropZone);
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
dropZone.appendChild(h2);
const p = document.createElement('p');
p.textContent = 'или';
dropZone.appendChild(p);
const label = document.createElement('label');
label.classList.add('label');
dropZone.appendChild(label);
const span = document.createElement('span');
span.id = 'preloadData';
span.textContent = 'Загрузите файлы';
label.appendChild(span);
const input = document.createElement('input');
label.appendChild(input);
input.type = 'file';
input.multiple = 'true';
input.accept = '.jpeg, .jpg, .png';
input.name = 'file';
input.classList.add('input');
input.addEventListener('change', onChange);
const submit = document.createElement('button');
submit.type = 'submit';
submit.textContent = 'Отправить';
submit.classList.add('submit');
dropZone.appendChild(submit);
const errorCol = document.createElement('span');
dropZone.appendChild(errorCol);
errorCol.classList.add('error');
const board = document.createElement('div');
board.classList.add('board');
const h3 = document.createElement('h3');
h3.classList.add('h3');
h3.textContent = 'Ваши файлы:';
board.appendChild(h3);
form.appendChild(board);
const fileColumn = document.createElement('div');
fileColumn.classList.add('file-column');
board.appendChild(fileColumn);

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

['dragover', 'drop'].forEach(function (e) {
    document.addEventListener(e, (ev) => {
        ev.preventDefault();
        return false;
    });
});

dropZone.addEventListener('dragenter', () => {
    dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active');
});
dropZone.addEventListener('drop', dropHandler);

window.addEventListener('drop', (e) => {
    if ([...e.dataTransfer.items].some((item) => item.kind === 'file')) {
        e.preventDefault();
    }
});
dropZone.addEventListener('dragover', (e) => {
    const fileItems = [...e.dataTransfer.items].filter(
        (item) => item.kind === 'file'
    );
    if (fileItems.length > 0) {
        e.preventDefault();
        if (
            fileItems.some(
                (item) =>
                    item.type.startsWith('image/png') ||
                    item.type.startsWith('image/jpg') ||
                    item.type.startsWith('image/jpeg')
            )
        ) {
            e.dataTransfer.dropEffect = 'copy';
        } else {
            e.dataTransfer.dropEffect = 'none';
        }
    }
});

window.addEventListener('dragover', (e) => {
    const fileItems = [...e.dataTransfer.items].filter(
        (item) => item.kind === 'file'
    );
    if (fileItems.length > 0) {
        e.preventDefault();
        if (!dropZone.contains(e.target)) {
            e.dataTransfer.dropEffect = 'none';
        }
    }
});

const ul = document.createElement('ul');
ul.classList.add('file-list');
fileColumn.appendChild(ul);

function displayImagesFiles(files, max = 10485760) {
    if (files.length <= 5) {
        for (let file of files) {
            if (file.size > max) {
                const spanErrorSize = document.createElement('span');
                spanErrorSize.classList.add('error');
                spanErrorSize.textContent =
                    'Превышен максимальный размер файла';
                const li = document.createElement('li');
                li.classList.add('list');
                li.appendChild(spanErrorSize);
                li.appendChild(spanErrorSize);
                ul.appendChild(li);
            } else {
                const li = document.createElement('li');
                li.classList.add('list');
                li.draggable = 'true';

                li.textContent =
                    `${file.name}` +
                    ' ' +
                    `${bytSize(file.size)}` +
                    ` ${file.type}`;
                ul.appendChild(li);

                const preview = document.createElement('img');
                preview.src = URL.createObjectURL(file);
                preview.alt = file.name;
                preview.classList.add('preview');
                li.prepend(preview);
                const btn = document.createElement('button');
                btn.textContent = 'Удалить ';
                btn.classList.add('btn');
                li.appendChild(btn);
                btn.addEventListener('click', btnClick);
                statusText('');
                const lists = document.querySelectorAll('.list');
                lists.forEach((list) => {
                    list.addEventListener('dragstart', (e) => {
                        list.id = 'dragged-list';
                        e.dataTransfer.effectAllowed = 'move';
                        e.dataTransfer.setData('list', '');
                    });
                    list.addEventListener('draggend', (e) => {
                        list.removeAttribute('id');
                    });
                });
            }
        }
    } else {
        statusText('Превышено допустимое количество файлов: 5');
    }
}

function dropHandler(ev) {
    ev.preventDefault();
    dropZone.classList.remove('active');
    const files = [...ev.dataTransfer.items]
        .map((item) => item.getAsFile())
        .filter((file) => file);
    setTimeout(() => {
        displayImagesFiles(files);
    }, 2000);
    setTimeout(() => maveProgress(), 1000);
    setTimeout(() => resetProgress(), 1500);
}

function statusText(text) {
    return (errorCol.textContent = text);
}

function onChange(e) {
    setTimeout(() => {
        displayImagesFiles(e.target.files);
    }, 2000);
    setTimeout(() => maveProgress(), 1000);
    setTimeout(() => resetProgress(), 1500);
}

//drag-n-drop-сортировка

const fileColumns = document.querySelectorAll('.file-column');

fileColumns.forEach((column) => {
    column.addEventListener('dragover', (e) => {
        if (e.dataTransfer.types.includes('list')) {
            e.preventDefault();
        }
    });
});

fileColumns.forEach((column) => {
    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedList = document.getElementById('dragged-list');
        draggedList.remove();
        column.children[0].appendChild(draggedList);
    });
});

function makePlaceholder(draggedList) {
    const placeholder = document.createElement('li');
    placeholder.classList.add('placeholder');
    placeholder.style.height = `${draggedList.offsetHeight}px`;
    return placeholder;
}

function movePlaceholder(e) {
    if (!e.dataTransfer.types.includes('list')) {
        return;
    }
    e.preventDefault();
    const draggedList = document.getElementById('dragged-list');
    const column = e.currentTarget;
    const lists = column.children[0];
    const existingPlaceholder = column.querySelector('.placeholder');
    if (existingPlaceholder) {
        const placeholderRect = existingPlaceholder.getBoundingClientRect();
        if (
            placeholderRect.top <= e.clientY &&
            placeholderRect.bottom >= e.clientY
        ) {
            return;
        }
    }
    for (const list of lists.children) {
        if (list.getBoundingClientRect().bottom >= e.clientY) {
            if (list === existingPlaceholder) return;
            existingPlaceholder?.remove();
            if (
                list === draggedList ||
                list.previousElementSibling === draggedList
            )
                return;
            lists.insertBefore(
                existingPlaceholder ?? makePlaceholder(draggedList),
                list
            );
            return;
        }
    }
    existingPlaceholder?.remove();
    if (lists.lastElementChild === draggedList) return;
    lists.append(existingPlaceholder ?? makePlaceholder(draggedList));
}

fileColumns.forEach((column) => {
    column.addEventListener('dragover', movePlaceholder);
    column.addEventListener('dragleave', (event) => {
        if (column.contains(event.relatedTarget)) return;
        const placeholder = column.querySelector('.placeholder');
        placeholder?.remove();
    });
    column.addEventListener('drop', (event) => {
        event.preventDefault();

        const draggedList = document.getElementById('dragged-list');
        const placeholder = column.querySelector('.placeholder');
        if (!placeholder) return;
        draggedList.remove();
        column.children[0].insertBefore(draggedList, placeholder);
        placeholder.remove();
    });
});

//создание прогресс-бара

const progressBar = document.createElement('div');
progressBar.classList.add('progress-bar');
h3.insertAdjacentElement('afterend', progressBar);
const progress = document.createElement('div');
progress.classList.add('progress');
progress.id = 'progress';
progressBar.appendChild(progress);

function maveProgress() {
    let current = 0;
    while (current < 200) {
        current = current + 200;
        progress.style.width = current + 'px';
    }
}

function resetProgress() {
    return (progress.style.width = 0 + 'px');
}
