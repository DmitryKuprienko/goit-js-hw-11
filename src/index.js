import axios  from 'axios';


const refs={
    formRef: document.querySelector('#search-form'),
    inputRef:document.querySelector('input'),
    buttonRef:document.querySelector('button')


}

refs.inputRef.addEventListener('input', (e)=>{
    console.log(e.target.value)
})

axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });



console.log(refs.formRef)
console.log(refs.inputRef)
console.log(refs.buttonRef)