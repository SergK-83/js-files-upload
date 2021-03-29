import firebase from 'firebase/app';
import 'firebase/storage';
import {upload} from './upload';
import './main.scss';

const firebaseConfig = {
  apiKey: "AIzaSyCOIeBuD6epWZU-IRV7eA7H27L2l9w55Kg",
  authDomain: "js-files-upload.firebaseapp.com",
  projectId: "js-files-upload",
  storageBucket: "js-files-upload.appspot.com",
  messagingSenderId: "120059676418",
  appId: "1:120059676418:web:22e38c613a269ae4c4241b"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

upload('#inputFile', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`);
      const task = ref.put(file);

      task.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%';
        const block = blocks[index].querySelector('.preview-image__progress');

        block.textContent = percentage;
        block.style.width = percentage;
      }, error => {
        console.log(error);
      }, () => {
        console.log('Complete');
      });
    });
  }
});
