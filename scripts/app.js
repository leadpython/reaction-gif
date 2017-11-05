var EventBus = new Vue();

// GIF COMPONENT
var Gif = Vue.component('gif', {
  props: ['meme'],
  data: function() {
    return {

    };
  },
  template: `
    <div class="gif-component">
      <div class="image-container"><img :src="'/img/' + meme.name + '.jpg'"></div>
      <label>Downloads: {{meme.downloads}}</label>
      <label>Views: {{meme.views}}</label>
      <label>Date Added: {{added}}</label>
    </div>
  `,
  computed: {
    added: function() {
      return this.meme.added;
    }
  }
});

// UPLOAD FORM POP UP
var UploadForm = Vue.component('upload-form', {
  props: [],
  data: function() {
    return {
      name: "",
      tag: "",
      tags: [],
      isName: false,
      isFile: false
    };
  },
  created: function() {
    var self = this;
    EventBus.$on('showUploadForm', function() {
      self.name = "";
      self.tag = "";
      self.tags = [];
    });
  },
  template: `
    <div id="upload-form" style="position: absolute; z-index: 99999; background: white;">
      <div id="form">
        <input v-model="name" type="text" @keyup="validate()">
        <div><input v-model="tag" type="text"><button @click="addTag()">add</button></div>
        <div><span v-for="item in tags">{{item + ' '}}</span></div>
        <button @click="chooseFile()">CHOOSE FILE</button>
        <button @click="upload()">UPLOAD</button>
        <label v-if="!isName">Name required.</label>
        <label v-if="!isFile">No file selected.</label>
      </div>
    </div>
  `,
  methods: {
    validate: function() {
      this.isName = this.name.length > 0;
      this.isFile = document.getElementById('upload-input').files.length > 0;
      return this.isName && this.isFile;
    },
    addTag: function() {
      this.tags.push(this.tag);
      this.tag = "";
    },
    chooseFile: function() {
      document.getElementById('upload-input').click();
    },
    upload: function() {
      if (!this.validate()) { return; }
      var self = this;
      var file = document.getElementById('upload-input').files[0];
      var formData = new FormData();
      var info = {
        name: self.name,
        tags: self.tags
      };

      formData.append('uploads[]', file);
      formData.append('data', JSON.stringify(info));
      axios.post('/api/upload', formData).then((response) => {
        console.log(response);
        console.log('upload successful!');
      });
    }
  }
});

// UPLOAD DONE POP UP
var UploadPopUp = Vue.component('upload-popup', {
  props: ['meme'],
  data: function() {

  },
  created: function() {
    var self = this;
    EventBus.$on('uploaded', function() {
      self.popup();
    });
  },
  template: `
    <div class="upload-popup">
      <span></span>
      <label>{{meme.name}} UPLOADED</label>
    </div>
  `,
  methods: {
    popup: function() {

    }
  }
});

// COLLECTION PAGE
var Collection = Vue.component('collection', {
  components: { Gif },
  data: function() {
    return {
      memes: []
    };
  },
  created: function() {
    var self = this;
    EventBus.$on('wentToCollection', function() {
      self.getMemes();
    });
  },
  mounted: function() {
    this.getMemes();
  },
  template: `
    <div class="page">
      <gif v-for="meme in memes" :meme="meme"></gif>
    </div>
  `,
  methods: {
    getMemes: function() {
      var self = this;
      axios.get('/api/memes').then((response) => {
        if (response) {
          self.memes = response.data;
        }
      });
    }
  }
});

// SEARCH PAGE
var Search = Vue.component('search', {
  components: { Gif },
  data: function() {
    return {

    };
  },
  template: `
    <div class="page">
      SEARCH
    </div>
  `
});

// APPLICATION
var App = new Vue({
  el: '#app',
  components: { Collection, Search, Gif, UploadForm, UploadPopUp },
  data: {
    pages: {
      collection: true,
      search: false
    },
    uploadForm: false
  },
  created: function() {
    var self = this;
    EventBus.$on('showUploadForm', function() {
      self.uploadForm = true;
    });
  },
  methods: {
    goTo: function(page) {
      for (var key in this.pages) {
        this.pages[key] = false;
      }
      this.pages[page] = true;
      if (page === 'collection') { EventBus.$emit('wentToCollection'); }
    },
    upload: function() {
      EventBus.$emit('showUploadForm');
    }
  }
});