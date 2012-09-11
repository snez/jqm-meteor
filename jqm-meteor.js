if (Meteor.is_client) {

  Template.hello.greeting = function () {
    return "Welcome to jqm-meteor";
  };

  Template.status.status = function () {
    return Meteor.status().connected;
  };

  vegetables = new Meteor.Collection("vegetables");
  Meteor.subscribe("vegetables");

  Template.veggies.all = function () {
    return vegetables.find({});
  };
  Template.veggies.rendered = function() {
    $('[data-role="listview"]').listview("refresh"); // Always refresh widgets after rendering
  };

  Template.veggies.events = {
    'click li' : setVegetable, // browser handler
    'touchend li' : setVegetable // mobile device handler
  };
  
  Session.set("selectedVegetable", "None"); // Session does not persist if you refresh the page

  Template.selectedVeggie.vegName = function () { // .name is reserved, so we use .vegName
    return Session.get("selectedVegetable");
  };
  Template.selectedVeggie.status = function () {
    try {
      return vegetables.findOne({ name: Session.get("selectedVegetable") }).status;
    } catch (e) {
      return 0; // In case we did not select a vegetable yet
    }
  };
  Template.selectedVeggie.rendered = function() {
    $('[data-role="slider"]').slider(); // Re-initialize widgets within a <div>
    $('#flip').change(function (e) { // Re-bind events
      vegetables.update({ name: Session.get("selectedVegetable") }, { $set: { status: ($(e.target).val() == 'On') }});
    });
  };
}

if (Meteor.is_server) {
  Meteor.startup(function () {
    // code to run on server at startup
    vegetables = new Meteor.Collection("vegetables");
    if (!vegetables.find({}).count()) {
      vegetables.insert({name: "Potatoes", status: true});
      vegetables.insert({name: "Tomatoes", status: false});
      vegetables.insert({name: "Cucumbers", status: true});
    }
    Meteor.publish("vegetables");
  });
}

function setVegetable(e) {
  Session.set("selectedVegetable", $(e.target).attr('data-name'));
  var s = vegetables.findOne({ name: $(e.target).attr('data-name') }).status;
  $("#flip")[0].selectedIndex = s;
}