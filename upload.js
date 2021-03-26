export function upload(selector, options = {}) {
  const input = document.querySelector(selector);
  const btnOpen = document.createElement('button');

  btnOpen.classList.add('btn');
  btnOpen.textContent = 'Open';

  if (options.multi) {
    input.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    const extsList = options.accept.join(',');

    input.setAttribute('accept', extsList)
  }

  input.insertAdjacentElement('afterend', btnOpen);

  const triggerInputFile = () => input.click();

  const changeHandler = event => {
    if (!event.target.files.length) {
      return;
    }

    const files = Array.from(event.target.files);

    files.forEach(file => {
      if (!file.type.match('image')) {
        return;
      }


    });
  }

  btnOpen.addEventListener('click', triggerInputFile);
  input.addEventListener('change', changeHandler);
}

