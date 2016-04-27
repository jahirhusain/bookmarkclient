//View to display the select list of folders
var NewBookmarkView = Backbone.View.extend({
    model: folderList,      
    el: '#container',
    initialize: function(){
      var self = this;
      this.model.fetch({
          dataType: 'jsonp',
          success: function(response) {
            _.each(response.toJSON(), function(item) {
            })
            self.render();
          },
          error: function() {
            console.log('Failed to get bookmarks!');
          }
      });
    },
    render: function(){
      var folderList = new FolderList();
      _.each(this.model.toJSON()[0].folders, function (v) {
          folderList.push({"folderName": v})
      })
      var variables = {fList: folderList }
      console.log(variables)
      var template = _.template( $("#new_bookmark").html(), variables  );
      this.$el.html( template ).promise().done(function(){
          $(".foldername-select").change(function(){
             $(".foldername-input").val($(".foldername-select").val())
          });
      });
      var variables = {fListNew: folderList }
      var template1 = _.template( $("#folder_list").html(), variables);
      $("#lvContainer").html(template1).promise().done(function(){
            $('.link').click(function() {
            var bmListView = new BMListView(this.innerHTML);
            $('#listtable').show();
            $('#lvContainer').hide();

            console.log(this.innerHTML);
          })
      })
      return this;
    }
  });

view = new NewBookmarkView();
Backbone.Model.prototype.idAttribute = '_id';

//Single bookmark view
var BMView = Backbone.View.extend({      
    // model : new Bookmark(),
    tagName: 'tr',
    initialize: function(){
      this.render()
    },
    events: {
      'click .edit-bm': 'edit',
      'click .update-bm': 'update',
      'click .calcel-bm': 'ignore',
      'click .delete-bm': 'remove'
  },
  ignore: function() {
    bmListView.render();
  },
  remove: function() {
    alert("Hi")
    this.model.destroy({
      success: function(response) {
        console.log('Successfully  deeted BM: ' + response.toJSON()._id);
      },
      error: function(err) {
        console.log('Failed to delete BM!');
      }
    });
  },
  edit: function() {
    $('.edit-bm').hide();
    $('.delete-bm').hide();
    this.$('.update-bm').show();
    this.$('.cancel').show();

    var title = this.$('.title').html();
    var linkurl = this.$('.linkurl').html();
    var foldername = this.$('.foldername').html();

    this.$('.title').html('<input type="text" class="form-control title-update" value="' + title + '">');
    this.$('.linkurl').html('<input type="text" class="form-control linkurl-update" value="' + linkurl + '">');
    fold_list = $('.foldername-input').html()
    this.$('.foldername').html('<select class="form-control foldername-update">' + fold_list + '</select>');
    $(".foldername-update").val(foldername);
  },
  update: function() {
    this.model.set('title', $('.title-update').val());
    this.model.set('foldername', $('.foldername-update').val());
    this.model.set('linkurl', $('.linkurl-update').val());

    this.model.save(null, {
      success: function(response) {
        console.log('Successfully UPDATED BM with _id: ' + response.toJSON()._id);
      },
      error: function(err) {
        console.log('Failed to update BM!');
      }
    });
  },
  render: function(){
    var template = _.template( $("#bookmark_list").html());
    this.$el.html(template(this.model.toJSON()));
    return this;
  }
  });


var newLoad = true;

//Bookmark List view
var BMListView = Backbone.View.extend({      
  model: bmList,
  el: $('.bm-list'),
  initialize: function(foldername){
    console.log("Initialize this");
      var self = this;
      this.model.on('add', this.render, this);
      this.model.on('change', function() {
        setTimeout(function() {
          self.render();
        }, 30);
      },this);
      this.model.on('remove', this.render, this);
      this.model.fetch({
        dataType: 'jsonp',
        data:{"foldername" : foldername},
        success: function(response) {
          console.log("Successfully received "+response.toJSON());
          self.render();
          newLoad = false;
        },
        error: function() {
          console.log('Failed to get bookmarks!');
        }
    });
  },
  render: function(){
    var self = this;
    this.$el.html('');

    console.log("RENDERING "+this.model.toArray())
    _.each(this.model.toArray(), function(bookmark) {
      console.log("rendering "+bookmark.toJSON())
        self.$el.append((new BMView({model: bookmark})).render().$el);
    });
    return this;
  }
});
var bmListView = new BMListView();



$(document).ready(function() {
  $('.add-bm').on('click', function() {
    var newBM = new Bookmark({
      title: $('.title-input').val(),
      linkurl: $('.linkurl-input').val(),
      foldername: $('.foldername-input').val()
    });
    $('.title-input').val('');
    $('.linkurl-input').val('');
    $('.foldername-input').val('');
    console.log(newBM.toJSON());
    bmList.add(newBM);
    newBM.save(null, {
      success: function(response) {
        console.log('Successfully SAVED newBM with _id: ' + response.toJSON()._id);
      },
      error: function() {
        console.log('Failed to save newBM!');
      }
    });
  })
})

$("#back_icon").click(function() {
    $('#lvContainer').show();
    $('#listtable').hide();
});

$("#newfolder").click(function() {
    $('.foldername-input').show();
    $('.foldername-select').hide();
});

