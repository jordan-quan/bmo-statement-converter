import axios from 'axios';

axios.post('http://localhost:3000/pdf/test', {
  title: 'Fred',
  type: 'Flintstone'
})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });