var App = new Vue({
  el: '#app',
  components: { Collection, Search, Gif },
  data: {
    
  },
  methods: {

  }
});

var Collection = Vue.component('collection', {
  components: { Gif },
  template: ``
});

var Search = Vue.component('search', {
  components: { Gif },
  template: ``
});

var Gif = Vue.component('gif', {
  props: ['data'],
  data: function() {

  },
  template: ``
})



console.log(axios);
document.getElementById('upload-input').onchange = (e) => {
  console.log('test!');
  var file = e.target.files[0];
  var formData = new FormData();
  formData.append('uploads[]', file, file.name);
  $.ajax({
    url: '/api/upload',
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(data){
      console.log(data);
      console.log('upload successful!');
    }
  });
  console.log(file);
}