import {upload} from './upload';
import './main.scss';

upload('#inputFile', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif']
});
