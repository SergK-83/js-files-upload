function byToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (!bytes) {
    return '0 Byte';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log((1024))));
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

export function upload(selector, options = {}) {
  const input = document.querySelector(selector);
  const btnOpen = document.createElement('button');
  const preview = document.createElement('div');

  preview.classList.add('preview');

  btnOpen.classList.add('btn');
  btnOpen.textContent = 'Open';

  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    const extsList = options.accept.join(',');

    input.setAttribute('accept', extsList)
  }

  input.insertAdjacentElement('afterend', preview);
  input.insertAdjacentElement('afterend', btnOpen);

  const triggerInputFile = () => input.click();

  const changeHandler = event => {
    if (!event.target.files.length) {
      return;
    }

    const files = Array.from(event.target.files);

    preview.innerHTML = '';

    files.forEach(file => {
      if (!file.type.match('image')) {
        return;
      }

      const reader = new FileReader();

      reader.onload = ev => {
        const itemHTML = `
          <div class="preview-image">
            <div class="preview-image__remove">&times;</div>
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

  btnOpen.addEventListener('click', triggerInputFile);
  input.addEventListener('change', changeHandler);
}

