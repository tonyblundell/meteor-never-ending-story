Sentences = new Meteor.Collection("sentences");

if (Meteor.is_client) {

    Sentences.find().observe({
        added: function(sentence) {
            if ($('#text').val() && sentence.name !== $('#name').val()) {
                Session.set('thunderStolen', true);
            }
        }
    })

    Template.story.sentences = function() {
        return Sentences.find({}, {sort: {date: 1}});
    };

    Template.form.events = {
        'click button': function(evt) {
            evt.preventDefault();
            var name = $('#name').val();
            var text = $('#text').val();
            if (name && text) {
                Meteor.call('addSentence', {name: name, text: text});
                $('#text').val('');
                Session.set('thunderStolen', false);
            }
        }
    };

    Template.form.thunderStolen = function() {
        return Session.get('thunderStolen');
    };
}


if (Meteor.is_server) {

    Meteor.startup(function () {
        if (Sentences.find().count() === 0) {
            Sentences.insert({name: 'Storyteller', text: 'Once upon a time,'});
        }
    });

    Meteor.methods({
        addSentence: function(sentence) {
            sentence.date = (new Date()).getTime();
            return Sentences.insert(sentence);
        }
    });

}