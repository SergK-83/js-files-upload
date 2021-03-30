function byToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log((1024))));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

const element = (tag, classes = [], content) => {
  const node = document.createElement(tag);

  if (classes.length) {
    node.classList.add(...classes);
  }

  if (content) {
    node.textContent = content;
  }

  return node;
}

function noop() {}

export function upload(selector, options = {}) {
  let files = [];
  const onUpload = options.onUpload ?? noop;
  const input = document.querySelector(selector);
  const preview = element('div', ['preview']);
  const btnOpen = element('button', ['btn', 'mr-10'], 'Open');
  const btnUpload = element('button', ['btn', 'btn_primary'], 'Upload');

  btnUpload.style.display = 'none';

  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    const extsList = options.accept.join(',');

    input.setAttribute('accept', extsList)
  }

  input.insertAdjacentElement('afterend', preview);
  input.insertAdjacentElement('afterend', btnUpload);
  input.insertAdjacentElement('afterend', btnOpen);

  const triggerInputFile = () => input.click();

  const changeHandler = event => {
    if (!event.target.files.length) {
      return;
    }

    btnUpload.style.display = 'inline-block';

    files = Array.from(event.target.files);

    preview.innerHTML = '';

    files.forEach(file => {
      if (!file.type.match('image')) {
        return;
      }

      const reader = new FileReader();

      reader.onload = ev => {
        const itemHTML = `
          <div class="preview-image">
            <div class="preview-image__remove" data-name="${file.name}">&times;</div>
            <img src= "${ev.target.result}" alt="${file.name}"/>
            <div class="preview-image__info">
              <span>${file.name}</span>
              <span>${byToSize(file.size)}</span>
            </div>
          </div>
        `;

        preview.insertAdjacentHTML('afterbegin', itemHTML);
      };

      reader.readAsDataURL(file); // асинхронная операция
    });
  };

  const removeHandler = event => {
    if (!event.target.dataset) {
      return;
    } else if (event.target.dataset.name) {
      const {name} = event.target.dataset;

      files = files.filter(file => file.name !== name);

      if (!files.length) {
        btnUpload.style.display = 'none';
      }

      const el = preview.querySelector(`[data-name = "${name}"]`).closest('.preview-image');

      el.classList.add('removing');

      setTimeout(() => el.remove(), 300);
    }
  }

  const clearPreview = el => {
    el.style.bottom = '0';
    el.innerHTML = `<div class="preview-image__progress"></div>`;
  };

  const uploadHandler = () => {
    preview.querySelectorAll('.preview-image__remove').forEach(el => el.remove());
    const previewInfo = preview.querySelectorAll('.preview-image__info');

    previewInfo.forEach(clearPreview);
    options.onUpload(files, previewInfo);
  };

  btnOpen.addEventListener('click', triggerInputFile);
  input.addEventListener('change', changeHandler);
  preview.addEventListener('click', removeHandler);
  btnUpload.addEventListener('click', uploadHandler);
}

