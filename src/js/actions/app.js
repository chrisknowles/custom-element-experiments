function main() {
  document.querySelector('#app').getStream('click$')
    .subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log('done')
  )
}

export default main
