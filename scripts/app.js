var EventBus = new Vue();

// GIF COMPONENT
var Gif = Vue.component('gif', {
  props: ['meme'],
  data: function() {
    return {

    };
  },
  mounted: function() {
    this.view();
  },
  template: `
    <div class="gif-component">
      <div class="image-container"><img :id="'gif-image-' + meme.name" :src="'/img/' + meme.name + '.gif'"></div>
      <div><label class="name">{{meme.name}}</label></div>
      <div><span class="tag" v-for="tag in meme.tags" @click="searchTag(tag)">{{tag}}</span></div>
      <div>
        <label style="font-size: 12px; margin: 0;"><strong>DOWNLOADS</strong>: {{meme.downloads}}</label>
        <label style="font-size: 12px; margin: 0;"><strong>VIEWS</strong>: {{meme.views}}</label>
      </div>
      <div><label class="added"><strong>ADDED</strong>: {{added}}</label></div>
      <div><button @click="download(this)">DOWNLOAD</button></div>
    </div>
  `,
  computed: {
    added: function() {
      return (new Date(this.meme.added)).toLocaleDateString("en-us", {  
        weekday: "long", year: "numeric", month: "short",  
        day: "numeric", hour: "2-digit", minute: "2-digit"
      });
    }
  },
  methods: {
    view: function() {
      var self = this;
      axios.put('/api/memes/viewed/' + this.meme._id).then((response) => {
        console.log(response);
        self.meme.views++;
      });
    },
    download: function() {
      var self = this;
      var image = document.getElementById('gif-image-' + this.meme.name);
      var a = document.createElement('a');
      a.href = image.src;
      a.download = this.meme.name + '.jpg';
      a.click();
      axios.put('/api/memes/downloaded/' + this.meme._id).then((response) => {
        console.log(response);
        self.meme.download++;
      });
      delete a;
    },
    searchTag: function(tag) {
      axios.get('/api/search/tag/' + tag).then((response) => {
        EventBus.$emit('searched', response.data);
      });
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
    <div id="upload-form">
      <div id="form">
        <div><input v-model="name" type="text" @keyup="validate()"></div>
        <div><input v-model="tag" type="text"><button @click="addTag()"><i style="font-size: 20px;" class="fa fa-plus" aria-hidden="true"></i></button></div>
        <div><span class="tag" v-for="item in tags">{{item + ' '}}</span></div>
        <div><input id="upload-input" type="file" name="uploads[]"></div>
        <div><button @click="upload()">UPLOAD</button></div>
        <div><button @click="close()">CANCEL</button></div>
        <div><label v-if="!isName">Name required.</label></div>
        <div><label v-if="!isFile">No file selected.</label></div>
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
    close: function() {
      EventBus.$emit('closeUploadForm');
    },
    upload: function() {
      if (!this.validate()) { return; }
      var self = this;
      var file = document.getElementById('upload-input').files[0];
      var formData = new FormData();
      var info = {
        name: self.name,
        tags: self.tags,
        size: file.size
      };

      formData.append('uploads[]', file);
      formData.append('data', JSON.stringify(info));
      axios.post('/api/upload', formData).then((response) => {
        EventBus.$emit('wentToCollection');
        EventBus.$emit('successUpload', {
          name: self.name,
        });
        console.log(response);
        console.log('upload successful!');
      });
    }
  }
});

// UPLOAD DONE POP UP
var UploadPopUp = Vue.component('upload-popup', {
  data: function() {
    return {
      shown: false
    }
  },
  created: function() {
    var self = this;
    EventBus.$on('successUpload', function(data) {
      self.popup();
    });
  },
  template: `
    <div v-show="shown" id="upload-popup">
      <span><i class="fa fa-check-circle-o" style="color: green; font-size: 75px;" aria-hidden="true"></i></span>
      <label>GIF UPLOADED!</label>
    </div>
  `,
  methods: {
    popup: function() {
      var self = this;
      self.shown = true;
      setTimeout(function() {
        self.shown = false;
      }, 3000);
    }
  }
});

// COLLECTION PAGE
var Collection = Vue.component('collection', {
  components: { Gif },
  data: function() {
    return {
      memes: [],
      sortType: 1
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
      <gif v-for="meme in memes" :meme="meme" :key="meme.name"></gif>
    </div>
  `,
  methods: {
    getMemes: function() {
      var self = this;
      axios.get('/api/memes').then((response) => {
        if (response) {
          self.memes = response.data.sort(function(a, b) {
            return Number(b.added) - Number(a.added);
          });
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
      entry: "",
      memes: []
    };
  },
  created: function() {
    var self = this;
    EventBus.$on('searched', function(data) {
      self.memes = data;
    });
  },
  template: `
    <div class="page">
      <div><input id="search" v-model="entry" type="text" @keyup="search()"></div>
      <div><gif v-for="meme in memes" :meme="meme"></gif></div>
    </div>
  `,
  methods: {
    search: function() {
      var self = this;
      axios.get('/api/search/' + self.entry).then((response) => {
        self.memes = response.data;
      });
    }
  }
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
    this.goTo('collection');
    EventBus.$on('showUploadForm', function() {
      self.uploadForm = true;
    });
    EventBus.$on('successUpload', function() {
      self.uploadForm = false;
    });
    EventBus.$on('searched', function() {
      self.goTo('search');
    });
    EventBus.$on('closeUploadForm', function() {
      self.uploadForm = false;
    });
  },
  methods: {
    goTo: function(page) {
      for (var key in this.pages) {
        this.pages[key] = false; 
        document.getElementById('navigation-' + key).style.background = 'transparent';
        document.getElementById('navigation-' + key).style.color = 'rgb(50,50,50)';
      }
      document.getElementById('navigation-' + page).style.background = 'rgb(50,50,50)';
      document.getElementById('navigation-' + page).style.color = 'white';
      this.pages[page] = true;
      if (page === 'collection') { EventBus.$emit('wentToCollection'); }
    },
    upload: function() {
      EventBus.$emit('showUploadForm');
    }
  }
});