

var Folder = Backbone.Model.extend({
	defaults: {
		foldername : ''
	}
});

var FolderList = Backbone.Collection.extend ({
	url : "http://localhost:3000/api/folders"
})


var Bookmark = Backbone.Model.extend({
	defaults: {
		title: '',
		foldername: '',
		linkurl: ''
	}
});


var Bookmarks = Backbone.Collection.extend({
	url: 'http://localhost:3000/api/bookmarks/'
});


var bmList = new Bookmarks();
var folderList = new FolderList();

